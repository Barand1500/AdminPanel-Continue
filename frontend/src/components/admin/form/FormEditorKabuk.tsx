import { useState } from 'react';
import type { FormFormDegeri } from '@/features/admin/formApi';
import type { FormEditorSekmeId } from '@/types/formYonetimi';
import { AdminDurumEtiketi, AdminSekmeler } from '@/components/admin/ortak/AdminFormBilesenleri';
import { FormAlanlarSekme } from './FormAlanlarSekme';
import { FormBildirimSekme } from './FormBildirimSekme';
import { FormGenelSekme } from './FormGenelSekme';
import { FormKurallarSekme } from './FormKurallarSekme';
import { FormOnizlemeSekme } from './FormOnizlemeSekme';
import { FormYerlesimSekme } from './FormYerlesimSekme';

const EDITOR_SEKMELER: { id: FormEditorSekmeId; etiket: string; ikon: string }[] = [
  { id: 'genel', etiket: 'Genel', ikon: '⚙️' },
  { id: 'alanlar', etiket: 'Alanlar', ikon: '📋' },
  { id: 'yerlesim', etiket: 'Yerleşim', ikon: '📍' },
  { id: 'kurallar', etiket: 'Kurallar', ikon: '🔀' },
  { id: 'bildirim', etiket: 'Bildirim', ikon: '📧' },
  { id: 'onizleme', etiket: 'Önizleme', ikon: '👁️' },
];

interface FormEditorKabukProps {
  form: FormFormDegeri;
  seciliId: string | null;
  onChange: (form: FormFormDegeri) => void;
}

export function FormEditorKabuk({ form, seciliId, onChange }: FormEditorKabukProps) {
  const [sekme, setSekme] = useState<FormEditorSekmeId>('genel');

  return (
    <div className="ap-editor-panel ap-form-editor">
      <div className="ap-editor-ust">
        <div className="ap-editor-baslik">
          <div>
            <h2 className="ap-heading text-base font-semibold">
              {seciliId ? 'Form Düzenle' : 'Yeni Form'}
            </h2>
            <p className="ap-muted text-xs">
              {form.slug ? `/form/${form.slug}` : 'Kayıt sonrası slug oluşturulur'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.aktif ? (
              <AdminDurumEtiketi tur="yayinda">Yayında</AdminDurumEtiketi>
            ) : (
              <AdminDurumEtiketi tur="taslak">Taslak</AdminDurumEtiketi>
            )}
            <AdminDurumEtiketi tur="bilgi">{form.alanlarJson.length} alan</AdminDurumEtiketi>
          </div>
        </div>

        <AdminSekmeler aktif={sekme} onDegistir={setSekme} sekmeler={EDITOR_SEKMELER} />
      </div>

      <div className="ap-editor-icerik">
        {sekme === 'genel' && <FormGenelSekme form={form} onChange={onChange} />}
        {sekme === 'alanlar' && <FormAlanlarSekme form={form} onChange={onChange} />}
        {sekme === 'yerlesim' && <FormYerlesimSekme form={form} onChange={onChange} />}
        {sekme === 'kurallar' && <FormKurallarSekme form={form} onChange={onChange} />}
        {sekme === 'bildirim' && <FormBildirimSekme form={form} onChange={onChange} />}
        {sekme === 'onizleme' && (
          <FormOnizlemeSekme
            form={form}
            kayitliSlug={seciliId ? form.slug : null}
          />
        )}
      </div>
    </div>
  );
}
