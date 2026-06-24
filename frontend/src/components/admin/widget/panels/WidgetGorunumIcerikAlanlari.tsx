import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { AdminFormBolumu } from '@/components/admin/ortak/AdminFormBilesenleri';
import {
  gorunumIcerikAlanlariBul,
  type WidgetIcerikAlanId,
} from '@/data/widgetGorunumIcerikAlanlari';
import { widgetGorunumTipTanimiBul } from '@/data/widgetGorunumTipleri';
import { configGuncelle, configOku } from '@/types/widget';
import { FiltreEtiketYonetici } from './FiltreEtiketYonetici';
import type { WidgetPanelProps } from './types';

const ALAN_ETIKET: Record<WidgetIcerikAlanId, string> = {
  baslik: 'Bölüm başlığı',
  altBaslik: 'Üst etiket / alt başlık',
  aciklama: 'Açıklama',
  butonMetni: 'Buton metni',
  butonLink: 'Buton link',
  solBaslik: 'Sol panel / yan başlık',
  solAciklama: 'Sol panel / yan açıklama',
  filtreler: 'Kategori filtreleri',
  modulIkon: 'Modül ikonu (emoji)',
  dahaFazla: '“Daha fazla” metni ve linki',
  tumunuGor: '“Tümünü gör” metni ve linki',
  heroBannerMetin: 'Hero banner metni',
};

const ALAN_ACIKLAMA: Partial<Record<WidgetIcerikAlanId, string>> = {
  solBaslik: 'Bu görünümde sol veya üst bölümde gösterilir.',
  solAciklama: 'Kısa tanıtım paragrafı.',
  filtreler: 'Sekmeli veya filtreli görünümlerde kullanılır. Kartlardaki kategori etiketi ile eşleşmeli.',
  heroBannerMetin: 'Üstteki büyük hero kartının alt metni (boşsa açıklama kullanılır).',
  modulIkon: 'Sol taraftaki kare ikon kutusunda gösterilir.',
};

export function WidgetGorunumIcerikAlanlari({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const gt = cfg.gorunum?.gorunumTipi;
  const alanlar = gorunumIcerikAlanlariBul(form.tip, gt);
  if (alanlar.length === 0) return null;

  const tanim = widgetGorunumTipTanimiBul(form.tip, gt);

  function alanVar(id: WidgetIcerikAlanId) {
    return alanlar.includes(id);
  }

  return (
    <AdminFormBolumu
      baslik={`${tanim.ad} — içerik alanları`}
      aciklama="Seçili görünüm tipi için gerekli metin alanları. Görünüm tipini değiştirdiğinizde bu bölüm güncellenir."
    >
      {alanVar('baslik') && (
        <FormAlani etiket={ALAN_ETIKET.baslik}>
          <input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} />
        </FormAlani>
      )}
      {alanVar('altBaslik') && (
        <FormAlani etiket={ALAN_ETIKET.altBaslik} aciklama="Boş bırakırsanız sitede görünmez.">
          <input className={formInputSinifi} value={form.altBaslik} placeholder="Örn. HAKKIMIZDA" onChange={(e) => onChange({ ...form, altBaslik: e.target.value })} />
        </FormAlani>
      )}
      {alanVar('aciklama') && (
        <FormAlani etiket={ALAN_ETIKET.aciklama} aciklama={ALAN_ACIKLAMA.aciklama}>
          <textarea className={formInputSinifi} rows={3} value={form.aciklama} onChange={(e) => onChange({ ...form, aciklama: e.target.value })} />
        </FormAlani>
      )}
      {alanVar('solBaslik') && (
        <FormAlani etiket={ALAN_ETIKET.solBaslik} aciklama={ALAN_ACIKLAMA.solBaslik}>
          <input
            className={formInputSinifi}
            value={cfg.solBaslik ?? ''}
            onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, solBaslik: e.target.value })))}
          />
        </FormAlani>
      )}
      {alanVar('solAciklama') && (
        <FormAlani etiket={ALAN_ETIKET.solAciklama} aciklama={ALAN_ACIKLAMA.solAciklama}>
          <textarea
            className={formInputSinifi}
            rows={2}
            value={cfg.solAciklama ?? ''}
            onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, solAciklama: e.target.value })))}
          />
        </FormAlani>
      )}
      {alanVar('heroBannerMetin') && (
        <FormAlani etiket={ALAN_ETIKET.heroBannerMetin} aciklama={ALAN_ACIKLAMA.heroBannerMetin}>
          <textarea
            className={formInputSinifi}
            rows={2}
            value={(cfg.gorunum?.tipEk?.heroBannerMetin as string) ?? cfg.solAciklama ?? ''}
            onChange={(e) =>
              onChange(
                configGuncelle(form, (c) => ({
                  ...c,
                  solAciklama: e.target.value,
                  gorunum: {
                    ...c.gorunum,
                    tipEk: { ...c.gorunum?.tipEk, heroBannerMetin: e.target.value },
                  },
                }))
              )
            }
          />
        </FormAlani>
      )}
      {alanVar('modulIkon') && (
        <FormAlani etiket={ALAN_ETIKET.modulIkon} aciklama={ALAN_ACIKLAMA.modulIkon}>
          <input
            className={formInputSinifi}
            placeholder="💳"
            value={cfg.modulIkon ?? ''}
            onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, modulIkon: e.target.value })))}
          />
        </FormAlani>
      )}
      {(alanVar('butonMetni') || alanVar('butonLink')) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {alanVar('butonMetni') && (
            <FormAlani etiket={ALAN_ETIKET.butonMetni}>
              <input className={formInputSinifi} value={form.butonMetni} onChange={(e) => onChange({ ...form, butonMetni: e.target.value })} />
            </FormAlani>
          )}
          {alanVar('butonLink') && (
            <FormAlani etiket={ALAN_ETIKET.butonLink}>
              <input className={formInputSinifi} value={form.butonLink} onChange={(e) => onChange({ ...form, butonLink: e.target.value })} />
            </FormAlani>
          )}
        </div>
      )}
      {alanVar('dahaFazla') && (
        <div className="grid gap-3 sm:grid-cols-2">
          <FormAlani etiket="“Daha fazla” metni">
            <input
              className={formInputSinifi}
              value={cfg.dahaFazlaMetin ?? ''}
              onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, dahaFazlaMetin: e.target.value })))}
            />
          </FormAlani>
          <FormAlani etiket="“Daha fazla” link">
            <input
              className={formInputSinifi}
              value={cfg.dahaFazlaLink ?? ''}
              onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, dahaFazlaLink: e.target.value })))}
            />
          </FormAlani>
        </div>
      )}
      {alanVar('tumunuGor') && (
        <div className="grid gap-3 sm:grid-cols-2">
          <FormAlani etiket="Tümünü gör metni">
            <input
              className={formInputSinifi}
              value={cfg.tumunuGorMetin ?? ''}
              onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, tumunuGorMetin: e.target.value })))}
            />
          </FormAlani>
          <FormAlani etiket="Tümünü gör linki">
            <input
              className={formInputSinifi}
              value={cfg.tumunuGorLink ?? ''}
              onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, tumunuGorLink: e.target.value })))}
            />
          </FormAlani>
        </div>
      )}
      {alanVar('filtreler') && (
        <FormAlani etiket={ALAN_ETIKET.filtreler} aciklama={ALAN_ACIKLAMA.filtreler}>
          <FiltreEtiketYonetici
            filtreler={cfg.filtreler ?? []}
            onChange={(f) => onChange(configGuncelle(form, (c) => ({ ...c, filtreler: f })))}
          />
        </FormAlani>
      )}
    </AdminFormBolumu>
  );
}
