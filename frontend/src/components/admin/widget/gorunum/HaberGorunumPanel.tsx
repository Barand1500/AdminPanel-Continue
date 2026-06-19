import { EmojiSecici } from '@/components/form/EmojiSecici';
import { RenkSecici } from '@/components/form/RenkSecici';
import { AdminAnahtarDugme, AdminFormBolumu } from '@/components/admin/ortak/AdminFormBilesenleri';
import { configGuncelle, configOku, WIDGET_GORUNUM_HABER_TIPLERI } from '@/types/widget';
import { SecimAlani } from '../panels/WidgetPanelOrtak';
import type { WidgetGorunumPanelProps } from '../panels/types';

const SAYFALAMA_SECENEKLERI = [
  { id: 'nokta', etiket: 'Nokta (• • •)' },
  { id: 'numara', etiket: 'Numaralı (1 2 3)' },
  { id: 'ok', etiket: 'Ok butonları' },
  { id: 'thumbnail', etiket: 'Çizgi / bar' },
  { id: 'yok', etiket: 'Gizle' },
];

const GORSEL_KONUMU_SECENEKLERI = [
  { id: 'sol', etiket: 'Solda' },
  { id: 'sag', etiket: 'Sağda' },
  { id: 'ust', etiket: 'Üstte' },
  { id: 'alt', etiket: 'Altta' },
  { id: 'arkaplan', etiket: 'Arka plan (overlay)' },
];

const KART_STILI_SECENEKLERI = [
  { id: 'duz', etiket: 'Düz kart' },
  { id: 'yatay', etiket: 'Yatay liste' },
  { id: 'dikey', etiket: 'Dikey kart' },
  { id: 'overlay', etiket: 'Görsel üzeri yazı' },
];

export function HaberGorunumPanel({ form, onChange }: WidgetGorunumPanelProps) {
  const cfg = configOku(form);
  const g = cfg.gorunum ?? {};
  const tip = form.tip;

  if (!WIDGET_GORUNUM_HABER_TIPLERI.has(tip)) return null;

  const sayfalamaGoster = ['SLIDER', 'KOSE_YAZARLARI', 'VIDEO_GALERISI', 'BLOG_KARUSEL', 'EKIP_KARUSEL'].includes(tip);
  const gorselKonumuGoster = [
    'KOSE_YAZARLARI',
    'KATEGORI_HABER_LISTESI',
    'HABER_MAGAZIN',
    'SEKMELI_HABER',
    'BASLIK_METIN_GORSEL',
  ].includes(tip);
  const kartStiliGoster = ['KATEGORI_HABER_LISTESI', 'KATEGORI_HABER_OVERLAY', 'HABER_MAGAZIN'].includes(tip);
  const baslikAyarGoster = !['HAVA_DURUMU', 'SIRKET_GIRIS_CIKIS'].includes(tip);
  const haritaDuzen = tip === 'ILETISIM_BLOK';

  return (
    <>
      {baslikAyarGoster && (
        <AdminFormBolumu baslik="Bölüm başlığı">
          <RenkSecici
            etiket="Vurgu / başlık rengi"
            deger={g.vurguRengi ?? g.baslikRengi ?? ''}
            varsayilan="#dc2626"
            onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, vurguRengi: v, baslikRengi: v } })))}
          />
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--ap-muted)]">Başlık ikonu</span>
            <EmojiSecici
              sadeceSecim
              deger={g.baslikIkon ?? '✒️'}
              onChange={(emoji) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, baslikIkon: emoji } })))}
            />
          </div>
          <AdminAnahtarDugme
            etiket="Başlık alt çizgisi"
            acik={g.baslikCizgi !== false}
            onDegistir={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, baslikCizgi: v } })))}
          />
        </AdminFormBolumu>
      )}

      {sayfalamaGoster && (
        <AdminFormBolumu baslik="Sayfalama / gezinme">
          <SecimAlani
            etiket="Gezinme stili"
            deger={g.sayfalamaStili ?? (tip === 'SLIDER' ? 'numara' : 'ok')}
            secenekler={SAYFALAMA_SECENEKLERI}
            onChange={(v) =>
              onChange(
                configGuncelle(form, (c) => ({
                  ...c,
                  gorunum: { ...c.gorunum, sayfalamaStili: v as typeof g.sayfalamaStili },
                }))
              )
            }
          />
        </AdminFormBolumu>
      )}

      {gorselKonumuGoster && (
        <AdminFormBolumu baslik="Görsel konumu">
          <SecimAlani
            etiket="Fotoğraf / görsel yeri"
            deger={g.gorselKonumu ?? 'sol'}
            secenekler={GORSEL_KONUMU_SECENEKLERI}
            onChange={(v) =>
              onChange(
                configGuncelle(form, (c) => ({
                  ...c,
                  gorunum: { ...c.gorunum, gorselKonumu: v as typeof g.gorselKonumu },
                }))
              )
            }
          />
        </AdminFormBolumu>
      )}

      {kartStiliGoster && (
        <AdminFormBolumu baslik="Kart stili">
          <SecimAlani
            etiket="Varsayılan kart görünümü"
            deger={g.kartStili ?? 'duz'}
            secenekler={KART_STILI_SECENEKLERI}
            onChange={(v) =>
              onChange(
                configGuncelle(form, (c) => ({
                  ...c,
                  gorunum: { ...c.gorunum, kartStili: v as typeof g.kartStili },
                }))
              )
            }
          />
        </AdminFormBolumu>
      )}

      {haritaDuzen && (
        <AdminFormBolumu baslik="Harita düzeni">
          <SecimAlani
            etiket="Harita konumu"
            deger={g.icerikDuzeni ?? 'sag'}
            secenekler={[
              { id: 'sag', etiket: 'Harita sağda' },
              { id: 'sol', etiket: 'Harita solda' },
            ]}
            onChange={(v) =>
              onChange(
                configGuncelle(form, (c) => ({
                  ...c,
                  gorunum: { ...c.gorunum, icerikDuzeni: v as 'sol' | 'sag' },
                }))
              )
            }
          />
        </AdminFormBolumu>
      )}

      {tip === 'SIRKET_GIRIS_CIKIS' && (
        <AdminFormBolumu baslik="Açılış / kapanış kartı renkleri">
          <RenkSecici
            etiket="Ana renk"
            deger={g.vurguRengi ?? ''}
            varsayilan="#2563eb"
            onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, vurguRengi: v } })))}
          />
        </AdminFormBolumu>
      )}
    </>
  );
}
