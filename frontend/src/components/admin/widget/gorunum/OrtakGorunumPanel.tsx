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
import { HaberGorunumPanel } from './HaberGorunumPanel';
import { WidgetGorunumTipSecici } from './WidgetGorunumTipSecici';
import { YorumKartlariGorunumPanel } from './YorumKartlariGorunumPanel';

export function OrtakGorunumPanel({ form, onChange }: WidgetGorunumPanelProps) {
  const cfg = configOku(form);
  const g = cfg.gorunum ?? {};
  const tip = form.tip;

  const gorselGoster = WIDGET_GORUNUM_GORSEL_TIPLERI.has(tip);
  const gridGoster = WIDGET_GORUNUM_GRID_TIPLERI.has(tip);
  const metinGoster = WIDGET_GORUNUM_METIN_TIPLERI.has(tip);
  const karuselEk = tip === 'BLOG_KARUSEL';
  const karsilastirmaEk = tip === 'KARSILASTIRMA_TABLOSU';
  const popupEk = tip === 'POPUP';
  const iletisimCtaEk = tip === 'ILETISIM_FORMU';
  const gorunumTipi = g.gorunumTipi ?? 'merkez-basit';
  const tipEk = g.tipEk ?? {};

  return (
    <>
      <WidgetGorunumTipSecici form={form} onChange={onChange} />

      {iletisimCtaEk && ['gradient-banner', 'bol-split'].includes(gorunumTipi) && (
        <AdminFormBolumu baslik="CTA banner ayarları">
          {gorunumTipi === 'gradient-banner' && (
            <FormAlani etiket="Rozet metni">
              <input
                className="max-w-md rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-3 py-2 text-sm"
                value={(tipEk.rozetMetni as string) ?? 'Hazır Mısınız?'}
                onChange={(e) =>
                  onChange(
                    configGuncelle(form, (c) => ({
                      ...c,
                      gorunum: {
                        ...c.gorunum,
                        tipEk: { ...c.gorunum?.tipEk, rozetMetni: e.target.value },
                      },
                    }))
                  )
                }
              />
            </FormAlani>
          )}
          <FormAlani etiket="İkinci buton metni">
            <input
              className="max-w-md rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-3 py-2 text-sm"
              value={(tipEk.ikinciButonMetni as string) ?? 'Tüm Özellikler'}
              onChange={(e) =>
                onChange(
                  configGuncelle(form, (c) => ({
                    ...c,
                    gorunum: {
                      ...c.gorunum,
                      tipEk: { ...c.gorunum?.tipEk, ikinciButonMetni: e.target.value },
                    },
                  }))
                )
              }
            />
          </FormAlani>
          <FormAlani etiket="İkinci buton linki">
            <input
              className="max-w-md rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-3 py-2 text-sm"
              value={(tipEk.ikinciButonLink as string) ?? '#'}
              onChange={(e) =>
                onChange(
                  configGuncelle(form, (c) => ({
                    ...c,
                    gorunum: {
                      ...c.gorunum,
                      tipEk: { ...c.gorunum?.tipEk, ikinciButonLink: e.target.value },
                    },
                  }))
                )
              }
            />
          </FormAlani>
        </AdminFormBolumu>
      )}

      <AdminFormBolumu baslik="Renkler ve boşluk">
        <RenkSecici etiket="Arka plan" deger={form.arkaPlanRenk} varsayilan="#ffffff" onChange={(v) => onChange({ ...form, arkaPlanRenk: v })} />
        <RenkSecici etiket="Genel yazı rengi" deger={form.yaziRenk} varsayilan="#111827" onChange={(v) => onChange({ ...form, yaziRenk: v })} />
        {(metinGoster || gridGoster) && (
          <>
            <RenkSecici etiket="Başlık rengi" deger={g.baslikRengi ?? ''} varsayilan="#0f172a" onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, baslikRengi: v } })))} />
            <RenkSecici etiket="Metin rengi" deger={g.metinRengi ?? ''} varsayilan="#475569" onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, metinRengi: v } })))} />
          </>
        )}
        {karsilastirmaEk && (
          <>
            <RenkSecici etiket="Tablo kenar rengi" deger={g.tabloKenarRengi ?? ''} varsayilan="#e2e8f0" onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, tabloKenarRengi: v } })))} />
            <RenkSecici etiket="Tablo başlık arka planı" deger={g.tabloBaslikArkaPlan ?? ''} varsayilan="#f8fafc" onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, tabloBaslikArkaPlan: v } })))} />
          </>
        )}
        {(karsilastirmaEk || popupEk || tip === 'SSS') && (
          <RenkSecici etiket="Vurgu rengi" deger={g.vurguRengi ?? ''} varsayilan="#7c3aed" onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, vurguRengi: v } })))} />
        )}
        {(popupEk || tip === 'SSS') && (
          <FormAlani etiket="Köşe yuvarlaklığı (px)">
            <input
              type="number"
              min={0}
              max={32}
              className="max-w-[120px] rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-3 py-2 text-sm"
              value={g.borderRadius ?? (popupEk ? 16 : 12)}
              onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, borderRadius: Number(e.target.value) } })))}
            />
          </FormAlani>
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

      <AdminFormBolumu baslik="Bölüm genişliği">
        <SecimAlani
          etiket="Yatay genişlik"
          deger={g.bolumGenisligi ?? 'normal'}
          secenekler={[
            { id: 'normal', etiket: 'Normal genişlik' },
            { id: 'tam_ekran', etiket: 'Tam ekran' },
          ]}
          onChange={(v) =>
            onChange(
              configGuncelle(form, (c) => ({
                ...c,
                gorunum: { ...c.gorunum, bolumGenisligi: v as 'normal' | 'tam_ekran' },
              }))
            )
          }
        />
        <p className="ap-muted text-xs">
          Tam ekran: bölüm yatayda kenardan kenara uzanır (marka şeridi gibi tam genişlik içerikler için).
        </p>
      </AdminFormBolumu>

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

      <HaberGorunumPanel form={form} onChange={onChange} />
      <YorumKartlariGorunumPanel form={form} onChange={onChange} />
    </>
  );
}
