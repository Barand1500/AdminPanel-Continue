import { useCallback, useEffect, useState } from 'react';
import type { UrunYorum } from '@/types/urunYonetimi';
import { yorumlariGetir, yorumOnayla, yorumSil } from '@/features/admin/urunYonetimiApi';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { AdminPanelKarti, BildirimKutusu, YukleniyorDurumu } from '@/components/admin/ortak/AdminBilesenleri';

export function YorumYonetimiSekmesi() {
  const [yorumlar, setYorumlar] = useState<UrunYorum[]>([]);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [filtre, setFiltre] = useState<'tumu' | 'bekleyen' | 'onayli'>('bekleyen');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [islemde, setIslemde] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      setYorumlar(await yorumlariGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Yorumlar alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    void yukle();
  }, [yukle]);

  const filtreli = yorumlar.filter((y) => {
    if (filtre === 'bekleyen') return !y.onaylandi;
    if (filtre === 'onayli') return y.onaylandi;
    return true;
  });

  async function onayDurumu(id: string, onaylandi: boolean) {
    setIslemde(true);
    setHata('');
    try {
      await yorumOnayla(id, onaylandi);
      setBasari(onaylandi ? 'Yorum onaylandı.' : 'Yorum reddedildi.');
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'İşlem başarısız');
    } finally {
      setIslemde(false);
    }
  }

  const seciliYorum = yorumlar.find((y) => y.id === seciliId);

  const guncelle = useCallback(async () => {
    if (!seciliId || !seciliYorum) return;
    await onayDurumu(seciliId, !seciliYorum.onaylandi);
  }, [seciliId, seciliYorum]);

  const silHandler = useCallback(async () => {
    if (!seciliId || !confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    setIslemde(true);
    try {
      await yorumSil(seciliId);
      setBasari('Yorum silindi.');
      setSeciliId(null);
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setIslemde(false);
    }
  }, [seciliId, yukle]);

  useModulAksiyonlari(
    { guncelle, sil: silHandler },
    {
      guncelle: !!seciliId && !islemde,
      sil: !!seciliId && !islemde,
      kaydet: false,
      ekle: false,
      onizle: false,
      yayinla: false,
    }
  );

  if (yukleniyor) return <YukleniyorDurumu mesaj="Yorumlar yükleniyor..." />;

  return (
    <div className="space-y-4">
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {islemde && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      <div className="flex flex-wrap gap-2">
        {(['bekleyen', 'onayli', 'tumu'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFiltre(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              filtre === f ? 'bg-[var(--ap-accent)] text-white' : 'text-[var(--ap-muted)] hover:bg-[var(--ap-hover)]'
            }`}
          >
            {f === 'bekleyen' ? 'Onay Bekleyen' : f === 'onayli' ? 'Onaylı' : 'Tümü'}
          </button>
        ))}
      </div>

      <AdminPanelKarti baslik={`Yorumlar (${filtreli.length})`}>
        {filtreli.length === 0 ? (
          <p className="ap-muted text-sm">Bu filtrede yorum yok.</p>
        ) : (
          <ul className="space-y-3">
            {filtreli.map((y) => (
              <li
                key={y.id}
                className={`ap-urun-yorum-kart cursor-pointer ${seciliId === y.id ? 'ring-2 ring-[var(--ap-accent)]' : ''}`}
                onClick={() => setSeciliId(y.id)}
                onKeyDown={(e) => e.key === 'Enter' && setSeciliId(y.id)}
                role="button"
                tabIndex={0}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{y.ad}</p>
                    <p className="ap-muted text-xs">
                      {y.urun?.ad ?? 'Ürün'} · {'★'.repeat(y.puan)}
                      {y.email && ` · ${y.email}`}
                    </p>
                  </div>
                  <span className={`ap-etiket ${y.onaylandi ? 'ap-etiket-aktif' : 'ap-etiket-gri'}`}>
                    {y.onaylandi ? 'Onaylı' : 'Bekliyor'}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed">{y.yorum}</p>
                <p className="ap-muted mt-1 text-xs">
                  {new Date(y.olusturma).toLocaleString('tr-TR')}
                </p>
                <div className="mt-3 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                  {!y.onaylandi && (
                    <button
                      type="button"
                      onClick={() => void onayDurumu(y.id, true)}
                      disabled={islemde}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Onayla
                    </button>
                  )}
                  {y.onaylandi && (
                    <button
                      type="button"
                      onClick={() => void onayDurumu(y.id, false)}
                      disabled={islemde}
                      className="rounded-lg border border-amber-500/50 px-3 py-1.5 text-xs font-semibold text-amber-500"
                    >
                      Reddet
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminPanelKarti>
    </div>
  );
}
