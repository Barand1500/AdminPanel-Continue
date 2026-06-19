import { FormAlani } from '@/components/form/FormAlani';
import { RenkSecici } from '@/components/form/RenkSecici';
import { AdminAnahtarDugme, AdminFormBolumu } from '@/components/admin/ortak/AdminFormBilesenleri';
import { configGuncelle, configOku } from '@/types/widget';
import { SecimAlani } from '../panels/WidgetPanelOrtak';
import type { WidgetGorunumPanelProps } from '../panels/types';

export function YorumKartlariGorunumPanel({ form, onChange }: WidgetGorunumPanelProps) {
  if (form.tip !== 'YORUM_KARTLARI') return null;

  const cfg = configOku(form);
  const g = cfg.gorunum ?? {};

  return (
    <AdminFormBolumu baslik="Yorum kartları görünümü">
      <AdminAnahtarDugme
        etiket="Yıldız puanını göster"
        acik={g.yildizGoster !== false}
        onDegistir={(v) =>
          onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, yildizGoster: v } })))
        }
      />
      {g.yildizGoster !== false && (
        <RenkSecici
          etiket="Yıldız rengi"
          deger={g.yildizRengi ?? ''}
          varsayilan="#facc15"
          onChange={(v) =>
            onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, yildizRengi: v } })))
          }
        />
      )}
      <RenkSecici
        etiket="Üst etiket rengi (YORUMLAR)"
        deger={g.vurguRengi ?? ''}
        varsayilan="#2563eb"
        onChange={(v) =>
          onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, vurguRengi: v } })))
        }
      />
      <RenkSecici
        etiket="Yazar alanı arka planı"
        deger={g.kartFooterArkaPlan ?? ''}
        varsayilan="#f1f5f9"
        onChange={(v) =>
          onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, kartFooterArkaPlan: v } })))
        }
      />
      <AdminAnahtarDugme
        etiket="Kart gölgesi"
        acik={g.kartGolge !== false}
        onDegistir={(v) =>
          onChange(configGuncelle(form, (c) => ({ ...c, gorunum: { ...c.gorunum, kartGolge: v } })))
        }
      />
      <FormAlani etiket="Kart köşe yuvarlaklığı (px)">
        <input
          type="number"
          min={0}
          max={32}
          className="max-w-[120px] rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-3 py-2 text-sm"
          value={g.borderRadius ?? 12}
          onChange={(e) =>
            onChange(
              configGuncelle(form, (c) => ({
                ...c,
                gorunum: { ...c.gorunum, borderRadius: Number(e.target.value) || 0 },
              }))
            )
          }
        />
      </FormAlani>
      <SecimAlani
        etiket="Başlık hizalama"
        deger={g.hizalama ?? 'orta'}
        secenekler={[
          { id: 'sol', etiket: 'Sola' },
          { id: 'orta', etiket: 'Ortaya' },
          { id: 'sag', etiket: 'Sağa' },
        ]}
        onChange={(v) =>
          onChange(
            configGuncelle(form, (c) => ({
              ...c,
              gorunum: { ...c.gorunum, hizalama: v as 'sol' | 'orta' | 'sag' },
            }))
          )
        }
      />
    </AdminFormBolumu>
  );
}
