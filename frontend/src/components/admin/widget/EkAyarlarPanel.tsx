import { useState } from 'react';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { AdminFormBolumu } from '@/components/admin/ortak/AdminFormBilesenleri';
import { configGuncelle, configOku } from '@/types/widget';
import { SecimAlani } from './panels/WidgetPanelOrtak';
import type { WidgetPanelProps } from './panels/types';

export function EkAyarlarPanel({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const ek = cfg.ek ?? {};
  const [gelistiriciAcik, setGelistiriciAcik] = useState(false);

  return (
    <>
      <AdminFormBolumu baslik="Ek Ayarlar" aciklama="Gelişmiş ham JSON yerine yapılandırılmış ek seçenekler">
        <FormAlani etiket="Özel CSS sınıfı">
          <input
            className={formInputSinifi}
            value={ek.ozelSinif ?? ''}
            onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, ek: { ...c.ek, ozelSinif: e.target.value } })))}
            placeholder="ornek-bolum"
          />
        </FormAlani>
        <FormAlani etiket="Bölüm anchor ID">
          <input
            className={formInputSinifi}
            value={ek.bolumId ?? ''}
            onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, ek: { ...c.ek, bolumId: e.target.value } })))}
            placeholder="hizmetler"
          />
        </FormAlani>
        <SecimAlani
          etiket="Giriş animasyonu"
          deger={ek.girisAnimasyonu ?? 'yok'}
          secenekler={[
            { id: 'yok', etiket: 'Yok' },
            { id: 'fade', etiket: 'Fade' },
            { id: 'slide', etiket: 'Slide' },
          ]}
          onChange={(v: string) => onChange(configGuncelle(form, (c) => ({ ...c, ek: { ...c.ek, girisAnimasyonu: v as 'yok' | 'fade' | 'slide' } })))}
        />
      </AdminFormBolumu>

      <AdminFormBolumu baslik="Geliştirici modu" aciklama="Acil durum / toplu taşıma için ham JSON">
        <button
          type="button"
          className="text-sm text-[var(--ap-accent)]"
          onClick={() => setGelistiriciAcik((v) => !v)}
        >
          {gelistiriciAcik ? 'JSON editörünü gizle' : 'JSON editörünü göster'}
        </button>
        {gelistiriciAcik && (
          <textarea
            className={`${formInputSinifi} mt-2 min-h-[200px] font-mono text-xs`}
            value={form.configJsonMetin}
            onChange={(e) => onChange({ ...form, configJsonMetin: e.target.value })}
            spellCheck={false}
          />
        )}
      </AdminFormBolumu>
    </>
  );
}
