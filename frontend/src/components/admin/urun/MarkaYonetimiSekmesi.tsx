import { useCallback, useEffect, useState } from 'react';
import type { IkonSecimi } from '@/types/header';
import type { MarkaFormDegeri, UrunMarka } from '@/types/urunYonetimi';
import { markalariGetir, markaGuncelle, markaOlustur, markaSil } from '@/features/admin/urunYonetimiApi';
import { IkonSecici } from '@/components/admin/header/IkonSecici';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { AdminPanelKarti, BildirimKutusu, YukleniyorDurumu } from '@/components/admin/ortak/AdminBilesenleri';

const bosForm: MarkaFormDegeri = {
  ad: '',
  slug: '',
  gorselUrl: '',
  ikon: null,
  aktif: true,
  sira: 0,
};

function ikonToSecim(ikon: string | null): IkonSecimi {
  if (!ikon) return { tip: 'preset', presetId: 'favori-varsayilan' };
  return { tip: 'preset', presetId: ikon };
}

function secimToIkon(secim: IkonSecimi): string | null {
  if (secim.tip === 'custom') return null;
  return secim.presetId ?? null;
}

export function MarkaYonetimiSekmesi() {
  const [markalar, setMarkalar] = useState<UrunMarka[]>([]);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [form, setForm] = useState<MarkaFormDegeri>(bosForm);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      setMarkalar(await markalariGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Markalar alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    void yukle();
  }, [yukle]);

  function markaSec(m: UrunMarka) {
    setSeciliId(m.id);
    setForm({
      ad: m.ad,
      slug: m.slug,
      gorselUrl: m.gorselUrl ?? '',
      ikon: m.ikon,
      aktif: m.aktif,
      sira: m.sira,
    });
    setHata('');
    setBasari('');
  }

  const yeniBaslat = useCallback(() => {
    setSeciliId(null);
    setForm(bosForm);
    setHata('');
    setBasari('');
  }, []);

  const olustur = useCallback(async () => {
    if (seciliId) return;
    if (!form.ad.trim()) {
      setHata('Marka adı zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      await markaOlustur(form);
      setBasari('Marka eklendi.');
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniBaslat, yukle]);

  const guncelle = useCallback(async () => {
    if (!seciliId) return;
    if (!form.ad.trim()) {
      setHata('Marka adı zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      await markaGuncelle(seciliId, form);
      setBasari('Marka güncellendi.');
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniBaslat, yukle]);

  const silHandler = useCallback(async () => {
    if (!seciliId || !confirm('Bu markayı silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await markaSil(seciliId);
      setBasari('Marka silindi.');
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliId, yeniBaslat, yukle]);

  useModulAksiyonlari(
    {
      kaydet: olustur,
      guncelle,
      ekle: yeniBaslat,
      sil: silHandler,
    },
    {
      kaydet: !kaydediliyor && !seciliId,
      guncelle: !kaydediliyor && !!seciliId,
      ekle: true,
      sil: !!seciliId && !kaydediliyor,
    }
  );

  if (yukleniyor) return <YukleniyorDurumu mesaj="Markalar yükleniyor..." />;

  return (
    <div className="space-y-4">
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      <div className="ap-urun-marka-grid">
        {markalar.length === 0 ? (
          <p className="ap-muted col-span-full py-8 text-center text-sm">Henüz marka yok.</p>
        ) : (
          markalar.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => markaSec(m)}
              className={`ap-urun-marka-kart ${seciliId === m.id ? 'ap-urun-marka-kart-secili' : ''}`}
            >
              {m.gorselUrl ? (
                <img src={m.gorselUrl} alt="" className="ap-urun-marka-gorsel" />
              ) : (
                <div className="ap-urun-marka-gorsel ap-urun-marka-gorsel-bos">🏷️</div>
              )}
              <span className="font-medium text-sm">{m.ad}</span>
              {!m.aktif && <span className="ap-etiket ap-etiket-pasif mt-1">Pasif</span>}
            </button>
          ))
        )}
      </div>

      <AdminPanelKarti baslik={seciliId ? 'Marka Düzenle' : 'Yeni Marka'}>
        <div className="space-y-4">
          <FormAlani etiket="Marka Adı">
            <input
              className={formInputSinifi}
              value={form.ad}
              onChange={(e) => setForm({ ...form, ad: e.target.value })}
              placeholder="Marka adı"
            />
          </FormAlani>
          <GorselAlan
            etiket="Marka Logosu"
            deger={form.gorselUrl}
            onChange={(v) => setForm({ ...form, gorselUrl: v })}
            onizlemeSinifi="h-16 w-16 rounded-lg object-contain border border-[var(--ap-border)] bg-white p-1"
          />
          <IkonSecici
            etiket="İkon"
            aciklama="Logo yoksa ikon gösterilir"
              grup="hesap"
            deger={ikonToSecim(form.ikon)}
            onChange={(ikon) => setForm({ ...form, ikon: secimToIkon(ikon) })}
          />
          <FormAlani etiket="Sıra">
            <input
              className={formInputSinifi}
              type="number"
              min={0}
              value={form.sira}
              onChange={(e) => setForm({ ...form, sira: Number(e.target.value) || 0 })}
            />
          </FormAlani>
          <label className="flex items-center gap-2 text-sm text-[var(--ap-text)]">
            <input type="checkbox" checked={form.aktif} onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
            Aktif
          </label>
        </div>
      </AdminPanelKarti>
    </div>
  );
}
