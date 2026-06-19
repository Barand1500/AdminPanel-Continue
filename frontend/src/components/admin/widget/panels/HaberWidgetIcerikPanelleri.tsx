import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { EmojiSecici } from '@/components/form/EmojiSecici';
import { AdminFormBolumu } from '@/components/admin/ortak/AdminFormBilesenleri';
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
  const anlik = cfg.havaAnlik ?? { sicaklik: '22°', durum: 'Parçalı Bulutlu', hissedilen: '23°', nem: '%60', ruzgar: '5 m/s' };
  return (
    <AdminFormBolumu baslik="Hava Durumu">
      <div className="grid gap-3 sm:grid-cols-2">
        <FormAlani etiket="Şehir"><input className={formInputSinifi} value={cfg.havaSehir ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, havaSehir: e.target.value })))} /></FormAlani>
        <FormAlani etiket="İlçe"><input className={formInputSinifi} value={cfg.havaIlce ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, havaIlce: e.target.value })))} /></FormAlani>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {(['sicaklik', 'durum', 'hissedilen', 'nem', 'ruzgar'] as const).map((alan) => (
          <FormAlani key={alan} etiket={alan}>
            <input className={formInputSinifi} value={anlik[alan] ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, havaAnlik: { ...anlik, [alan]: e.target.value } })))} />
          </FormAlani>
        ))}
      </div>
    </AdminFormBolumu>
  );
}

export function KriptoListesiIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const liste = cfg.kriptoParalar ?? [];
  return (
    <AdminFormBolumu baslik="Kripto Paralar">
      <FormAlani etiket="Başlık"><input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} /></FormAlani>
      <TumunuGorAlanlari form={form} onChange={onChange} />
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
