import type { ComponentType } from 'react';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { EmojiSecici } from '@/components/form/EmojiSecici';
import { GorselAlan } from '@/components/form/GorselAlan';
import { AdminFormBolumu } from '@/components/admin/ortak/AdminFormBilesenleri';
import {
  configGuncelle,
  configOku,
  uid,
  type WidgetBlogKart,
  type WidgetGaleriOgesi,
  type WidgetGorselGridKart,
  type WidgetEtiketKarti,
  type WidgetEkipUyesi,
  type WidgetSayac,
  type WidgetYorum,
  type WidgetFiyatPaketi,
  type WidgetIkonKart,
  type WidgetHaritaSube,
  type WidgetKartOgesi,
  type WidgetLinkOgesi,
  type WidgetSlide,
  type WidgetSssOgesi,
} from '@/types/widget';
import { ListeSiralayici, SecimAlani } from './WidgetPanelOrtak';
import { SAYAC_VARSAYILAN_IKONLAR, sayacDegerInput, sayacDegerKaydet } from '@/utils/sayacYardimci';
import { WidgetGorunumIcerikAlanlari } from './WidgetGorunumIcerikAlanlari';
import {
  BultenKayitIcerik,
  GeriSayimIcerik,
  KarsilastirmaTablosuIcerik,
  MarkaSeridiIcerik,
  OncesiSonrasiIcerik,
  SurecAdimlariIcerik,
  VideoBannerIcerik,
  ZamanCizelgesiIcerik,
} from './WidgetModernPanelleri';
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
  const { form, onChange } = props;
  const cfg = configOku(form);
  const ikonKartlar = cfg.ikonKartlar ?? [];
  return (
    <>
      <MetinAlanlari {...props} gorsel />
      <AdminFormBolumu baslik="İkon Kartları" aciklama="Hakkımızda bölümündeki ikon + metin kutuları">
        <ListeSiralayici<WidgetIkonKart>
          ogeler={ikonKartlar}
          onDegistir={(k) => onChange(configGuncelle(form, (c) => ({ ...c, ikonKartlar: k })))}
          yeniEkle={() => ({ id: uid(), ikon: '🛡️', metin: '' })}
          renderOge={(k, i) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <input className={formInputSinifi} placeholder="İkon (emoji)" value={k.ikon} onChange={(e) => {
                const kopya = [...ikonKartlar]; kopya[i] = { ...k, ikon: e.target.value };
                onChange(configGuncelle(form, (c) => ({ ...c, ikonKartlar: kopya })));
              }} />
              <input className={formInputSinifi} placeholder="Metin" value={k.metin} onChange={(e) => {
                const kopya = [...ikonKartlar]; kopya[i] = { ...k, metin: e.target.value };
                onChange(configGuncelle(form, (c) => ({ ...c, ikonKartlar: kopya })));
              }} />
            </div>
          )}
        />
      </AdminFormBolumu>
      <AdminFormBolumu baslik="CTA Butonu">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormAlani etiket="Buton metni">
            <input className={formInputSinifi} value={form.butonMetni} onChange={(e) => onChange({ ...form, butonMetni: e.target.value })} />
          </FormAlani>
          <FormAlani etiket="Buton link">
            <input className={formInputSinifi} value={form.butonLink} onChange={(e) => onChange({ ...form, butonLink: e.target.value })} />
          </FormAlani>
        </div>
      </AdminFormBolumu>
    </>
  );
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
      <WidgetGorunumIcerikAlanlari form={form} onChange={onChange} />
      <ListeSiralayici<WidgetKartOgesi>
        ogeler={kartlar}
        onDegistir={(k) => onChange(configGuncelle(form, (c) => ({ ...c, kartlar: k })))}
        yeniEkle={() => ({ id: uid(), baslik: '', aciklama: '', ikon: '💼', link: '' })}
        renderOge={(k, i) => (
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={formInputSinifi} placeholder="Başlık" value={k.baslik} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, baslik: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, kartlar: kopya })));
            }} />
            <FormAlani etiket="İkon">
              <EmojiSecici
                deger={k.ikon}
                onChange={(emoji) => {
                  const kopya = [...kartlar]; kopya[i] = { ...k, ikon: emoji };
                  onChange(configGuncelle(form, (c) => ({ ...c, kartlar: kopya })));
                }}
                placeholder="Emoji seçin"
              />
            </FormAlani>
            <textarea className={`${formInputSinifi} sm:col-span-2`} placeholder="Açıklama" rows={2} value={k.aciklama} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, aciklama: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, kartlar: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Link" value={k.link} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, link: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, kartlar: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Buton metni" value={k.butonMetni ?? ''} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, butonMetni: e.target.value };
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
  const gt = cfg.gorunum?.gorunumTipi;
  const sekmeMod = gt === 'sekmeli-kategori';
  return (
    <>
      <WidgetGorunumIcerikAlanlari form={form} onChange={onChange} />
      <AdminFormBolumu baslik="Görseller" aciklama="Galeride gösterilecek görseller">
        <ListeSiralayici<WidgetGaleriOgesi>
          ogeler={galeri}
          onDegistir={(g) => onChange(configGuncelle(form, (c) => ({ ...c, galeri: g })))}
          yeniEkle={() => ({ id: uid(), gorselUrl: '', baslik: '', link: '', kategori: '' })}
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
              {sekmeMod && (
                <input className={formInputSinifi} placeholder="Kategori (filtre etiketi ile eşleşmeli)" value={g.kategori ?? ''} onChange={(e) => {
                  const kopya = [...galeri]; kopya[i] = { ...g, kategori: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, galeri: kopya })));
                }} />
              )}
              <input className={formInputSinifi} placeholder="Link (isteğe bağlı)" value={g.link} onChange={(e) => {
                const kopya = [...galeri]; kopya[i] = { ...g, link: e.target.value };
                onChange(configGuncelle(form, (c) => ({ ...c, galeri: kopya })));
              }} />
            </div>
          )}
        />
      </AdminFormBolumu>
    </>
  );
}

export function SssIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const sorular = cfg.sorular ?? [];
  const gt = cfg.gorunum?.gorunumTipi;
  const sekmeMod = gt === 'sekmeli-kategori';
  return (
    <>
      <WidgetGorunumIcerikAlanlari form={form} onChange={onChange} />
      <AdminFormBolumu baslik="Sorular">
        <ListeSiralayici<WidgetSssOgesi>
          ogeler={sorular}
          onDegistir={(s) => onChange(configGuncelle(form, (c) => ({ ...c, sorular: s })))}
          yeniEkle={() => ({ id: uid(), soru: '', cevap: '', kategori: '' })}
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
              {sekmeMod && (
                <input className={formInputSinifi} placeholder="Kategori (filtre etiketi ile eşleşmeli)" value={s.kategori ?? ''} onChange={(e) => {
                  const kopya = [...sorular]; kopya[i] = { ...s, kategori: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, sorular: kopya })));
                }} />
              )}
            </div>
          )}
        />
      </AdminFormBolumu>
    </>
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
    <>
      <WidgetGorunumIcerikAlanlari form={form} onChange={onChange} />
      <AdminFormBolumu baslik="Blog kartları">
      <ListeSiralayici<WidgetBlogKart>
        ogeler={kartlar}
        onDegistir={(k) => onChange(configGuncelle(form, (c) => ({ ...c, blogKartlari: k })))}
        yeniEkle={() => ({ id: uid(), baslik: '', gorselUrl: '', link: '', butonMetni: 'Daha Fazla Oku', kategori: '', ozet: '' })}
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
            <input className={formInputSinifi} placeholder="Kategori (sekmeli görünüm)" value={k.kategori ?? ''} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, kategori: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, blogKartlari: kopya })));
            }} />
            <textarea className={formInputSinifi} placeholder="Kısa özet" rows={2} value={k.ozet ?? ''} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, ozet: e.target.value };
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
    </>
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
          <div className="link-kart-satir grid gap-2 sm:grid-cols-[minmax(7rem,9rem)_1fr_1fr] sm:items-end">
            <FormAlani etiket="İkon">
              <EmojiSecici
                deger={l.ikon}
                sadeceSecim
                onChange={(emoji) => {
                  const kopya = [...linkler];
                  kopya[i] = { ...l, ikon: emoji };
                  onChange(configGuncelle(form, (c) => ({ ...c, linkler: kopya })));
                }}
              />
            </FormAlani>
            <FormAlani etiket="Metin">
              <input className={formInputSinifi} placeholder="Metin" value={l.metin} onChange={(e) => {
                const kopya = [...linkler]; kopya[i] = { ...l, metin: e.target.value };
                onChange(configGuncelle(form, (c) => ({ ...c, linkler: kopya })));
              }} />
            </FormAlani>
            <FormAlani etiket="Link">
              <input className={formInputSinifi} placeholder="Link" value={l.link} onChange={(e) => {
                const kopya = [...linkler]; kopya[i] = { ...l, link: e.target.value };
                onChange(configGuncelle(form, (c) => ({ ...c, linkler: kopya })));
              }} />
            </FormAlani>
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function GorselGridBlokIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const gridKartlar = cfg.gridKartlar ?? [];
  const filtreler = cfg.filtreler ?? [];
  const altKategoriler = filtreler.slice(1);
  const gt = cfg.gorunum?.gorunumTipi;
  const flipMod = gt === 'flip-kart';

  return (
    <>
      <WidgetGorunumIcerikAlanlari form={form} onChange={onChange} />
      <AdminFormBolumu baslik="Görsel kartları" aciklama="Grid içinde gösterilecek görseller ve etiketler">
      <ListeSiralayici<WidgetGorselGridKart>
        ogeler={gridKartlar}
        onDegistir={(g) => onChange(configGuncelle(form, (c) => ({ ...c, gridKartlar: g })))}
        yeniEkle={() => ({ id: uid(), etiket: '', gorselUrl: '', link: '', aciklama: '' })}
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
            {(flipMod || gt === 'flip-kart') && (
              <textarea className={formInputSinifi} placeholder="Arka yüz açıklaması (flip görünüm)" rows={2} value={g.aciklama ?? ''} onChange={(e) => {
                const kopya = [...gridKartlar]; kopya[i] = { ...g, aciklama: e.target.value };
                onChange(configGuncelle(form, (c) => ({ ...c, gridKartlar: kopya })));
              }} />
            )}
            <input className={formInputSinifi} placeholder="Link" value={g.link} onChange={(e) => {
              const kopya = [...gridKartlar]; kopya[i] = { ...g, link: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, gridKartlar: kopya })));
            }} />
            {altKategoriler.length > 0 && (
              <div>
                <label className="mb-1 block text-xs text-[var(--ap-text-muted)]">Kategori filtresi</label>
                <select
                  className={formInputSinifi}
                  value={g.filtreEtiketi ?? ''}
                  onChange={(e) => {
                    const kopya = [...gridKartlar];
                    kopya[i] = { ...g, filtreEtiketi: e.target.value || undefined };
                    onChange(configGuncelle(form, (c) => ({ ...c, gridKartlar: kopya })));
                  }}
                >
                  <option value="">Tüm kategorilerde göster</option>
                  {altKategoriler.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      />
    </AdminFormBolumu>
    </>
  );
}

export function HaritaIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const gt = cfg.gorunum?.gorunumTipi;
  const sekmeMod = gt === 'sekme-subeler';
  const ikonMod = gt === 'yan-ikon-liste';
  const subeler = cfg.haritaSubeler ?? [];
  const ikonlar = cfg.ikonKartlar ?? [];

  return (
    <>
      <WidgetGorunumIcerikAlanlari form={form} onChange={onChange} />
      {!sekmeMod && (
        <AdminFormBolumu baslik="Harita konumu" aciklama="Google Maps paylaşım linki, adres veya embed URL">
          <FormAlani etiket="Harita linki veya adres" aciklama="www.google.com gibi genel linkler çalışmaz.">
            <input className={formInputSinifi} value={cfg.haritaUrl ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, haritaUrl: e.target.value })))} placeholder="Adres, maps linki veya embed URL" />
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
      )}
      {sekmeMod && (
        <AdminFormBolumu baslik="Şubeler" aciklama="Her şube için ayrı harita konumu tanımlayın">
          <ListeSiralayici<WidgetHaritaSube>
            ogeler={subeler}
            onDegistir={(s) => onChange(configGuncelle(form, (c) => ({ ...c, haritaSubeler: s })))}
            yeniEkle={() => ({ id: uid(), ad: '', haritaUrl: '', haritaLat: '', haritaLng: '', haritaZoom: 14 })}
            renderOge={(s, i) => (
              <div className="space-y-2">
                <input className={formInputSinifi} placeholder="Şube adı" value={s.ad} onChange={(e) => {
                  const kopya = [...subeler]; kopya[i] = { ...s, ad: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, haritaSubeler: kopya })));
                }} />
                <input className={formInputSinifi} placeholder="Harita linki veya adres" value={s.haritaUrl ?? ''} onChange={(e) => {
                  const kopya = [...subeler]; kopya[i] = { ...s, haritaUrl: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, haritaSubeler: kopya })));
                }} />
                <div className="grid gap-2 sm:grid-cols-3">
                  <input className={formInputSinifi} placeholder="Enlem" value={s.haritaLat ?? ''} onChange={(e) => {
                    const kopya = [...subeler]; kopya[i] = { ...s, haritaLat: e.target.value };
                    onChange(configGuncelle(form, (c) => ({ ...c, haritaSubeler: kopya })));
                  }} />
                  <input className={formInputSinifi} placeholder="Boylam" value={s.haritaLng ?? ''} onChange={(e) => {
                    const kopya = [...subeler]; kopya[i] = { ...s, haritaLng: e.target.value };
                    onChange(configGuncelle(form, (c) => ({ ...c, haritaSubeler: kopya })));
                  }} />
                  <input type="number" className={formInputSinifi} placeholder="Zoom" value={s.haritaZoom ?? 14} onChange={(e) => {
                    const kopya = [...subeler]; kopya[i] = { ...s, haritaZoom: Number(e.target.value) };
                    onChange(configGuncelle(form, (c) => ({ ...c, haritaSubeler: kopya })));
                  }} />
                </div>
              </div>
            )}
          />
        </AdminFormBolumu>
      )}
      {ikonMod && (
        <AdminFormBolumu baslik="İletişim satırları" aciklama="Haritanın yanında gösterilecek ikon + metin listesi">
          <ListeSiralayici<WidgetIkonKart>
            ogeler={ikonlar}
            onDegistir={(k) => onChange(configGuncelle(form, (c) => ({ ...c, ikonKartlar: k })))}
            yeniEkle={() => ({ id: uid(), ikon: '📍', metin: '' })}
            renderOge={(k, i) => (
              <div className="grid gap-2 sm:grid-cols-2">
                <input className={formInputSinifi} placeholder="İkon (emoji)" value={k.ikon} onChange={(e) => {
                  const kopya = [...ikonlar]; kopya[i] = { ...k, ikon: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, ikonKartlar: kopya })));
                }} />
                <input className={formInputSinifi} placeholder="Metin (adres, telefon vb.)" value={k.metin} onChange={(e) => {
                  const kopya = [...ikonlar]; kopya[i] = { ...k, metin: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, ikonKartlar: kopya })));
                }} />
              </div>
            )}
          />
        </AdminFormBolumu>
      )}
    </>
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
    <>
      <WidgetGorunumIcerikAlanlari form={form} onChange={onChange} />
      <AdminFormBolumu baslik="Popup zamanlama">
        <FormAlani etiket="Gecikme (sn)" aciklama="Sayfa yüklendikten kaç saniye sonra gösterilsin">
          <input type="number" min={0} className={formInputSinifi} value={cfg.popupGecikme ?? 3} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, popupGecikme: Number(e.target.value) })))} />
        </FormAlani>
      </AdminFormBolumu>
    </>
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

export function GorselEtiketKartlariIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const kartlar = cfg.etiketKartlar ?? [];
  return (
    <AdminFormBolumu baslik="Görsel Etiket Kartları">
      <FormAlani etiket="Bölüm başlığı">
        <input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} />
      </FormAlani>
      <ListeSiralayici<WidgetEtiketKarti>
        ogeler={kartlar}
        onDegistir={(k) => onChange(configGuncelle(form, (c) => ({ ...c, etiketKartlar: k })))}
        yeniEkle={() => ({ id: uid(), etiket: '', gorselUrl: '', link: '' })}
        renderOge={(k, i) => (
          <div className="space-y-2">
            <GorselAlan etiket="Görsel" deger={k.gorselUrl} onChange={(v) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, gorselUrl: v };
              onChange(configGuncelle(form, (c) => ({ ...c, etiketKartlar: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Etiket" value={k.etiket} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, etiket: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, etiketKartlar: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Link" value={k.link} onChange={(e) => {
              const kopya = [...kartlar]; kopya[i] = { ...k, link: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, etiketKartlar: kopya })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function EkipKaruselIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const uyeler = cfg.uyeler ?? [];
  return (
    <>
      <WidgetGorunumIcerikAlanlari form={form} onChange={onChange} />
      <AdminFormBolumu baslik="Ekip üyeleri">
      <ListeSiralayici<WidgetEkipUyesi>
        ogeler={uyeler}
        onDegistir={(u) => onChange(configGuncelle(form, (c) => ({ ...c, uyeler: u })))}
        yeniEkle={() => ({ id: uid(), ad: '', unvan: '', gorselUrl: '', departman: '', aciklama: '', linkedin: '' })}
        renderOge={(u, i) => (
          <div className="space-y-2">
            <GorselAlan etiket="Fotoğraf" deger={u.gorselUrl} onChange={(v) => {
              const kopya = [...uyeler]; kopya[i] = { ...u, gorselUrl: v };
              onChange(configGuncelle(form, (c) => ({ ...c, uyeler: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Ad Soyad" value={u.ad} onChange={(e) => {
              const kopya = [...uyeler]; kopya[i] = { ...u, ad: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, uyeler: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Unvan" value={u.unvan} onChange={(e) => {
              const kopya = [...uyeler]; kopya[i] = { ...u, unvan: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, uyeler: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Departman (sekmeli görünüm)" value={u.departman ?? ''} onChange={(e) => {
              const kopya = [...uyeler]; kopya[i] = { ...u, departman: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, uyeler: kopya })));
            }} />
            <textarea className={formInputSinifi} placeholder="Kısa biyografi" rows={2} value={u.aciklama ?? ''} onChange={(e) => {
              const kopya = [...uyeler]; kopya[i] = { ...u, aciklama: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, uyeler: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="LinkedIn URL" value={u.linkedin ?? ''} onChange={(e) => {
              const kopya = [...uyeler]; kopya[i] = { ...u, linkedin: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, uyeler: kopya })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
    </>
  );
}

export function SayacBlokIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const sayaclar = cfg.sayaclar ?? [];
  return (
    <AdminFormBolumu baslik="Sayaçlar">
      <FormAlani etiket="Üst etiket"><input className={formInputSinifi} value={form.altBaslik} onChange={(e) => onChange({ ...form, altBaslik: e.target.value })} /></FormAlani>
      <FormAlani etiket="Başlık"><input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} /></FormAlani>
      <ListeSiralayici<WidgetSayac>
        ogeler={sayaclar}
        onDegistir={(s) => onChange(configGuncelle(form, (c) => ({ ...c, sayaclar: s })))}
        yeniEkle={() => {
          const ikon = SAYAC_VARSAYILAN_IKONLAR[sayaclar.length % SAYAC_VARSAYILAN_IKONLAR.length];
          return { id: uid(), deger: '', sonEk: '+', etiket: '', ikon };
        }}
        renderOge={(s, i) => (
          <div className="space-y-3">
            <FormAlani etiket="İkon">
              <EmojiSecici
                sadeceSecim
                deger={s.ikon ?? '⚡'}
                onChange={(emoji) => {
                  const kopya = [...sayaclar];
                  kopya[i] = { ...s, ikon: emoji };
                  onChange(configGuncelle(form, (c) => ({ ...c, sayaclar: kopya })));
                }}
              />
            </FormAlani>
            <div className="grid gap-2 sm:grid-cols-3">
              <FormAlani etiket="Değer">
                <input
                  type="text"
                  inputMode="decimal"
                  className={formInputSinifi}
                  placeholder="1 · 1.2 · 100"
                  value={sayacDegerInput(s.deger)}
                  onChange={(e) => {
                    const kopya = [...sayaclar];
                    kopya[i] = { ...s, deger: sayacDegerKaydet(e.target.value) };
                    onChange(configGuncelle(form, (c) => ({ ...c, sayaclar: kopya })));
                  }}
                />
              </FormAlani>
              <FormAlani etiket="Son ek">
                <input
                  className={formInputSinifi}
                  placeholder="+ · % · K"
                  value={s.sonEk}
                  onChange={(e) => {
                    const kopya = [...sayaclar];
                    kopya[i] = { ...s, sonEk: e.target.value };
                    onChange(configGuncelle(form, (c) => ({ ...c, sayaclar: kopya })));
                  }}
                />
              </FormAlani>
              <FormAlani etiket="Etiket">
                <input
                  className={formInputSinifi}
                  placeholder="Platform Özelliği"
                  value={s.etiket}
                  onChange={(e) => {
                    const kopya = [...sayaclar];
                    kopya[i] = { ...s, etiket: e.target.value };
                    onChange(configGuncelle(form, (c) => ({ ...c, sayaclar: kopya })));
                  }}
                />
              </FormAlani>
            </div>
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function YorumKaruselIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const yorumlar = cfg.yorumlar ?? [];
  return (
    <AdminFormBolumu baslik="Müşteri Yorumları">
      <FormAlani etiket="Üst etiket"><input className={formInputSinifi} value={form.altBaslik} onChange={(e) => onChange({ ...form, altBaslik: e.target.value })} /></FormAlani>
      <FormAlani etiket="Başlık"><input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} /></FormAlani>
      <ListeSiralayici<WidgetYorum>
        ogeler={yorumlar}
        onDegistir={(y) => onChange(configGuncelle(form, (c) => ({ ...c, yorumlar: y })))}
        yeniEkle={() => ({ id: uid(), metin: '', ad: '', firma: '' })}
        renderOge={(y, i) => (
          <div className="space-y-2">
            <textarea className={formInputSinifi} placeholder="Yorum" rows={2} value={y.metin} onChange={(e) => {
              const kopya = [...yorumlar]; kopya[i] = { ...y, metin: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, yorumlar: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Ad" value={y.ad} onChange={(e) => {
              const kopya = [...yorumlar]; kopya[i] = { ...y, ad: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, yorumlar: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Firma" value={y.firma} onChange={(e) => {
              const kopya = [...yorumlar]; kopya[i] = { ...y, firma: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, yorumlar: kopya })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function YorumKartlariIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const yorumlar = cfg.yorumlar ?? [];
  return (
    <>
      <WidgetGorunumIcerikAlanlari form={form} onChange={onChange} />
      <AdminFormBolumu baslik="Müşteri Yorumları">
      <ListeSiralayici<WidgetYorum>
        ogeler={yorumlar}
        onDegistir={(y) => onChange(configGuncelle(form, (c) => ({ ...c, yorumlar: y })))}
        yeniEkle={() => ({ id: uid(), metin: '', ad: '', firma: '', yildiz: 5 })}
        renderOge={(y, i) => (
          <div className="space-y-2">
            <FormAlani etiket="Yıldız (1–5)">
              <input
                type="number"
                min={1}
                max={5}
                className={formInputSinifi}
                value={y.yildiz ?? 5}
                onChange={(e) => {
                  const kopya = [...yorumlar];
                  kopya[i] = { ...y, yildiz: Math.min(5, Math.max(1, Number(e.target.value) || 5)) };
                  onChange(configGuncelle(form, (c) => ({ ...c, yorumlar: kopya })));
                }}
              />
            </FormAlani>
            <textarea className={formInputSinifi} placeholder="Yorum metni" rows={3} value={y.metin} onChange={(e) => {
              const kopya = [...yorumlar]; kopya[i] = { ...y, metin: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, yorumlar: kopya })));
            }} />
            <div className="grid gap-2 sm:grid-cols-2">
              <input className={formInputSinifi} placeholder="Ad Soyad" value={y.ad} onChange={(e) => {
                const kopya = [...yorumlar]; kopya[i] = { ...y, ad: e.target.value };
                onChange(configGuncelle(form, (c) => ({ ...c, yorumlar: kopya })));
              }} />
              <input className={formInputSinifi} placeholder="Firma / unvan" value={y.firma} onChange={(e) => {
                const kopya = [...yorumlar]; kopya[i] = { ...y, firma: e.target.value };
                onChange(configGuncelle(form, (c) => ({ ...c, yorumlar: kopya })));
              }} />
            </div>
            <GorselAlan
              etiket="Profil fotoğrafı"
              deger={y.gorselUrl ?? ''}
              onChange={(url) => {
                const kopya = [...yorumlar]; kopya[i] = { ...y, gorselUrl: url };
                onChange(configGuncelle(form, (c) => ({ ...c, yorumlar: kopya })));
              }}
            />
          </div>
        )}
      />
    </AdminFormBolumu>
    </>
  );
}

export function ModulLogoBlokIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const ozellikler = cfg.ikonKartlar ?? [];
  const logolar = cfg.logoKartlar ?? [];
  return (
    <>
      <WidgetGorunumIcerikAlanlari form={form} onChange={onChange} />
      <AdminFormBolumu baslik="Özellikler" aciklama="Modül özellik listesi (✓ işaretli)">
        <ListeSiralayici<WidgetIkonKart>
          ogeler={ozellikler}
          onDegistir={(k) => onChange(configGuncelle(form, (c) => ({ ...c, ikonKartlar: k })))}
          yeniEkle={() => ({ id: uid(), ikon: '✓', metin: '' })}
          renderOge={(k, i) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                className={formInputSinifi}
                placeholder="İkon (✓)"
                value={k.ikon}
                onChange={(e) => {
                  const kopya = [...ozellikler];
                  kopya[i] = { ...k, ikon: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, ikonKartlar: kopya })));
                }}
              />
              <input
                className={formInputSinifi}
                placeholder="Özellik metni"
                value={k.metin}
                onChange={(e) => {
                  const kopya = [...ozellikler];
                  kopya[i] = { ...k, metin: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, ikonKartlar: kopya })));
                }}
              />
            </div>
          )}
        />
      </AdminFormBolumu>
      <AdminFormBolumu baslik="Logo Kartları" aciklama="Sağ taraftaki partner / entegrasyon logoları">
        <ListeSiralayici<WidgetEtiketKarti>
          ogeler={logolar}
          onDegistir={(k) => onChange(configGuncelle(form, (c) => ({ ...c, logoKartlar: k })))}
          yeniEkle={() => ({ id: uid(), etiket: '', gorselUrl: '', link: '' })}
          renderOge={(k, i) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <GorselAlan
                etiket="Logo görseli"
                deger={k.gorselUrl}
                onChange={(v) => {
                  const kopya = [...logolar];
                  kopya[i] = { ...k, gorselUrl: v };
                  onChange(configGuncelle(form, (c) => ({ ...c, logoKartlar: kopya })));
                }}
              />
              <input
                className={formInputSinifi}
                placeholder="Etiket (örn: Sanal POS)"
                value={k.etiket}
                onChange={(e) => {
                  const kopya = [...logolar];
                  kopya[i] = { ...k, etiket: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, logoKartlar: kopya })));
                }}
              />
              <input
                className={formInputSinifi}
                placeholder="Link (isteğe bağlı)"
                value={k.link}
                onChange={(e) => {
                  const kopya = [...logolar];
                  kopya[i] = { ...k, link: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, logoKartlar: kopya })));
                }}
              />
            </div>
          )}
        />
      </AdminFormBolumu>
    </>
  );
}

export function FiyatlandirmaIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const paketler = cfg.paketler ?? [];
  return (
    <>
      <WidgetGorunumIcerikAlanlari form={form} onChange={onChange} />
      <AdminFormBolumu baslik="Fiyat paketleri">
      <ListeSiralayici<WidgetFiyatPaketi>
        ogeler={paketler}
        onDegistir={(p) => onChange(configGuncelle(form, (c) => ({ ...c, paketler: p })))}
        yeniEkle={() => ({ id: uid(), ad: '', fiyat: '', aciklama: '', ozellikler: [], butonMetni: 'Satın Al', butonLink: '', oneCikan: false })}
        renderOge={(p, i) => (
          <div className="space-y-2">
            <input className={formInputSinifi} placeholder="Paket adı" value={p.ad} onChange={(e) => {
              const kopya = [...paketler]; kopya[i] = { ...p, ad: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, paketler: kopya })));
            }} />
            <input className={formInputSinifi} placeholder="Fiyat (örn: 499 ₺)" value={p.fiyat} onChange={(e) => {
              const kopya = [...paketler]; kopya[i] = { ...p, fiyat: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, paketler: kopya })));
            }} />
            <textarea className={formInputSinifi} placeholder="Açıklama" rows={2} value={p.aciklama} onChange={(e) => {
              const kopya = [...paketler]; kopya[i] = { ...p, aciklama: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, paketler: kopya })));
            }} />
            <textarea className={formInputSinifi} placeholder="Özellikler (her satır: metin veya -metin)" rows={3} value={(p.ozellikler ?? []).map((o) => (o.dahil ? '' : '-') + o.metin).join('\n')} onChange={(e) => {
              const ozellikler = e.target.value.split('\n').filter(Boolean).map((satir) => {
                const dahil = !satir.startsWith('-');
                return { metin: dahil ? satir : satir.slice(1), dahil };
              });
              const kopya = [...paketler]; kopya[i] = { ...p, ozellikler };
              onChange(configGuncelle(form, (c) => ({ ...c, paketler: kopya })));
            }} />
            <div className="grid gap-2 sm:grid-cols-2">
              <input className={formInputSinifi} placeholder="Buton metni" value={p.butonMetni} onChange={(e) => {
                const kopya = [...paketler]; kopya[i] = { ...p, butonMetni: e.target.value };
                onChange(configGuncelle(form, (c) => ({ ...c, paketler: kopya })));
              }} />
              <input className={formInputSinifi} placeholder="Buton link" value={p.butonLink} onChange={(e) => {
                const kopya = [...paketler]; kopya[i] = { ...p, butonLink: e.target.value };
                onChange(configGuncelle(form, (c) => ({ ...c, paketler: kopya })));
              }} />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={p.oneCikan} onChange={(e) => {
                const kopya = [...paketler]; kopya[i] = { ...p, oneCikan: e.target.checked };
                onChange(configGuncelle(form, (c) => ({ ...c, paketler: kopya })));
              }} />
              Öne çıkan paket
            </label>
          </div>
        )}
      />
    </AdminFormBolumu>
    </>
  );
}

import {
  GuncelKonularIcerik,
  HaberMagazinIcerik,
  HavaDurumuIcerik,
  IletisimBlokIcerik,
  KategoriHaberListesiIcerik,
  KategoriHaberOverlayIcerik,
  KoseYazarlariIcerik,
  KriptoListesiIcerik,
  SirketGirisCikisIcerik,
  SekmeliHaberIcerik,
  VideoGalerisiIcerik,
} from './HaberWidgetIcerikPanelleri';

export function BlokOlusturucuIcerik({ form, onChange }: WidgetPanelProps) {
  return (
    <>
      <AdminFormBolumu
        baslik="Bölüm başlığı"
        aciklama="Widgetın üstünde görünen başlık ve açıklama. Grid parçalarını Widget Ekleme sekmesinden düzenleyin."
      >
        <FormAlani etiket="Başlık">
          <input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} />
        </FormAlani>
        <FormAlani etiket="Alt başlık (üst etiket)">
          <input className={formInputSinifi} value={form.altBaslik} onChange={(e) => onChange({ ...form, altBaslik: e.target.value })} />
        </FormAlani>
        <FormAlani etiket="Açıklama">
          <textarea
            className={`${formInputSinifi} min-h-[100px]`}
            value={form.aciklama}
            onChange={(e) => onChange({ ...form, aciklama: e.target.value })}
          />
        </FormAlani>
      </AdminFormBolumu>
      <AdminFormBolumu baslik="CTA (opsiyonel)" aciklama="Bölüm altında gösterilmez; grid içinde buton parçası kullanın. Genel CTA alanları ileride eklenebilir.">
        <FormAlani etiket="Buton metni">
          <input className={formInputSinifi} value={form.butonMetni} onChange={(e) => onChange({ ...form, butonMetni: e.target.value })} />
        </FormAlani>
        <FormAlani etiket="Buton link">
          <input className={formInputSinifi} value={form.butonLink} onChange={(e) => onChange({ ...form, butonLink: e.target.value })} />
        </FormAlani>
      </AdminFormBolumu>
    </>
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
  GORSEL_ETIKET_KARTLARI: GorselEtiketKartlariIcerik,
  EKIP_KARUSEL: EkipKaruselIcerik,
  SAYAC_BLOK: SayacBlokIcerik,
  YORUM_KARUSEL: YorumKaruselIcerik,
  YORUM_KARTLARI: YorumKartlariIcerik,
  FIYATLANDIRMA: FiyatlandirmaIcerik,
  MODUL_LOGO_BLOK: ModulLogoBlokIcerik,
  HARITA: HaritaIcerik,
  ILETISIM_FORMU: IletisimIcerik,
  POPUP: PopupIcerik,
  KATEGORI: KategoriIcerik,
  ZAMAN_CIZELGESI: ZamanCizelgesiIcerik,
  SUREC_ADIMLARI: SurecAdimlariIcerik,
  MARKA_SERIDI: MarkaSeridiIcerik,
  KARSILASTIRMA_TABLOSU: KarsilastirmaTablosuIcerik,
  GERI_SAYIM: GeriSayimIcerik,
  VIDEO_BANNER: VideoBannerIcerik,
  ONCESI_SONRASI: OncesiSonrasiIcerik,
  BULTEN_KAYIT: BultenKayitIcerik,
  BLOK_OLUSTURUCU: BlokOlusturucuIcerik,
  KOSE_YAZARLARI: KoseYazarlariIcerik,
  ILETISIM_BLOK: IletisimBlokIcerik,
  KATEGORI_HABER_LISTESI: KategoriHaberListesiIcerik,
  KATEGORI_HABER_OVERLAY: KategoriHaberOverlayIcerik,
  VIDEO_GALERISI: VideoGalerisiIcerik,
  SEKMELI_HABER: SekmeliHaberIcerik,
  HAVA_DURUMU: HavaDurumuIcerik,
  KRIPTO_LISTESI: KriptoListesiIcerik,
  GUNCEL_KONULAR: GuncelKonularIcerik,
  SIRKET_GIRIS_CIKIS: SirketGirisCikisIcerik,
  HABER_MAGAZIN: HaberMagazinIcerik,
};
