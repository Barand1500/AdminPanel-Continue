import { FormAlani } from '@/components/form/FormAlani';
import { FontSecici } from '@/components/form/FontSecici';
import { RenkSecici } from '@/components/form/RenkSecici';
import { AdminAnahtarDugme, AdminFormBolumu } from '@/components/admin/ortak/AdminFormBilesenleri';
import {
  configGuncelle,
  configOku,
  WIDGET_GORUNUM_GORSEL_TIPLERI,
  WIDGET_GORUNUM_GRID_TIPLERI,
  WIDGET_GORUNUM_METIN_TIPLERI,
} from '@/types/widget';
import { SecimAlani } from '../panels/WidgetPanelOrtak';
import type { WidgetGorunumPanelProps } from '../panels/types';

export function OrtakGorunumPanel({ form, onChange }: WidgetGorunumPanelProps) {
  const cfg = configOku(form);
  const g = cfg.gorunum ?? {};
  const tip = form.tip;

  const gorselGoster = WIDGET_GORUNUM_GORSEL_TIPLERI.has(tip);
  const gridGoster = WIDGET_GORUNUM_GRID_TIPLERI.has(tip);
  const metinGoster = WIDGET_GORUNUM_METIN_TIPLERI.has(tip);
  const karuselEk = tip === 'BLOG_KARUSEL';

  return (
    <>
      <AdminFormBolumu baslik="Renkler ve boşluk">
        <RenkSecici etiket="Arka plan" deger={form.arkaPlanRenk} varsayilan="#ffffff" onChange={(v) => onChange({ ...form, arkaPlanRenk: v })} />
        <RenkSecici etiket="Genel yazı rengi" deger={form.yaziRenk} varsayilan="#111827" onChange={(v) => onChange({ ...form, yaziRenk: v })} />
        {(metinGoster || gridGoster) && (
          <>
            <RenkSecici etiket="Başlık rengi" deger={g.baslikRengi ?? ''} varsayilan="#0f172a" onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, baslikRengi: v } })))} />
            <RenkSecici etiket="Metin rengi" deger={g.metinRengi ?? ''} varsayilan="#475569" onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, metinRengi: v } })))} />
          </>
        )}
        <SecimAlani
          etiket="Bölüm padding"
          deger={g.padding ?? 'normal'}
          secenekler={[
            { id: 'dar', etiket: 'Dar' },
            { id: 'normal', etiket: 'Normal' },
            { id: 'genis', etiket: 'Geniş' },
          ]}
          onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, padding: v as 'dar' | 'normal' | 'genis' } })))}
        />
      </AdminFormBolumu>

      {(metinGoster || gridGoster) && (
        <AdminFormBolumu baslik="Tipografi">
          <FontSecici deger={g.font ?? ''} onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, font: v } })))} />
          <SecimAlani
            etiket="Başlık boyutu"
            deger={g.baslikBoyutu ?? 'lg'}
            secenekler={[
              { id: 'sm', etiket: 'Küçük' },
              { id: 'md', etiket: 'Orta' },
              { id: 'lg', etiket: 'Büyük' },
              { id: 'xl', etiket: 'Çok büyük' },
            ]}
            onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, baslikBoyutu: v as 'sm' | 'md' | 'lg' | 'xl' } })))}
          />
          {metinGoster && (
            <SecimAlani
              etiket="Metin hizalama"
              deger={g.hizalama ?? 'sol'}
              secenekler={[
                { id: 'sol', etiket: 'Sola' },
                { id: 'orta', etiket: 'Ortaya' },
                { id: 'sag', etiket: 'Sağa' },
              ]}
              onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, hizalama: v as 'sol' | 'orta' | 'sag' } })))}
            />
          )}
        </AdminFormBolumu>
      )}

      <AdminFormBolumu baslik="Görünürlük">
        <div className="ap-switch-grup">
          <AdminAnahtarDugme etiket="Mobilde göster" acik={form.mobilGoster} onDegistir={(v) => onChange({ ...form, mobilGoster: v })} />
          <AdminAnahtarDugme etiket="Masaüstünde göster" acik={form.masaustuGoster} onDegistir={(v) => onChange({ ...form, masaustuGoster: v })} />
        </div>
      </AdminFormBolumu>

      {gorselGoster && (
        <AdminFormBolumu baslik="Görsel ayarları">
          <SecimAlani
            etiket="Görsel boyutu"
            deger={g.gorselBoyutu ?? 'orta'}
            secenekler={[
              { id: 'kucuk', etiket: 'Küçük' },
              { id: 'orta', etiket: 'Orta' },
              { id: 'buyuk', etiket: 'Büyük' },
              { id: 'tam', etiket: 'Tam genişlik' },
            ]}
            onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, gorselBoyutu: v as 'kucuk' | 'orta' | 'buyuk' | 'tam' } })))}
          />
          <SecimAlani
            etiket="Görsel kırpma"
            deger={g.gorselKirpma ?? 'kapla'}
            secenekler={[
              { id: 'kapla', etiket: 'Kapla' },
              { id: 'sigdir', etiket: 'Sığdır' },
              { id: 'orijinal', etiket: 'Orijinal' },
            ]}
            onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, gorselKirpma: v as 'kapla' | 'sigdir' | 'orijinal' } })))}
          />
          <AdminAnahtarDugme
            etiket="Görsel gölgesi"
            acik={g.gorselGolge ?? false}
            onDegistir={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, gorselGolge: v } })))}
          />
        </AdminFormBolumu>
      )}

      {gridGoster && (
        <AdminFormBolumu baslik="Grid ve kart düzeni">
          <FormAlani etiket="Kolon sayısı">
            <input
              type="number"
              min={1}
              max={6}
              className="max-w-[120px] rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-3 py-2 text-sm"
              value={g.kolonSayisi ?? 3}
              onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, kolonSayisi: Number(e.target.value) } })))}
            />
          </FormAlani>
          <SecimAlani
            etiket="Kart aralığı"
            deger={g.kartAraligi ?? 'normal'}
            secenekler={[
              { id: 'dar', etiket: 'Dar' },
              { id: 'normal', etiket: 'Normal' },
              { id: 'genis', etiket: 'Geniş' },
            ]}
            onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, kartAraligi: v as 'dar' | 'normal' | 'genis' } })))}
          />
          {karuselEk && (
            <>
              <RenkSecici etiket="Karusel nokta rengi" deger={g.noktaRengi ?? ''} varsayilan="#3b82f6" onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, noktaRengi: v } })))} />
              <SecimAlani
                etiket="CTA buton stili"
                deger={g.ctaStil ?? 'dolu'}
                secenekler={[
                  { id: 'dolu', etiket: 'Dolu' },
                  { id: 'cerceve', etiket: 'Çerçeveli' },
                  { id: 'hayalet', etiket: 'Hayalet' },
                ]}
                onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, ctaStil: v as 'dolu' | 'cerceve' | 'hayalet' } })))}
              />
            </>
          )}
        </AdminFormBolumu>
      )}
    </>
  );
}
