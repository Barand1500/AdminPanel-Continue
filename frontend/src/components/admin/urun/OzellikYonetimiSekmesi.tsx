import { useCallback, useEffect, useState } from 'react';
import type {
  GrupFormDegeri,
  OzellikFormDegeri,
  SablonFormDegeri,
  UrunKategori,
  UrunOzellik,
  UrunOzellikGrup,
  UrunOzellikSablon,
} from '@/types/urunYonetimi';
import {
  grupGuncelle,
  grupOlustur,
  grupSil,
  kategorileriGetir,
  ozellikAgaciniGetir,
  ozellikGuncelle,
  ozellikOlustur,
  ozellikSil,
  sablonOlustur,
  sablonSil,
} from '@/features/admin/urunYonetimiApi';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { AdminPanelKarti, BildirimKutusu, YukleniyorDurumu } from '@/components/admin/ortak/AdminBilesenleri';

export function OzellikYonetimiSekmesi() {
  const [sablonlar, setSablonlar] = useState<UrunOzellikSablon[]>([]);
  const [kategoriler, setKategoriler] = useState<UrunKategori[]>([]);
  const [seciliSablonId, setSeciliSablonId] = useState<string | null>(null);
  const [seciliGrupId, setSeciliGrupId] = useState<string | null>(null);
  const [seciliOzellikId, setSeciliOzellikId] = useState<string | null>(null);
  const [sablonAd, setSablonAd] = useState('');
  const [grupForm, setGrupForm] = useState<GrupFormDegeri>({ sablonId: '', kategoriId: null, ad: '', sira: 0 });
  const [ozellikForm, setOzellikForm] = useState<OzellikFormDegeri>({ grupId: '', ad: '', gorselUrl: '', ikon: null, sira: 0 });
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      const [s, k] = await Promise.all([ozellikAgaciniGetir(), kategorileriGetir()]);
      setSablonlar(s);
      setKategoriler(k);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Veriler alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    void yukle();
  }, [yukle]);

  const seciliSablon = sablonlar.find((s) => s.id === seciliSablonId);
  const seciliGrup = seciliSablon?.gruplar.find((g) => g.id === seciliGrupId);

  async function sablonKaldir(id: string) {
    if (!confirm('Şablon ve tüm grupları silinecek. Emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await sablonSil(id);
      if (seciliSablonId === id) setSeciliSablonId(null);
      setBasari('Şablon silindi.');
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }

  async function grupKaldir(id: string) {
    if (!confirm('Grup silinecek. Emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await grupSil(id);
      if (seciliGrupId === id) setSeciliGrupId(null);
      setBasari('Grup silindi.');
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }

  function grupSec(g: UrunOzellikGrup) {
    setSeciliGrupId(g.id);
    setGrupForm({
      sablonId: g.sablonId,
      kategoriId: g.kategoriId,
      ad: g.ad,
      sira: g.sira,
    });
    setSeciliOzellikId(null);
    setOzellikForm({ grupId: g.id, ad: '', gorselUrl: '', ikon: null, sira: 0 });
  }

  function ozellikSec(o: UrunOzellik) {
    setSeciliOzellikId(o.id);
    setOzellikForm({
      grupId: o.grupId,
      ad: o.ad,
      gorselUrl: o.gorselUrl ?? '',
      ikon: o.ikon,
      sira: o.sira,
    });
  }

  async function ozellikKaldir(id: string) {
    if (!confirm('Özellik silinecek. Emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await ozellikSil(id);
      if (seciliOzellikId === id) setSeciliOzellikId(null);
      setBasari('Özellik silindi.');
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }

  const yeniBaslat = useCallback(() => {
    if (seciliGrupId) {
      setSeciliOzellikId(null);
      setOzellikForm({ grupId: seciliGrupId, ad: '', gorselUrl: '', ikon: null, sira: 0 });
    } else if (seciliSablonId) {
      setSeciliGrupId(null);
      setGrupForm({ sablonId: seciliSablonId, kategoriId: null, ad: '', sira: 0 });
    } else {
      setSablonAd('');
    }
    setHata('');
    setBasari('');
  }, [seciliGrupId, seciliSablonId]);

  const olustur = useCallback(async () => {
    if (seciliGrupId && !seciliOzellikId && ozellikForm.ad.trim()) {
      setKaydediliyor(true);
      try {
        await ozellikOlustur({ ...ozellikForm, grupId: seciliGrupId });
        setOzellikForm({ grupId: seciliGrupId, ad: '', gorselUrl: '', ikon: null, sira: 0 });
        setBasari('Özellik eklendi.');
        await yukle();
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Özellik kaydedilemedi');
      } finally {
        setKaydediliyor(false);
      }
      return;
    }
    if (seciliSablonId && !seciliGrupId && grupForm.ad.trim()) {
      setKaydediliyor(true);
      try {
        await grupOlustur({ ...grupForm, sablonId: seciliSablonId });
        setGrupForm({ sablonId: seciliSablonId, kategoriId: null, ad: '', sira: 0 });
        setBasari('Grup eklendi.');
        await yukle();
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Grup kaydedilemedi');
      } finally {
        setKaydediliyor(false);
      }
      return;
    }
    if (!seciliSablonId && sablonAd.trim()) {
      setKaydediliyor(true);
      try {
        await sablonOlustur({ ad: sablonAd, sira: sablonlar.length } satisfies SablonFormDegeri);
        setSablonAd('');
        setBasari('Şablon eklendi.');
        await yukle();
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Şablon eklenemedi');
      } finally {
        setKaydediliyor(false);
      }
    } else {
      setHata('Kaydedilecek içerik bulunamadı');
    }
  }, [grupForm, ozellikForm, sablonAd, sablonlar.length, seciliGrupId, seciliOzellikId, seciliSablonId, yukle]);

  const guncelle = useCallback(async () => {
    if (seciliOzellikId && seciliGrupId) {
      if (!ozellikForm.ad.trim()) {
        setHata('Özellik adı zorunludur');
        return;
      }
      setKaydediliyor(true);
      try {
        await ozellikGuncelle(seciliOzellikId, { ...ozellikForm, grupId: seciliGrupId });
        setOzellikForm({ grupId: seciliGrupId, ad: '', gorselUrl: '', ikon: null, sira: 0 });
        setSeciliOzellikId(null);
        setBasari('Özellik güncellendi.');
        await yukle();
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Özellik kaydedilemedi');
      } finally {
        setKaydediliyor(false);
      }
      return;
    }
    if (seciliGrupId && !seciliOzellikId) {
      if (!grupForm.ad.trim() || !seciliSablonId) {
        setHata('Grup adı zorunludur');
        return;
      }
      setKaydediliyor(true);
      try {
        await grupGuncelle(seciliGrupId, { ...grupForm, sablonId: seciliSablonId });
        setBasari('Grup güncellendi.');
        await yukle();
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Grup kaydedilemedi');
      } finally {
        setKaydediliyor(false);
      }
    }
  }, [grupForm, ozellikForm, seciliGrupId, seciliOzellikId, seciliSablonId, yukle]);

  const silHandler = useCallback(async () => {
    if (seciliOzellikId) {
      await ozellikKaldir(seciliOzellikId);
      return;
    }
    if (seciliGrupId) {
      await grupKaldir(seciliGrupId);
      return;
    }
    if (seciliSablonId) {
      await sablonKaldir(seciliSablonId);
    }
  }, [seciliGrupId, seciliOzellikId, seciliSablonId]);

  const kaydetAktif =
    !kaydediliyor &&
    ((seciliGrupId && !seciliOzellikId && !!ozellikForm.ad.trim()) ||
      (seciliSablonId && !seciliGrupId && !!grupForm.ad.trim()) ||
      (!seciliSablonId && !!sablonAd.trim()));

  const guncelleAktif =
    !kaydediliyor &&
    ((!!seciliOzellikId && !!ozellikForm.ad.trim()) ||
      (!!seciliGrupId && !seciliOzellikId && !ozellikForm.ad.trim() && !!grupForm.ad.trim()));

  useModulAksiyonlari(
    {
      kaydet: olustur,
      guncelle,
      ekle: yeniBaslat,
      sil: silHandler,
    },
    {
      kaydet: kaydetAktif,
      guncelle: guncelleAktif,
      ekle: true,
      sil: !!(seciliOzellikId || seciliGrupId || seciliSablonId) && !kaydediliyor,
    }
  );

  if (yukleniyor) return <YukleniyorDurumu mesaj="Özellik şablonları yükleniyor..." />;

  return (
    <div className="space-y-4">
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      <div className="ap-urun-ozellik-layout">
        <AdminPanelKarti baslik="Şablonlar" altBaslik="Ürün özellik şablonları">
          <div className="mb-3">
            <input
              className={formInputSinifi}
              placeholder="Yeni şablon adı — alt bardan Kaydet"
              value={sablonAd}
              onChange={(e) => setSablonAd(e.target.value)}
            />
          </div>
          <ul className="ap-liste">
            {sablonlar.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSeciliSablonId(s.id);
                    setSeciliGrupId(null);
                    setGrupForm({ sablonId: s.id, kategoriId: null, ad: '', sira: 0 });
                  }}
                  className={`ap-liste-oge w-full ${seciliSablonId === s.id ? 'ap-liste-oge-secili' : ''}`}
                >
                  {s.ad}
                  <span className="ap-muted block text-xs">{s.gruplar.length} grup</span>
                </button>
              </li>
            ))}
          </ul>
        </AdminPanelKarti>

        <AdminPanelKarti baslik="Gruplar" altBaslik={seciliSablon ? seciliSablon.ad : 'Şablon seçin'}>
          {!seciliSablonId ? (
            <p className="ap-muted text-sm">Önce bir şablon seçin.</p>
          ) : (
            <>
              <ul className="ap-liste mb-4 max-h-48 overflow-y-auto">
                {seciliSablon?.gruplar.map((g) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      onClick={() => grupSec(g)}
                      className={`ap-liste-oge w-full ${seciliGrupId === g.id ? 'ap-liste-oge-secili' : ''}`}
                    >
                      {g.ad}
                      <span className="ap-muted block text-xs">{g.ozellikler.length} özellik</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="space-y-3 border-t border-[var(--ap-border)] pt-3">
                <FormAlani etiket="Grup Adı">
                  <input
                    className={formInputSinifi}
                    value={grupForm.ad}
                    onChange={(e) => setGrupForm({ ...grupForm, ad: e.target.value })}
                  />
                </FormAlani>
                <FormAlani etiket="Kategori (opsiyonel)">
                  <select
                    className={formInputSinifi}
                    value={grupForm.kategoriId ?? ''}
                    onChange={(e) => setGrupForm({ ...grupForm, kategoriId: e.target.value || null })}
                  >
                    <option value="">Tüm kategoriler</option>
                    {kategoriler.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.ad}
                      </option>
                    ))}
                  </select>
                </FormAlani>
              </div>
            </>
          )}
        </AdminPanelKarti>

        <AdminPanelKarti baslik="Özellikler" altBaslik={seciliGrup ? seciliGrup.ad : 'Grup seçin'}>
          {!seciliGrupId ? (
            <p className="ap-muted text-sm">Önce bir grup seçin.</p>
          ) : (
            <>
              <ul className="ap-liste mb-4 max-h-48 overflow-y-auto">
                {seciliGrup?.ozellikler.map((o) => (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => ozellikSec(o)}
                      className={`ap-liste-oge w-full ${seciliOzellikId === o.id ? 'ap-liste-oge-secili' : ''}`}
                    >
                      {o.ad}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="space-y-3 border-t border-[var(--ap-border)] pt-3">
                <FormAlani etiket="Özellik Adı">
                  <input
                    className={formInputSinifi}
                    value={ozellikForm.ad}
                    onChange={(e) => setOzellikForm({ ...ozellikForm, ad: e.target.value })}
                  />
                </FormAlani>
                <GorselAlan
                  etiket="Görsel"
                  deger={ozellikForm.gorselUrl}
                  onChange={(v) => setOzellikForm({ ...ozellikForm, gorselUrl: v })}
                  onizlemeSinifi="h-12 w-12 rounded object-cover border border-[var(--ap-border)]"
                />
              </div>
            </>
          )}
        </AdminPanelKarti>
      </div>
    </div>
  );
}
