import { useCallback, useEffect, useState } from 'react';
import type { IkonSecimi } from '@/types/header';
import { HAZIR_ROZETLER, type RozetFormDegeri, type UrunRozet } from '@/types/urunYonetimi';
import { rozetleriGetir, rozetGuncelle, rozetOlustur, rozetSil } from '@/features/admin/urunYonetimiApi';
import { IkonSecici } from '@/components/admin/header/IkonSecici';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { RenkSecici } from '@/components/form/RenkSecici';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { AdminPanelKarti, BildirimKutusu, YukleniyorDurumu } from '@/components/admin/ortak/AdminBilesenleri';

const bosOzelForm: RozetFormDegeri = {
  ad: '',
  tip: 'ozel',
  hazirKod: null,
  renk: null,
  gorselUrl: '',
  ikon: null,
  aktif: true,
  sira: 0,
};

function ikonToSecim(ikon: string | null): IkonSecimi {
  if (!ikon) return { tip: 'preset', presetId: 'favori-yildiz' };
  return { tip: 'preset', presetId: ikon };
}

function secimToIkon(secim: IkonSecimi): string | null {
  if (secim.tip === 'custom') return null;
  return secim.presetId ?? null;
}

export function RozetYonetimiSekmesi() {
  const [rozetler, setRozetler] = useState<UrunRozet[]>([]);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [form, setForm] = useState<RozetFormDegeri>(bosOzelForm);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      setRozetler(await rozetleriGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Rozetler alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    void yukle();
  }, [yukle]);

  const hazirRozetler = rozetler.filter((r) => r.tip === 'hazir');
  const ozelRozetler = rozetler.filter((r) => r.tip === 'ozel');

  function rozetSec(r: UrunRozet) {
    setSeciliId(r.id);
    setForm({
      ad: r.ad,
      tip: r.tip,
      hazirKod: r.hazirKod,
      renk: r.renk,
      gorselUrl: r.gorselUrl ?? '',
      ikon: r.ikon,
      aktif: r.aktif,
      sira: r.sira,
    });
    setHata('');
    setBasari('');
  }

  async function hazirEkle(kod: string, ad: string, renk: string) {
    if (rozetler.some((r) => r.hazirKod === kod)) {
      setHata('Bu hazır rozet zaten eklenmiş');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    try {
      await rozetOlustur({
        ad,
        tip: 'hazir',
        hazirKod: kod,
        renk,
        gorselUrl: '',
        ikon: null,
        aktif: true,
        sira: rozetler.length,
      });
      setBasari(`${ad} rozeti eklendi.`);
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Ekleme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }

  const yeniOzel = useCallback(() => {
    setSeciliId(null);
    setForm(bosOzelForm);
    setHata('');
    setBasari('');
  }, []);

  const olustur = useCallback(async () => {
    if (seciliId || form.tip !== 'ozel') return;
    if (!form.ad.trim()) {
      setHata('Rozet adı zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      await rozetOlustur(form);
      setBasari('Rozet eklendi.');
      yeniOzel();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniOzel, yukle]);

  const guncelle = useCallback(async () => {
    if (!seciliId) return;
    if (form.tip === 'ozel' && !form.ad.trim()) {
      setHata('Rozet adı zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      await rozetGuncelle(seciliId, form);
      setBasari('Rozet güncellendi.');
      yeniOzel();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniOzel, yukle]);

  const silHandler = useCallback(async () => {
    if (!seciliId || !confirm('Bu rozeti silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await rozetSil(seciliId);
      setBasari('Rozet silindi.');
      yeniOzel();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliId, yeniOzel, yukle]);

  useModulAksiyonlari(
    {
      kaydet: olustur,
      guncelle,
      ekle: yeniOzel,
      sil: silHandler,
    },
    {
      kaydet: !kaydediliyor && !seciliId && form.tip === 'ozel',
      guncelle: !kaydediliyor && !!seciliId,
      ekle: true,
      sil: !!seciliId && !kaydediliyor && form.tip === 'ozel',
    }
  );

  if (yukleniyor) return <YukleniyorDurumu mesaj="Rozetler yükleniyor..." />;

  return (
    <div className="space-y-5">
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      <AdminPanelKarti baslik="Hazır Rozetler" altBaslik="Tek tıkla siteye eklenebilir rozetler">
        <div className="ap-urun-rozet-hazir-grid">
          {HAZIR_ROZETLER.map((h) => {
            const mevcut = hazirRozetler.find((r) => r.hazirKod === h.kod);
            return (
              <div key={h.kod} className="ap-urun-rozet-hazir-kart">
                <span
                  className="ap-urun-rozet-onizleme"
                  style={{ backgroundColor: h.renk }}
                >
                  {h.ad}
                </span>
                {mevcut ? (
                  <button type="button" onClick={() => rozetSec(mevcut)} className="ap-link-btn text-xs">
                    Düzenle
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void hazirEkle(h.kod, h.ad, h.renk)}
                    disabled={kaydediliyor}
                    className="text-xs font-semibold text-[var(--ap-accent)]"
                  >
                    + Ekle
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </AdminPanelKarti>

      <AdminPanelKarti baslik="Özel Rozetler" altBaslik="Görsel veya ikon ile özelleştirilmiş rozetler">
        {ozelRozetler.length > 0 && (
          <div className="ap-urun-marka-grid mb-4">
            {ozelRozetler.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => rozetSec(r)}
                className={`ap-urun-marka-kart ${seciliId === r.id ? 'ap-urun-marka-kart-secili' : ''}`}
              >
                {r.gorselUrl ? (
                  <img src={r.gorselUrl} alt="" className="ap-urun-marka-gorsel" />
                ) : (
                  <div
                    className="ap-urun-rozet-onizleme text-xs"
                    style={{ backgroundColor: r.renk ?? 'var(--ap-accent)' }}
                  >
                    {r.ad}
                  </div>
                )}
                <span className="text-sm font-medium">{r.ad}</span>
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4 border-t border-[var(--ap-border)] pt-4">
            {form.tip === 'hazir' ? (
              <>
                <p className="ap-muted text-sm">
                  Hazır rozet: <strong className="ap-heading">{form.ad}</strong>
                </p>
                <RenkSecici
                  etiket="Arka Plan Rengi"
                  deger={form.renk ?? ''}
                  onChange={(v) => setForm({ ...form, renk: v || null })}
                  varsayilan="#8b5cf6"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.aktif} onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
                  Aktif
                </label>
              </>
            ) : (
              <>
            <FormAlani etiket="Rozet Adı">
              <input
                className={formInputSinifi}
                value={form.ad}
                onChange={(e) => setForm({ ...form, ad: e.target.value, tip: 'ozel' })}
                placeholder="Özel rozet adı"
              />
            </FormAlani>
            <RenkSecici
              etiket="Arka Plan Rengi"
              deger={form.renk ?? ''}
              onChange={(v) => setForm({ ...form, renk: v || null })}
              varsayilan="#8b5cf6"
            />
            <GorselAlan
              etiket="Rozet Görseli"
              deger={form.gorselUrl}
              onChange={(v) => setForm({ ...form, gorselUrl: v })}
              onizlemeSinifi="h-12 w-12 rounded object-cover border border-[var(--ap-border)]"
            />
            <IkonSecici
              etiket="İkon"
              grup="hesap"
              deger={ikonToSecim(form.ikon)}
              onChange={(ikon) => setForm({ ...form, ikon: secimToIkon(ikon) })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.aktif} onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
              Aktif
            </label>
              </>
            )}
        </div>
      </AdminPanelKarti>
    </div>
  );
}
