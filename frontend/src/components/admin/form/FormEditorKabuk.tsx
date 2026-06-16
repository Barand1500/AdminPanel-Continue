import { useState } from 'react';
import type { FormFormDegeri } from '@/features/admin/formApi';
import type { FormEditorSekmeId } from '@/types/formYonetimi';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import { FormAlanlarSekme } from './FormAlanlarSekme';
import { FormBildirimSekme } from './FormBildirimSekme';
import { FormGenelSekme } from './FormGenelSekme';
import { FormKurallarSekme } from './FormKurallarSekme';
import { FormOnizlemeSekme } from './FormOnizlemeSekme';
import { FormSekmeCubugu } from './FormSekmeCubugu';
import { FormYerlesimSekme } from './FormYerlesimSekme';

interface FormEditorKabukProps {
  form: FormFormDegeri;
  seciliId: string | null;
  onChange: (form: FormFormDegeri) => void;
}

export function FormEditorKabuk({ form, seciliId, onChange }: FormEditorKabukProps) {
  const [sekme, setSekme] = useState<FormEditorSekmeId>('genel');

  return (
    <AdminPanelKarti
      baslik={seciliId ? 'Form Düzenle' : 'Yeni Form'}
      altBaslik="Alt bardan Kaydet / Yayınla · Sekmeler arası geçiş yapın"
    >
      <FormSekmeCubugu aktif={sekme} onDegistir={setSekme} />
      <div className="mt-5">
        {sekme === 'genel' && <FormGenelSekme form={form} onChange={onChange} />}
        {sekme === 'alanlar' && <FormAlanlarSekme form={form} onChange={onChange} />}
        {sekme === 'yerlesim' && <FormYerlesimSekme form={form} onChange={onChange} />}
        {sekme === 'kurallar' && <FormKurallarSekme form={form} onChange={onChange} />}
        {sekme === 'bildirim' && <FormBildirimSekme form={form} onChange={onChange} />}
        {sekme === 'onizleme' && <FormOnizlemeSekme form={form} />}
      </div>
    </AdminPanelKarti>
  );
}
