import type { AdminWidget } from '@/types/admin';
import { configGuncelle, configOku } from '@/types/widget';
import { WIDGET_YERLESIM_BOLGELERI } from '@/utils/widgetYerlesim';
import { AdminFormBolumu } from '@/components/admin/ortak/AdminFormBilesenleri';
import { FormAlani, formSelectSinifi } from '@/components/form/FormAlani';
import { SecimAlani } from './panels/WidgetPanelOrtak';
import type { WidgetPanelProps } from './panels/types';

interface WidgetYerlesimPanelProps extends WidgetPanelProps {
  digerWidgetlar: AdminWidget[];
  mevcutWidgetId?: string | null;
}

export function WidgetYerlesimPanel({ form, onChange, digerWidgetlar, mevcutWidgetId }: WidgetYerlesimPanelProps) {
  const cfg = configOku(form);
  const yerlesim = cfg.yerlesim ?? { bolge: 'urunler_alti' as const };
  const hedefSecenekleri = digerWidgetlar.filter((w) => w.id !== mevcutWidgetId);

  function yerlesimGuncelle(parcalar: Partial<typeof yerlesim>) {
    onChange(configGuncelle(form, (c) => ({
      ...c,
      yerlesim: { bolge: yerlesim.bolge, ...c.yerlesim, ...parcalar },
    })));
  }

  return (
    <AdminFormBolumu
      baslik="Sayfa Konumu"
      aciklama="Widget’ın anasayfada hangi bölgede görüneceğini seçin. Aynı bölgedeki widget’lar Sıra alanına göre dizilir."
    >
      <SecimAlani
        etiket="Bölge"
        deger={yerlesim.bolge}
        secenekler={WIDGET_YERLESIM_BOLGELERI.map((b) => ({ id: b.id, etiket: b.etiket }))}
        onChange={(v) => yerlesimGuncelle({ bolge: v as typeof yerlesim.bolge, hedefWidgetId: undefined, konum: undefined })}
      />
      <p className="ap-muted -mt-1 text-xs">
        {WIDGET_YERLESIM_BOLGELERI.find((b) => b.id === yerlesim.bolge)?.aciklama}
      </p>

      {hedefSecenekleri.length > 0 && (
        <>
          <FormAlani etiket="Başka widget’a göre (isteğe bağlı)" aciklama="Seçilen widget’ın hemen üstüne veya altına yerleştirir">
            <select
              className={formSelectSinifi}
              value={yerlesim.hedefWidgetId ?? ''}
              onChange={(e) => {
                const id = e.target.value || undefined;
                yerlesimGuncelle({
                  hedefWidgetId: id,
                  konum: id ? (yerlesim.konum ?? 'sonra') : undefined,
                });
              }}
            >
              <option value="">Yalnızca bölgeye göre</option>
              {hedefSecenekleri.map((w) => (
                <option key={w.id} value={w.id}>{w.ad} ({w.tip.replaceAll('_', ' ')})</option>
              ))}
            </select>
          </FormAlani>

          {yerlesim.hedefWidgetId && (
            <SecimAlani
              etiket="Konum"
              deger={yerlesim.konum ?? 'sonra'}
              secenekler={[
                { id: 'once', etiket: 'Hedef widget üstüne' },
                { id: 'sonra', etiket: 'Hedef widget altına' },
              ]}
              onChange={(v) => yerlesimGuncelle({ konum: v as 'once' | 'sonra' })}
            />
          )}
        </>
      )}
    </AdminFormBolumu>
  );
}
