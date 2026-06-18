import type { AdminSayfa } from '@/features/admin/sayfaApi';
import type { AdminWidget } from '@/types/admin';
import { configGuncelle, configOku } from '@/types/widget';
import {
  ANA_SAYFA_YERLESIM_BOLGELERI,
  SAYFA_YERLESIM_BOLGELERI,
  bolgeNormalize,
} from '@/utils/widgetYerlesim';
import { AdminFormBolumu } from '@/components/admin/ortak/AdminFormBilesenleri';
import { FormAlani, formSelectSinifi } from '@/components/form/FormAlani';
import { SecimAlani } from './panels/WidgetPanelOrtak';
import type { WidgetPanelProps } from './panels/types';

interface WidgetYerlesimPanelProps extends WidgetPanelProps {
  digerWidgetlar: AdminWidget[];
  mevcutWidgetId?: string | null;
  sayfalar: AdminSayfa[];
}

export function WidgetYerlesimPanel({
  form,
  onChange,
  digerWidgetlar,
  mevcutWidgetId,
  sayfalar,
}: WidgetYerlesimPanelProps) {
  const cfg = configOku(form);
  const anaSayfa = !form.sayfaId;
  const varsayilanBolge = anaSayfa ? 'icerik_alani' : 'sayfa_ustu';
  const yerlesim = cfg.yerlesim ?? { bolge: varsayilanBolge as typeof varsayilanBolge };
  const bolgeSecenekleri = anaSayfa ? ANA_SAYFA_YERLESIM_BOLGELERI : SAYFA_YERLESIM_BOLGELERI;
  const aktifBolge = bolgeNormalize(yerlesim.bolge);
  const hedefSecenekleri = digerWidgetlar.filter(
    (w) => w.id !== mevcutWidgetId && (w.sayfaId ?? '') === (form.sayfaId ?? '')
  );

  function yerlesimGuncelle(parcalar: Partial<typeof yerlesim>) {
    onChange(configGuncelle(form, (c) => ({
      ...c,
      yerlesim: { bolge: aktifBolge, ...c.yerlesim, ...parcalar },
    })));
  }

  function sayfaDegistir(sayfaId: string) {
    const yeniAnaSayfa = !sayfaId;
    const yeniBolge = yeniAnaSayfa ? 'icerik_alani' : 'sayfa_ustu';
    onChange(
      configGuncelle(
        { ...form, sayfaId },
        (c) => ({
          ...c,
          yerlesim: {
            bolge: yeniBolge,
            hedefWidgetId: undefined,
            konum: undefined,
          },
        })
      )
    );
  }

  return (
    <AdminFormBolumu
      baslik="Sayfa Konumu"
      aciklama={
        anaSayfa
          ? 'Widget’ın ana sayfada hangi bölgede görüneceğini seçin. Aynı bölgedeki widget’lar Sıra alanına göre dizilir.'
          : 'Widget’ın seçili sayfada nerede görüneceğini belirleyin.'
      }
    >
      <FormAlani etiket="Sayfa" aciklama="Ana sayfa veya oluşturduğunuz bir sayfa">
        <select
          className={formSelectSinifi}
          value={form.sayfaId}
          onChange={(e) => sayfaDegistir(e.target.value)}
        >
          <option value="">Ana Sayfa</option>
          {sayfalar.map((s) => (
            <option key={s.id} value={s.id}>
              {s.baslik}
            </option>
          ))}
        </select>
      </FormAlani>

      <SecimAlani
        etiket="Bölge"
        deger={aktifBolge}
        secenekler={bolgeSecenekleri.map((b) => ({ id: b.id, etiket: b.etiket }))}
        onChange={(v) =>
          yerlesimGuncelle({
            bolge: v as typeof aktifBolge,
            hedefWidgetId: undefined,
            konum: undefined,
          })
        }
      />
      <p className="ap-muted -mt-1 text-xs">
        {bolgeSecenekleri.find((b) => b.id === aktifBolge)?.aciklama}
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
                <option key={w.id} value={w.id}>
                  {w.ad} ({w.tip.replaceAll('_', ' ')})
                </option>
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
