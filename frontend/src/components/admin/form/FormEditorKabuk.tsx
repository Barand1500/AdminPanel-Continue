import { useEffect, useState } from 'react';
import type { FormFormDegeri } from '@/features/admin/formApi';
import type { FormEditorSekmeId } from '@/types/formYonetimi';
import {
  AdminAnahtarDugme,
  slugUret,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import { FormAlanlarSekme } from './FormAlanlarSekme';
import { FormBildirimSekme } from './FormBildirimSekme';
import { FormGenelSekme } from './FormGenelSekme';
import { FormKurallarSekme } from './FormKurallarSekme';
import { FormYerlesimSekme } from './FormYerlesimSekme';

const IC_SEKMELER: { id: FormEditorSekmeId; etiket: string }[] = [
  { id: 'alanlar', etiket: 'Alanlar' },
  { id: 'yerlesim', etiket: 'Yerleşim' },
  { id: 'kurallar', etiket: 'Kurallar' },
  { id: 'bildirim', etiket: 'Bildirim' },
];

interface FormEditorKabukProps {
  form: FormFormDegeri;
  seciliId: string | null;
  onChange: (form: FormFormDegeri) => void;
}

export function FormEditorKabuk({ form, seciliId, onChange }: FormEditorKabukProps) {
  const [sekme, setSekme] = useState<FormEditorSekmeId>('alanlar');
  const [slugManuel, setSlugManuel] = useState(false);

  useEffect(() => {
    setSlugManuel(Boolean(seciliId));
  }, [seciliId]);

  function adYaz(ad: string) {
    const guncel: FormFormDegeri = { ...form, ad };
    if (!slugManuel && !seciliId) guncel.slug = slugUret(ad);
    onChange(guncel);
  }

  function slugYaz(slug: string) {
    setSlugManuel(true);
    onChange({ ...form, slug });
  }

  return (
    <div className="ap-editor-panel ap-form-editor">
      <div className="ap-form-editor-ust">
        <div>
          <h2 className="ap-heading text-sm font-semibold">{seciliId ? 'Form düzenle' : 'Yeni form'}</h2>
          <p className="ap-muted text-xs">
            {form.slug ? `/form/${form.slug}` : 'Boş bırakılırsa slug otomatik oluşur'}
          </p>
        </div>
        <div className={`ap-form-yayin-anahtar${form.aktif ? ' ap-form-yayin-anahtar--acik' : ''}`}>
          <AdminAnahtarDugme
            etiket="Yayında"
            acik={form.aktif}
            onDegistir={(aktif) => onChange({ ...form, aktif })}
          />
        </div>
      </div>

      <div className="ap-form-editor-govde">
        <FormGenelSekme form={form} onChange={onChange} onAdYaz={adYaz} onSlugYaz={slugYaz} />

        <div className="ap-form-ic-piller" role="tablist">
          {IC_SEKMELER.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={sekme === s.id}
              className={`ap-form-ic-pil${sekme === s.id ? ' ap-form-ic-pil--aktif' : ''}`}
              onClick={() => setSekme(s.id)}
            >
              {s.etiket}
              {s.id === 'alanlar' ? ` (${form.alanlarJson.length})` : ''}
            </button>
          ))}
        </div>

        <div className="ap-form-ic-govde">
          {sekme === 'alanlar' && <FormAlanlarSekme form={form} onChange={onChange} />}
          {sekme === 'yerlesim' && <FormYerlesimSekme form={form} onChange={onChange} />}
          {sekme === 'kurallar' && <FormKurallarSekme form={form} onChange={onChange} />}
          {sekme === 'bildirim' && <FormBildirimSekme form={form} onChange={onChange} />}
        </div>
      </div>
    </div>
  );
}
