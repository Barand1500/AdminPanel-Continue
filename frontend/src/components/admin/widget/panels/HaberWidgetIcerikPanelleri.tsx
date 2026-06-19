import { FormAlani, formInputSinifi, formSelectSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { EmojiSecici } from '@/components/form/EmojiSecici';
import { AdminAnahtarDugme, AdminFormBolumu } from '@/components/admin/ortak/AdminFormBilesenleri';
import {
  configGuncelle,
  configOku,
  uid,
} from '@/types/widget';
import type {
  WidgetHaberKarti,
  WidgetIletisimKarti,
  WidgetKoseYazari,
  WidgetKriptoPara,
  WidgetVideoKarti,
  WidgetHaberSekmesi,
  WidgetAcilisKapanisSaati,
} from '@/types/haberWidget';
import { ListeSiralayici } from './WidgetPanelOrtak';
import type { WidgetPanelProps } from './types';
import { useEffect, useState } from 'react';
import { TURKIYE_ILLERI } from '@/constants/turkiyeIlleri';
import { havaOnizleGetir } from '@/features/admin/havaApi';
import type { HavaDurumuYanit } from '@/features/site/havaApi';
import { kriptoOnizleGetir } from '@/features/admin/kriptoApi';

function TumunuGorAlanlari({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FormAlani etiket="Tümünü gör metni">
        <input className={formInputSinifi} value={cfg.tumunuGorMetin ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, tumunuGorMetin: e.target.value })))} />
      </FormAlani>
      <FormAlani etiket="Tümünü gör link">
        <input className={formInputSinifi} value={cfg.tumunuGorLink ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, tumunuGorLink: e.target.value })))} />
      </FormAlani>
    </div>
  );
}

function HaberKartEditor({ form, onChange, alan = 'haberKartlari' }: WidgetPanelProps & { alan?: 'haberKartlari' }) {
  const cfg = configOku(form);
  const kartlar = cfg[alan] ?? [];
  return (
    <ListeSiralayici<WidgetHaberKarti>
      ogeler={kartlar}
      onDegistir={(k) => onChange(configGuncelle(form, (c) => ({ ...c, [alan]: k })))}
      yeniEkle={() => ({ id: uid(), baslik: '', ozet: '', gorselUrl: '', link: '', tarih: '', yorumSayisi: 0 })}
      renderOge={(k, i) => (
        <div className="grid gap-2">
          <input className={formInputSinifi} placeholder="Başlık" value={k.baslik} onChange={(e) => {
            const kopya = [...kartlar]; kopya[i] = { ...k, baslik: e.target.value };
            onChange(configGuncelle(form, (c) => ({ ...c, [alan]: kopya })));
          }} />
          <textarea className={formInputSinifi} rows={2} placeholder="Özet" value={k.ozet ?? ''} onChange={(e) => {
            const kopya = [...kartlar]; kopya[i] = { ...k, ozet: e.target.value };
            onChange(configGuncelle(form, (c) => ({ ...c, [alan]: kopya })));
          }} />
          <GorselAlan etiket="" deger={k.gorselUrl ?? ''} onChange={(v) => {
            const kopya = [...kartlar]; kopya[i] = { ...k, gorselUrl: v };
            onChange(configGuncelle(form, (c) => ({ ...c, [alan]: kopya })));
          }} />
          <div className="grid gap-2 sm:grid-cols-3">
            <input className={formInputSinifi} placeholder="Link" value={k.link ?? ''} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, link: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, [alan]: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Tarih" value={k.tarih ?? ''} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, tarih: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, [alan]: kopya })));
            }} />
            <input type="number" className={formInputSinifi} placeholder="Yorum" value={k.yorumSayisi ?? 0} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, yorumSayisi: Number(e.target.value) };
              onChange(configGuncelle(form, (c) => ({ ...c, [alan]: kopya })));
            }} />
          </div>
        </div>
      )}
    />
  );
}

export function KoseYazarlariIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const yazarlar = cfg.koseYazarlari ?? [];
  return (
    <AdminFormBolumu baslik="Köşe Yazarları">
      <FormAlani etiket="Bölüm başlığı">
        <input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} placeholder="KÖŞE YAZARLARI" />
      </FormAlani>
      <TumunuGorAlanlari form={form} onChange={onChange} />
      <ListeSiralayici<WidgetKoseYazari>
        ogeler={yazarlar}
        onDegistir={(y) => onChange(configGuncelle(form, (c) => ({ ...c, koseYazarlari: y })))}
        yeniEkle={() => ({ id: uid(), yazarAd: '', baslik: '', ozet: '', link: '', tarih: '' })}
        renderOge={(y, i) => (
          <div className="grid gap-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <input className={formInputSinifi} placeholder="Yazar adı" value={y.yazarAd} onChange={(e) => {
                const k = [...yazarlar]; k[i] = { ...y, yazarAd: e.target.value };
                onChange(configGuncelle(form, (c) => ({ ...c, koseYazarlari: k })));
              }} />
              <input className={formInputSinifi} placeholder="Tarih" value={y.tarih ?? ''} onChange={(e) => {
                const k = [...yazarlar]; k[i] = { ...y, tarih: e.target.value };
                onChange(configGuncelle(form, (c) => ({ ...c, koseYazarlari: k })));
              }} />
            </div>
            <GorselAlan etiket="Yazar fotoğrafı" deger={y.yazarGorsel ?? ''} onChange={(v) => {
              const k = [...yazarlar]; k[i] = { ...y, yazarGorsel: v };
              onChange(configGuncelle(form, (c) => ({ ...c, koseYazarlari: k })));
            }} />
            <input className={formInputSinifi} placeholder="Yazı başlığı" value={y.baslik} onChange={(e) => {
              const k = [...yazarlar]; k[i] = { ...y, baslik: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, koseYazarlari: k })));
            }} />
            <textarea className={formInputSinifi} rows={2} placeholder="Özet" value={y.ozet ?? ''} onChange={(e) => {
              const k = [...yazarlar]; k[i] = { ...y, ozet: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, koseYazarlari: k })));
            }} />
            <input className={formInputSinifi} placeholder="Link" value={y.link ?? ''} onChange={(e) => {
              const k = [...yazarlar]; k[i] = { ...y, link: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, koseYazarlari: k })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function IletisimBlokIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const kartlar = cfg.iletisimKartlari ?? [];
  return (
    <AdminFormBolumu baslik="İletişim + Harita">
      <FormAlani etiket="Başlık"><input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} placeholder="Bizimle Çalışmaya Hazır mısınız?" /></FormAlani>
      <FormAlani etiket="Üst etiket"><input className={formInputSinifi} value={form.altBaslik} onChange={(e) => onChange({ ...form, altBaslik: e.target.value })} placeholder="İLETİŞİM" /></FormAlani>
      <FormAlani etiket="Açıklama"><textarea className={formInputSinifi} rows={2} value={form.aciklama} onChange={(e) => onChange({ ...form, aciklama: e.target.value })} /></FormAlani>
      <FormAlani etiket="Harita linki / adres"><input className={formInputSinifi} value={cfg.haritaUrl ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, haritaUrl: e.target.value })))} /></FormAlani>
      <ListeSiralayici<WidgetIletisimKarti>
        ogeler={kartlar}
        onDegistir={(k) => onChange(configGuncelle(form, (c) => ({ ...c, iletisimKartlari: k })))}
        yeniEkle={() => ({ id: uid(), etiket: '', deger: '', ikon: '📍' })}
        renderOge={(k, i) => (
          <div className="grid gap-2 sm:grid-cols-3">
            <EmojiSecici sadeceSecim deger={k.ikon ?? '📍'} onChange={(emoji) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, ikon: emoji };
              onChange(configGuncelle(form, (c) => ({ ...c, iletisimKartlari: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Etiket" value={k.etiket} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, etiket: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, iletisimKartlari: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Değer" value={k.deger} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, deger: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, iletisimKartlari: kopya })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function KategoriHaberListesiIcerik(props: WidgetPanelProps) {
  return (
    <AdminFormBolumu baslik="Kategori Haber Listesi">
      <FormAlani etiket="Kategori başlığı"><input className={formInputSinifi} value={props.form.baslik} onChange={(e) => props.onChange({ ...props.form, baslik: e.target.value })} /></FormAlani>
      <TumunuGorAlanlari {...props} />
      <HaberKartEditor {...props} />
    </AdminFormBolumu>
  );
}

export function KategoriHaberOverlayIcerik(props: WidgetPanelProps) {
  return (
    <AdminFormBolumu baslik="Kategori Haber Grid (Overlay)">
      <FormAlani etiket="Kategori başlığı"><input className={formInputSinifi} value={props.form.baslik} onChange={(e) => props.onChange({ ...props.form, baslik: e.target.value })} /></FormAlani>
      <TumunuGorAlanlari {...props} />
      <HaberKartEditor {...props} />
    </AdminFormBolumu>
  );
}

export function VideoGalerisiIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const videolar = cfg.videoKartlari ?? [];
  return (
    <AdminFormBolumu baslik="Video Galerisi">
      <FormAlani etiket="Başlık"><input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} /></FormAlani>
      <TumunuGorAlanlari form={form} onChange={onChange} />
      <ListeSiralayici<WidgetVideoKarti>
        ogeler={videolar}
        onDegistir={(v) => onChange(configGuncelle(form, (c) => ({ ...c, videoKartlari: v })))}
        yeniEkle={() => ({ id: uid(), baslik: '', gorselUrl: '', videoLink: '', link: '' })}
        renderOge={(v, i) => (
          <div className="space-y-2">
            <input className={formInputSinifi} placeholder="Başlık" value={v.baslik} onChange={(e) => {
              const k = [...videolar]; k[i] = { ...v, baslik: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, videoKartlari: k })));
            }} />
            <GorselAlan etiket="Kapak görseli" deger={v.gorselUrl ?? ''} onChange={(url) => {
              const k = [...videolar]; k[i] = { ...v, gorselUrl: url };
              onChange(configGuncelle(form, (c) => ({ ...c, videoKartlari: k })));
            }} />
            <input className={formInputSinifi} placeholder="Video link" value={v.videoLink ?? ''} onChange={(e) => {
              const k = [...videolar]; k[i] = { ...v, videoLink: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, videoKartlari: k })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function SekmeliHaberIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const sekmeler = cfg.haberSekmeler ?? [];
  return (
    <AdminFormBolumu baslik="Sekmeli Haber">
      <ListeSiralayici<WidgetHaberSekmesi>
        ogeler={sekmeler}
        onDegistir={(s) => onChange(configGuncelle(form, (c) => ({ ...c, haberSekmeler: s })))}
        yeniEkle={() => ({ id: uid(), baslik: 'Sekme', kartlar: [] })}
        renderOge={(s, si) => (
          <div className="space-y-2">
            <input className={formInputSinifi} placeholder="Sekme adı" value={s.baslik} onChange={(e) => {
              const k = [...sekmeler]; k[si] = { ...s, baslik: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, haberSekmeler: k })));
            }} />
            <p className="ap-muted text-xs">İlk kart öne çıkan, diğerleri liste olur.</p>
            <ListeSiralayici
              ogeler={s.kartlar}
              onDegistir={(kartlar) => {
                const k = [...sekmeler]; k[si] = { ...s, kartlar };
                onChange(configGuncelle(form, (c) => ({ ...c, haberSekmeler: k })));
              }}
              yeniEkle={() => ({ id: uid(), baslik: '', ozet: '', gorselUrl: '', link: '', tarih: '' })}
              renderOge={(k, ki) => (
                <div className="grid gap-1">
                  <input className={formInputSinifi} placeholder="Başlık" value={k.baslik} onChange={(e) => {
                    const kartlar = [...s.kartlar]; kartlar[ki] = { ...k, baslik: e.target.value };
                    const seks = [...sekmeler]; seks[si] = { ...s, kartlar };
                    onChange(configGuncelle(form, (c) => ({ ...c, haberSekmeler: seks })));
                  }} />
                  <input className={formInputSinifi} placeholder="Link" value={k.link ?? ''} onChange={(e) => {
                    const kartlar = [...s.kartlar]; kartlar[ki] = { ...k, link: e.target.value };
                    const seks = [...sekmeler]; seks[si] = { ...s, kartlar };
                    onChange(configGuncelle(form, (c) => ({ ...c, haberSekmeler: seks })));
                  }} />
                </div>
              )}
            />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function HavaDurumuIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const sehir = cfg.havaSehir ?? 'İstanbul';
  const ilce = cfg.havaIlce ?? '';
  const [onizleme, setOnizleme] = useState<HavaDurumuYanit | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');

  useEffect(() => {
    if (!sehir.trim()) return;
    let iptal = false;
    setYukleniyor(true);
    setHata('');
    void havaOnizleGetir(sehir, ilce)
      .then((veri) => {
        if (!iptal) setOnizleme(veri);
      })
      .catch((err) => {
        if (!iptal) setHata(err instanceof Error ? err.message : 'Hava verisi alınamadı');
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false);
      });
    return () => {
      iptal = true;
    };
  }, [sehir, ilce]);

  const konumGuncelle = (yeniSehir: string, yeniIlce: string) => {
    onChange(
      configGuncelle(form, (c) => ({
        ...c,
        havaSehir: yeniSehir,
        havaIlce: yeniIlce,
        havaKaynak: 'api',
        havaAnlik: undefined,
        havaGunler: undefined,
      }))
    );
  };

  const anlik = onizleme?.anlik;

  return (
    <AdminFormBolumu baslik="Hava Durumu" aciklama="Konum seçin; sıcaklık ve tahmin Open-Meteo API üzerinden otomatik gelir.">
      <div className="grid gap-3 sm:grid-cols-2">
        <FormAlani etiket="İl">
          <select
            className={formSelectSinifi}
            value={sehir}
            onChange={(e) => konumGuncelle(e.target.value, ilce)}
          >
            {TURKIYE_ILLERI.map((il) => (
              <option key={il} value={il}>{il}</option>
            ))}
          </select>
        </FormAlani>
        <FormAlani etiket="İlçe">
          <input
            className={formInputSinifi}
            value={ilce}
            onChange={(e) => konumGuncelle(sehir, e.target.value)}
            placeholder="Kadıköy"
          />
        </FormAlani>
      </div>
      {yukleniyor && <p className="ap-muted text-sm">Hava verisi yükleniyor...</p>}
      {hata && <p className="text-sm text-red-500">{hata}</p>}
      {anlik && !yukleniyor && (
        <div className="rounded-lg border border-[var(--ap-border)] bg-[var(--ap-surface-2)] p-4">
          <p className="mb-2 text-sm font-semibold text-[var(--ap-heading)]">Canlı önizleme</p>
          <p className="text-3xl font-bold">{anlik.sicaklik}</p>
          <p className="text-sm text-[var(--ap-muted)]">{anlik.durum}</p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            <span>Hissedilen: {anlik.hissedilen}</span>
            <span>Nem: {anlik.nem}</span>
            <span>Rüzgar: {anlik.ruzgar}</span>
          </div>
          {onizleme?.gunler?.length ? (
            <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
              {onizleme.gunler.slice(0, 4).map((gun: HavaDurumuYanit['gunler'][number]) => (
                <div key={gun.id} className="rounded bg-[var(--ap-surface)] p-2 text-center">
                  <p className="font-semibold">{gun.gun}</p>
                  <p>{gun.ikon} {gun.max}/{gun.min}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </AdminFormBolumu>
  );
}

const POPULER_KRIPTO = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'TRX', 'AVAX'];

export function KriptoListesiIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const apiMod = cfg.kriptoKaynak !== 'manuel';
  const limit = cfg.kriptoLimit ?? 10;
  const seciliSemboller = cfg.kriptoSemboller ?? [];
  const liste = cfg.kriptoParalar ?? [];
  const [onizleme, setOnizleme] = useState<Awaited<ReturnType<typeof kriptoOnizleGetir>>>([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    if (!apiMod) return;
    let iptal = false;
    setYukleniyor(true);
    void kriptoOnizleGetir(limit, seciliSemboller.length ? seciliSemboller : undefined)
      .then((veri) => {
        if (!iptal) setOnizleme(veri);
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false);
      });
    return () => {
      iptal = true;
    };
  }, [apiMod, limit, seciliSemboller.join(',')]);

  const sembolToggle = (sembol: string) => {
    const mevcut = new Set(seciliSemboller);
    if (mevcut.has(sembol)) mevcut.delete(sembol);
    else mevcut.add(sembol);
    onChange(
      configGuncelle(form, (c) => ({
        ...c,
        kriptoKaynak: 'api',
        kriptoSemboller: Array.from(mevcut),
        kriptoParalar: [],
      }))
    );
  };

  return (
    <AdminFormBolumu baslik="Kripto Paralar">
      <FormAlani etiket="Başlık">
        <input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} />
      </FormAlani>
      <TumunuGorAlanlari form={form} onChange={onChange} />
      <AdminAnahtarDugme
        etiket="Otomatik API'den güncelle"
        acik={apiMod}
        onDegistir={(acik) =>
          onChange(
            configGuncelle(form, (c) => ({
              ...c,
              kriptoKaynak: acik ? 'api' : 'manuel',
            }))
          )
        }
      />
      {apiMod ? (
        <>
          <FormAlani etiket="Liste limiti">
            <input
              type="number"
              min={1}
              max={50}
              className={formInputSinifi}
              value={limit}
              onChange={(e) =>
                onChange(
                  configGuncelle(form, (c) => ({
                    ...c,
                    kriptoLimit: Math.min(50, Math.max(1, Number(e.target.value) || 10)),
                  }))
                )
              }
            />
          </FormAlani>
          <FormAlani etiket="Sembol seçimi (boş = piyasa değerine göre top N)">
            <div className="flex flex-wrap gap-2">
              {POPULER_KRIPTO.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`rounded px-2 py-1 text-xs font-semibold ${
                    seciliSemboller.includes(s)
                      ? 'bg-[var(--ap-accent)] text-white'
                      : 'bg-[var(--ap-surface-2)] text-[var(--ap-heading)]'
                  }`}
                  onClick={() => sembolToggle(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </FormAlani>
          {yukleniyor && <p className="ap-muted text-sm">Kripto verisi yükleniyor...</p>}
          {onizleme.length > 0 && (
            <div className="rounded-lg border border-[var(--ap-border)] bg-[var(--ap-surface-2)] p-3 text-sm">
              <p className="mb-2 font-semibold">Canlı önizleme</p>
              {onizleme.map((k) => (
                <div key={k.id} className="flex justify-between border-b border-[var(--ap-border)] py-1 last:border-0">
                  <span>{k.sembol}</span>
                  <span>{k.fiyat}</span>
                  <span>{k.degisim}</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <ListeSiralayici<WidgetKriptoPara>
          ogeler={liste}
          onDegistir={(k) => onChange(configGuncelle(form, (c) => ({ ...c, kriptoParalar: k })))}
          yeniEkle={() => ({ id: uid(), sembol: 'BTC', ad: 'Bitcoin', fiyat: '$0', degisim: '0%' })}
          renderOge={(k, i) => (
            <div className="grid gap-2 sm:grid-cols-4">
              <input className={formInputSinifi} placeholder="Sembol" value={k.sembol} onChange={(e) => { const kopya = [...liste]; kopya[i] = { ...k, sembol: e.target.value }; onChange(configGuncelle(form, (c) => ({ ...c, kriptoParalar: kopya }))); }} />
              <input className={formInputSinifi} placeholder="Fiyat" value={k.fiyat} onChange={(e) => { const kopya = [...liste]; kopya[i] = { ...k, fiyat: e.target.value }; onChange(configGuncelle(form, (c) => ({ ...c, kriptoParalar: kopya }))); }} />
              <input className={formInputSinifi} placeholder="Değişim" value={k.degisim} onChange={(e) => { const kopya = [...liste]; kopya[i] = { ...k, degisim: e.target.value }; onChange(configGuncelle(form, (c) => ({ ...c, kriptoParalar: kopya }))); }} />
            </div>
          )}
        />
      )}
    </AdminFormBolumu>
  );
}

export function GuncelKonularIcerik(props: WidgetPanelProps) {
  return (
    <AdminFormBolumu baslik="Güncel Konular">
      <FormAlani etiket="Başlık"><input className={formInputSinifi} value={props.form.baslik} onChange={(e) => props.onChange({ ...props.form, baslik: e.target.value })} placeholder="GÜNCEL KONULAR" /></FormAlani>
      <HaberKartEditor {...props} />
    </AdminFormBolumu>
  );
}

const ACILIS_KAPANIS_VARSAYILAN: WidgetAcilisKapanisSaati = {
  haftaIciAcilis: '',
  haftaIciKapanis: '',
  cumartesiAcilis: '',
  cumartesiKapanis: '',
  pazarAcilis: '',
  pazarKapanis: '',
};

const ACILIS_KAPANIS_GUNLER: { baslik: string; acilis: keyof WidgetAcilisKapanisSaati; kapanis: keyof WidgetAcilisKapanisSaati }[] = [
  { baslik: 'Hafta İçi', acilis: 'haftaIciAcilis', kapanis: 'haftaIciKapanis' },
  { baslik: 'Cumartesi', acilis: 'cumartesiAcilis', kapanis: 'cumartesiKapanis' },
  { baslik: 'Pazar', acilis: 'pazarAcilis', kapanis: 'pazarKapanis' },
];

export function SirketGirisCikisIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const v = { ...ACILIS_KAPANIS_VARSAYILAN, ...cfg.acilisKapanisSaatleri };

  const saatGuncelle = (alan: keyof WidgetAcilisKapanisSaati, deger: string) => {
    onChange(configGuncelle(form, (c) => ({
      ...c,
      acilisKapanisSaatleri: { ...ACILIS_KAPANIS_VARSAYILAN, ...c.acilisKapanisSaatleri, [alan]: deger },
    })));
  };

  return (
    <AdminFormBolumu baslik="Şirket Açılış / Kapanış">
      <FormAlani etiket="Konum / birim">
        <input className={formInputSinifi} value={cfg.sirketKonum ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, sirketKonum: e.target.value })))} placeholder="Merkez Ofis — İstanbul" />
      </FormAlani>
      {ACILIS_KAPANIS_GUNLER.map((gun) => (
        <div key={gun.baslik} className="rounded-lg border border-[var(--ap-border)] bg-[var(--ap-surface-2)] p-3">
          <p className="mb-2 text-sm font-semibold text-[var(--ap-heading)]">{gun.baslik}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <FormAlani etiket="Açılış">
              <input className={formInputSinifi} value={v[gun.acilis]} placeholder="09:00" onChange={(e) => saatGuncelle(gun.acilis, e.target.value)} />
            </FormAlani>
            <FormAlani etiket="Kapanış">
              <input className={formInputSinifi} value={v[gun.kapanis]} placeholder="18:00" onChange={(e) => saatGuncelle(gun.kapanis, e.target.value)} />
            </FormAlani>
          </div>
        </div>
      ))}
      <FormAlani etiket="Anlık saat">
        <input className={formInputSinifi} value={cfg.sirketAnlikSaat ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, sirketAnlikSaat: e.target.value })))} placeholder="09:50:28" />
      </FormAlani>
      <FormAlani etiket="Kapanışa kalan">
        <input className={formInputSinifi} value={cfg.kapanisaKalan ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, kapanisaKalan: e.target.value })))} placeholder="08:09:32" />
      </FormAlani>
    </AdminFormBolumu>
  );
}

export function HaberMagazinIcerik(props: WidgetPanelProps) {
  return (
    <AdminFormBolumu baslik="Haber Magazin Grid">
      <FormAlani etiket="Kategori başlığı"><input className={formInputSinifi} value={props.form.baslik} onChange={(e) => props.onChange({ ...props.form, baslik: e.target.value })} /></FormAlani>
      <TumunuGorAlanlari {...props} />
      <HaberKartEditor {...props} />
    </AdminFormBolumu>
  );
}
