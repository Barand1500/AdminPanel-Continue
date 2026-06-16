import { useCallback, useEffect, useMemo, useState } from 'react';
import type { TopluGorselEslestirme } from '@/types/urunYonetimi';
import { topluGorselYukle } from '@/features/admin/urunYonetimiApi';
import { adminUrunleriGetir, type AdminUrun } from '@/features/admin/urunApi';
import { adminMedyaYukle, medyaTamUrl } from '@/features/admin/medyaApi';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { AdminPanelKarti, BildirimKutusu, YukleniyorDurumu } from '@/components/admin/ortak/AdminBilesenleri';

interface DosyaEslestirme {
  dosya: File;
  urunId: string | null;
  gorselUrl: string;
  durum: 'bekliyor' | 'eslesti' | 'eslesmedi';
}

function dosyaUrunEslestir(dosyaAdi: string, urunler: AdminUrun[]): AdminUrun | undefined {
  const temiz = dosyaAdi.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9ğüşıöç]/gi, '');
  return urunler.find((u) => {
    const slug = u.slug.toLowerCase();
    const ad = u.ad.toLowerCase().replace(/[^a-z0-9ğüşıöç]/gi, '');
    const dosyaTemiz = temiz.replace(/[^a-z0-9]/gi, '');
    return slug === dosyaTemiz || ad === dosyaTemiz || slug.includes(dosyaTemiz) || dosyaTemiz.includes(slug);
  });
}

export function TopluGorselSekmesi() {
  const [urunler, setUrunler] = useState<AdminUrun[]>([]);
  const [eslestirmeler, setEslestirmeler] = useState<DosyaEslestirme[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [islemde, setIslemde] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      setUrunler(await adminUrunleriGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Ürünler alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    void yukle();
  }, [yukle]);

  const ozet = useMemo(
    () => ({
      toplam: eslestirmeler.length,
      eslesti: eslestirmeler.filter((e) => e.durum === 'eslesti').length,
      eslesmedi: eslestirmeler.filter((e) => e.durum === 'eslesmedi').length,
    }),
    [eslestirmeler]
  );

  async function dosyalariSec(files: FileList | null) {
    if (!files?.length) return;
    setHata('');
    setBasari('');
    setIslemde(true);
    const yeni: DosyaEslestirme[] = [];

    try {
      for (const dosya of Array.from(files)) {
        const urun = dosyaUrunEslestir(dosya.name, urunler);
        const medya = await adminMedyaYukle(dosya, dosya.name);
        const gorselUrl = medyaTamUrl(medya.url);
        yeni.push({
          dosya,
          urunId: urun?.id ?? null,
          gorselUrl,
          durum: urun ? 'eslesti' : 'eslesmedi',
        });
      }
      setEslestirmeler((prev) => [...prev, ...yeni]);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Dosya yüklenemedi');
    } finally {
      setIslemde(false);
    }
  }

  function urunAta(index: number, urunId: string) {
    setEslestirmeler((prev) =>
      prev.map((e, i) =>
        i === index ? { ...e, urunId, durum: urunId ? 'eslesti' : 'eslesmedi' } : e
      )
    );
  }

  const uygula = useCallback(async () => {
    const payload: TopluGorselEslestirme[] = eslestirmeler
      .filter((e) => e.urunId)
      .map((e) => ({ urunId: e.urunId!, gorselUrl: e.gorselUrl }));

    if (payload.length === 0) {
      setHata('Eşleşen ürün bulunamadı');
      return;
    }

    setIslemde(true);
    setHata('');
    try {
      const sonuc = await topluGorselYukle(payload);
      setBasari(`${sonuc.guncellenen} ürün görseli güncellendi.`);
      setEslestirmeler([]);
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Güncelleme başarısız');
    } finally {
      setIslemde(false);
    }
  }, [eslestirmeler, yukle]);

  useModulAksiyonlari(
    { guncelle: uygula },
    {
      guncelle: !islemde && ozet.eslesti > 0,
      kaydet: false,
      ekle: false,
      sil: false,
      onizle: false,
      yayinla: false,
    }
  );

  if (yukleniyor) return <YukleniyorDurumu mesaj="Ürünler yükleniyor..." />;

  return (
    <div className="space-y-4">
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {islemde && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      <AdminPanelKarti
        baslik="Toplu Görsel Yükle"
        altBaslik="Dosya adları ürün slug veya adıyla eşleştirilir (örn. iphone-15.jpg)"
      >
        <div className="space-y-4">
          <label className="ap-urun-toplu-yukle-alan">
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => void dosyalariSec(e.target.files)}
              disabled={islemde}
            />
            <span className="text-2xl">📁</span>
            <span className="font-medium">Görselleri seçin veya sürükleyin</span>
            <span className="ap-muted text-xs">PNG, JPG, WEBP</span>
          </label>

          {eslestirmeler.length > 0 && (
            <>
              <div className="flex flex-wrap gap-3 text-sm">
                <span>Toplam: {ozet.toplam}</span>
                <span className="text-green-500">Eşleşen: {ozet.eslesti}</span>
                <span className="text-amber-500">Eşleşmeyen: {ozet.eslesmedi}</span>
              </div>

              <ul className="ap-liste max-h-96 overflow-y-auto">
                {eslestirmeler.map((e, i) => (
                  <li key={`${e.dosya.name}-${i}`} className="ap-urun-toplu-satir">
                    <img src={e.gorselUrl} alt="" className="h-12 w-12 rounded object-cover border border-[var(--ap-border)]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{e.dosya.name}</p>
                      <select
                        className="mt-1 w-full rounded border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-2 py-1 text-xs"
                        value={e.urunId ?? ''}
                        onChange={(ev) => urunAta(i, ev.target.value)}
                      >
                        <option value="">Ürün seçin</option>
                        {urunler.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.ad}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span
                      className={`ap-etiket shrink-0 ${
                        e.durum === 'eslesti' ? 'ap-etiket-aktif' : 'ap-etiket-gri'
                      }`}
                    >
                      {e.durum === 'eslesti' ? 'Eşleşti' : 'Eşleşmedi'}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </AdminPanelKarti>
    </div>
  );
}
