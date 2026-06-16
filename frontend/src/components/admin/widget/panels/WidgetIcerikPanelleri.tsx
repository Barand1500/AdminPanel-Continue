import type { ComponentType } from 'react';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { AdminFormBolumu } from '@/components/admin/ortak/AdminFormBilesenleri';
import {
  configGuncelle,
  configOku,
  uid,
  type WidgetBlogKart,
  type WidgetGaleriOgesi,
  type WidgetGorselGridKart,
  type WidgetKartOgesi,
  type WidgetLinkOgesi,
  type WidgetSlide,
  type WidgetSssOgesi,
} from '@/types/widget';
import { ListeSiralayici, SecimAlani } from './WidgetPanelOrtak';
import type { WidgetPanelProps } from './types';

function MetinAlanlari({ form, onChange, gorsel = false }: WidgetPanelProps & { gorsel?: boolean }) {
  const cfg = configOku(form);
  return (
    <AdminFormBolumu baslik="Metin Bloğu" aciklama="Başlık ve içerik metni">
      <FormAlani etiket="Başlık">
        <input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} />
      </FormAlani>
      <FormAlani etiket="İçerik">
        <textarea
          className={`${formInputSinifi} min-h-[120px]`}
          value={cfg.metin ?? ''}
          onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, metin: e.target.value })))}
        />
      </FormAlani>
      {gorsel && (
        <GorselAlan
          etiket="Görsel"
          deger={form.gorselUrl}
          onChange={(v) => onChange({ ...form, gorselUrl: v })}
        />
      )}
      <SecimAlani
        etiket="Metin hizalama"
        deger={cfg.gorunum?.hizalama ?? 'sol'}
        secenekler={[
          { id: 'sol', etiket: 'Sol' },
          { id: 'orta', etiket: 'Orta' },
          { id: 'sag', etiket: 'Sağ' },
        ]}
        onChange={(v) =>
          onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, hizalama: v as 'sol' | 'orta' | 'sag' } })))
        }
      />
      {gorsel && (
        <SecimAlani
          etiket="Görsel konumu"
          deger={cfg.gorunum?.icerikDuzeni ?? 'sol'}
          secenekler={[
            { id: 'sol', etiket: 'Görsel sol' },
            { id: 'sag', etiket: 'Görsel sağ' },
            { id: 'ust', etiket: 'Görsel üst' },
            { id: 'alt', etiket: 'Görsel alt' },
          ]}
          onChange={(v) =>
            onChange(
              configGuncelle(form, (c) => ({
                ...c,
                gorunum: { ...c.gorunum, icerikDuzeni: v as 'sol' | 'sag' | 'ust' | 'alt' },
              }))
            )
          }
        />
      )}
    </AdminFormBolumu>
  );
}

export function BaslikMetinIcerik(props: WidgetPanelProps) {
  return <MetinAlanlari {...props} />;
}

export function BaslikMetinGorselIcerik(props: WidgetPanelProps) {
  return <MetinAlanlari {...props} gorsel />;
}

export function SliderIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const slides = cfg.slides ?? [];
  return (
    <AdminFormBolumu baslik="Slaytlar" aciklama="Her slayt için görsel ve metin">
      <ListeSiralayici<WidgetSlide>
        ogeler={slides}
        onDegistir={(slidesYeni) => onChange(configGuncelle(form, (c) => ({ ...c, slides: slidesYeni })))}
        yeniEkle={() => ({ id: uid(), gorselUrl: '', baslik: '', altBaslik: '', butonMetni: '', butonLink: '', aktif: true })}
        renderOge={(s, i) => (
          <div className="grid gap-2 sm:grid-cols-2">
            <GorselAlan etiket={`Slayt ${i + 1} görsel`} deger={s.gorselUrl} onChange={(v) => {
              const kopya = [...slides]; kopya[i] = { ...s, gorselUrl: v };
              onChange(configGuncelle(form, (c) => ({ ...c, slides: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Başlık" value={s.baslik} onChange={(e) => {
              const kopya = [...slides]; kopya[i] = { ...s, baslik: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, slides: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Alt başlık" value={s.altBaslik} onChange={(e) => {
              const kopya = [...slides]; kopya[i] = { ...s, altBaslik: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, slides: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Buton metni" value={s.butonMetni} onChange={(e) => {
              const kopya = [...slides]; kopya[i] = { ...s, butonMetni: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, slides: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Buton link" value={s.butonLink} onChange={(e) => {
              const kopya = [...slides]; kopya[i] = { ...s, butonLink: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, slides: kopya })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function HizmetKartlariIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const kartlar = cfg.kartlar ?? [];
  return (
    <AdminFormBolumu baslik="Hizmet Kartları">
      <FormAlani etiket="Bölüm başlığı">
        <input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} />
      </FormAlani>
      <FormAlani etiket="Açıklama">
        <textarea className={formInputSinifi} rows={2} value={form.aciklama} onChange={(e) => onChange({ ...form, aciklama: e.target.value })} />
      </FormAlani>
      <ListeSiralayici<WidgetKartOgesi>
        ogeler={kartlar}
        onDegistir={(k) => onChange(configGuncelle(form, (c) => ({ ...c, kartlar: k })))}
        yeniEkle={() => ({ id: uid(), baslik: '', aciklama: '', ikon: 'globe', link: '' })}
        renderOge={(k, i) => (
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={formInputSinifi} placeholder="Başlık" value={k.baslik} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, baslik: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, kartlar: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="İkon (globe/search/settings)" value={k.ikon} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, ikon: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, kartlar: kopya })));
            }} />
            <textarea className={`${formInputSinifi} sm:col-span-2`} placeholder="Açıklama" rows={2} value={k.aciklama} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, aciklama: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, kartlar: kopya })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function GaleriIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const galeri = cfg.galeri ?? [];
  return (
    <AdminFormBolumu baslik="Görsel Galerisi" aciklama="Birden fazla görsel ekleyin ve düzeni ayarlayın">
      <FormAlani etiket="Bölüm başlığı">
        <input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} />
      </FormAlani>
      <SecimAlani
        etiket="Düzen"
        deger={cfg.galeriDuzeni ?? 'grid'}
        secenekler={[
          { id: 'grid', etiket: 'Grid' },
          { id: 'yan_yana', etiket: 'Yan yana' },
          { id: 'alt_alta', etiket: 'Alt alta' },
        ]}
        onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, galeriDuzeni: v as 'grid' | 'yan_yana' | 'alt_alta' })))}
      />
      <ListeSiralayici<WidgetGaleriOgesi>
        ogeler={galeri}
        onDegistir={(g) => onChange(configGuncelle(form, (c) => ({ ...c, galeri: g })))}
        yeniEkle={() => ({ id: uid(), gorselUrl: '', baslik: '', link: '' })}
        renderOge={(g, i) => (
          <div className="space-y-2">
            <GorselAlan etiket="Görsel" deger={g.gorselUrl} onChange={(v) => {
              const kopya = [...galeri]; kopya[i] = { ...g, gorselUrl: v };
              onChange(configGuncelle(form, (c) => ({ ...c, galeri: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Başlık" value={g.baslik} onChange={(e) => {
              const kopya = [...galeri]; kopya[i] = { ...g, baslik: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, galeri: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Link" value={g.link} onChange={(e) => {
              const kopya = [...galeri]; kopya[i] = { ...g, link: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, galeri: kopya })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function SssIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const sorular = cfg.sorular ?? [];
  return (
    <AdminFormBolumu baslik="Sık Sorulan Sorular">
      <FormAlani etiket="Bölüm başlığı">
        <input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} />
      </FormAlani>
      <ListeSiralayici<WidgetSssOgesi>
        ogeler={sorular}
        onDegistir={(s) => onChange(configGuncelle(form, (c) => ({ ...c, sorular: s })))}
        yeniEkle={() => ({ id: uid(), soru: '', cevap: '' })}
        renderOge={(s, i) => (
          <div className="space-y-2">
            <input className={formInputSinifi} placeholder="Soru" value={s.soru} onChange={(e) => {
              const kopya = [...sorular]; kopya[i] = { ...s, soru: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, sorular: kopya })));
            }} />
            <textarea className={formInputSinifi} placeholder="Cevap" rows={2} value={s.cevap} onChange={(e) => {
              const kopya = [...sorular]; kopya[i] = { ...s, cevap: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, sorular: kopya })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function ReferanslarIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const referanslar = cfg.referanslar ?? [];
  return (
    <AdminFormBolumu baslik="Referanslar">
      <FormAlani etiket="Bölüm başlığı">
        <input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} />
      </FormAlani>
      <ListeSiralayici<{ id: string; metin: string }>
        ogeler={referanslar.map((r, i) => ({ id: `ref_${i}`, metin: r }))}
        onDegistir={(liste) => onChange(configGuncelle(form, (c) => ({ ...c, referanslar: liste.map((l) => l.metin) })))}
        yeniEkle={() => ({ id: uid(), metin: '' })}
        renderOge={(r, i) => (
          <input className={formInputSinifi} placeholder="Firma / referans adı" value={r.metin} onChange={(e) => {
            const kopya = referanslar.map((x, j) => (j === i ? e.target.value : x));
            onChange(configGuncelle(form, (c) => ({ ...c, referanslar: kopya })));
          }} />
        )}
      />
    </AdminFormBolumu>
  );
}

export function BlogKaruselIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const kartlar = cfg.blogKartlari ?? [];
  return (
    <AdminFormBolumu baslik="Blog Karuseli">
      <FormAlani etiket="Bölüm başlığı">
        <input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} />
      </FormAlani>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormAlani etiket="Tümünü gör metni">
          <input className={formInputSinifi} value={cfg.tumunuGorMetin ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, tumunuGorMetin: e.target.value })))} />
        </FormAlani>
        <FormAlani etiket="Tümünü gör linki">
          <input className={formInputSinifi} value={cfg.tumunuGorLink ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, tumunuGorLink: e.target.value })))} />
        </FormAlani>
      </div>
      <ListeSiralayici<WidgetBlogKart>
        ogeler={kartlar}
        onDegistir={(k) => onChange(configGuncelle(form, (c) => ({ ...c, blogKartlari: k })))}
        yeniEkle={() => ({ id: uid(), baslik: '', gorselUrl: '', link: '', butonMetni: 'Daha Fazla Oku' })}
        renderOge={(k, i) => (
          <div className="space-y-2">
            <GorselAlan etiket="Kapak" deger={k.gorselUrl} onChange={(v) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, gorselUrl: v };
              onChange(configGuncelle(form, (c) => ({ ...c, blogKartlari: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Başlık" value={k.baslik} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, baslik: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, blogKartlari: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Link" value={k.link} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, link: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, blogKartlari: kopya })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function LinkKartlariIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const linkler = cfg.linkler ?? [];
  return (
    <AdminFormBolumu baslik="Link Kartları">
      <FormAlani etiket="Bölüm başlığı">
        <input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} />
      </FormAlani>
      <ListeSiralayici<WidgetLinkOgesi>
        ogeler={linkler}
        onDegistir={(l) => onChange(configGuncelle(form, (c) => ({ ...c, linkler: l })))}
        yeniEkle={() => ({ id: uid(), metin: '', ikon: '👤', link: '' })}
        renderOge={(l, i) => (
          <div className="grid gap-2 sm:grid-cols-3">
            <input className={formInputSinifi} placeholder="İkon (emoji)" value={l.ikon} onChange={(e) => {
              const kopya = [...linkler]; kopya[i] = { ...l, ikon: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, linkler: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Metin" value={l.metin} onChange={(e) => {
              const kopya = [...linkler]; kopya[i] = { ...l, metin: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, linkler: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Link" value={l.link} onChange={(e) => {
              const kopya = [...linkler]; kopya[i] = { ...l, link: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, linkler: kopya })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function GorselGridBlokIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const gridKartlar = cfg.gridKartlar ?? [];
  return (
    <AdminFormBolumu baslik="Görsel Grid Bloğu">
      <FormAlani etiket="Sol panel başlık">
        <input className={formInputSinifi} value={cfg.solBaslik ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, solBaslik: e.target.value })))} />
      </FormAlani>
      <FormAlani etiket="Sol panel açıklama">
        <textarea className={formInputSinifi} rows={2} value={cfg.solAciklama ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, solAciklama: e.target.value })))} />
      </FormAlani>
      <FormAlani etiket="Filtre etiketleri (virgülle)">
        <input
          className={formInputSinifi}
          value={(cfg.filtreler ?? []).join(', ')}
          onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, filtreler: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })))}
        />
      </FormAlani>
      <ListeSiralayici<WidgetGorselGridKart>
        ogeler={gridKartlar}
        onDegistir={(g) => onChange(configGuncelle(form, (c) => ({ ...c, gridKartlar: g })))}
        yeniEkle={() => ({ id: uid(), etiket: '', gorselUrl: '', link: '' })}
        renderOge={(g, i) => (
          <div className="space-y-2">
            <GorselAlan etiket="Görsel" deger={g.gorselUrl} onChange={(v) => {
              const kopya = [...gridKartlar]; kopya[i] = { ...g, gorselUrl: v };
              onChange(configGuncelle(form, (c) => ({ ...c, gridKartlar: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Etiket" value={g.etiket} onChange={(e) => {
              const kopya = [...gridKartlar]; kopya[i] = { ...g, etiket: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, gridKartlar: kopya })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function HaritaIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  return (
    <AdminFormBolumu baslik="Harita">
      <FormAlani etiket="Embed URL">
        <input className={formInputSinifi} value={cfg.haritaUrl ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, haritaUrl: e.target.value })))} placeholder="https://maps.google.com/..." />
      </FormAlani>
      <div className="grid gap-3 sm:grid-cols-3">
        <FormAlani etiket="Enlem">
          <input className={formInputSinifi} value={cfg.haritaLat ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, haritaLat: e.target.value })))} />
        </FormAlani>
        <FormAlani etiket="Boylam">
          <input className={formInputSinifi} value={cfg.haritaLng ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, haritaLng: e.target.value })))} />
        </FormAlani>
        <FormAlani etiket="Zoom">
          <input type="number" className={formInputSinifi} value={cfg.haritaZoom ?? 14} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, haritaZoom: Number(e.target.value) })))} />
        </FormAlani>
      </div>
    </AdminFormBolumu>
  );
}

export function IletisimIcerik({ form, onChange }: WidgetPanelProps) {
  return (
    <AdminFormBolumu baslik="İletişim / CTA">
      <FormAlani etiket="Başlık"><input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} /></FormAlani>
      <FormAlani etiket="Açıklama"><textarea className={formInputSinifi} rows={2} value={form.aciklama} onChange={(e) => onChange({ ...form, aciklama: e.target.value })} /></FormAlani>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormAlani etiket="Buton metni"><input className={formInputSinifi} value={form.butonMetni} onChange={(e) => onChange({ ...form, butonMetni: e.target.value })} /></FormAlani>
        <FormAlani etiket="Buton link"><input className={formInputSinifi} value={form.butonLink} onChange={(e) => onChange({ ...form, butonLink: e.target.value })} /></FormAlani>
      </div>
    </AdminFormBolumu>
  );
}

export function PopupIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  return (
    <AdminFormBolumu baslik="Popup">
      <FormAlani etiket="Başlık"><input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} /></FormAlani>
      <FormAlani etiket="İçerik"><textarea className={formInputSinifi} rows={3} value={form.aciklama} onChange={(e) => onChange({ ...form, aciklama: e.target.value })} /></FormAlani>
      <FormAlani etiket="Gecikme (sn)">
        <input type="number" min={0} className={formInputSinifi} value={cfg.popupGecikme ?? 3} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, popupGecikme: Number(e.target.value) })))} />
      </FormAlani>
    </AdminFormBolumu>
  );
}

export function KategoriIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const kategoriler = cfg.kategoriler ?? [];
  return (
    <AdminFormBolumu baslik="Kategori Navigasyonu">
      <FormAlani etiket="Bölüm başlığı">
        <input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} />
      </FormAlani>
      <ListeSiralayici<WidgetLinkOgesi>
        ogeler={kategoriler}
        onDegistir={(k) => onChange(configGuncelle(form, (c) => ({ ...c, kategoriler: k })))}
        yeniEkle={() => ({ id: uid(), metin: '', ikon: '📂', link: '' })}
        renderOge={(k, i) => (
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={formInputSinifi} placeholder="Kategori adı" value={k.metin} onChange={(e) => {
              const kopya = [...kategoriler]; kopya[i] = { ...k, metin: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, kategoriler: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Link" value={k.link} onChange={(e) => {
              const kopya = [...kategoriler]; kopya[i] = { ...k, link: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, kategoriler: kopya })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export const ICERIK_PANEL_MAP: Record<string, ComponentType<WidgetPanelProps>> = {
  BASLIK_METIN: BaslikMetinIcerik,
  BASLIK_METIN_GORSEL: BaslikMetinGorselIcerik,
  SLIDER: SliderIcerik,
  HERO_BANNER: SliderIcerik,
  HIZMET_KARTLARI: HizmetKartlariIcerik,
  GALERI: GaleriIcerik,
  SSS: SssIcerik,
  REFERANSLAR: ReferanslarIcerik,
  BLOG_KARUSEL: BlogKaruselIcerik,
  LINK_KARTLARI: LinkKartlariIcerik,
  GORSEL_GRID_BLOK: GorselGridBlokIcerik,
  HARITA: HaritaIcerik,
  ILETISIM_FORMU: IletisimIcerik,
  POPUP: PopupIcerik,
  KATEGORI: KategoriIcerik,
};
