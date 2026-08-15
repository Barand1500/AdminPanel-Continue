import type { FormFormDegeri } from '@/features/admin/formApi';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';

interface FormGenelSekmeProps {
  form: FormFormDegeri;
  onChange: (form: FormFormDegeri) => void;
  onAdYaz: (ad: string) => void;
  onSlugYaz: (slug: string) => void;
}

export function FormGenelSekme({ form, onChange, onAdYaz, onSlugYaz }: FormGenelSekmeProps) {
  return (
    <div className="ap-form-genel-satir">
      <FormAlani etiket="Form adı">
        <div className="ap-form-ad-grup">
          <input
            className={`${formInputSinifi} ap-form-ad-input`}
            placeholder="İletişim Formu"
            value={form.ad}
            onChange={(e) => onAdYaz(e.target.value)}
          />
          <input
            className={`${formInputSinifi} ap-form-slug-input`}
            placeholder="slug"
            value={form.slug}
            onChange={(e) => onSlugYaz(e.target.value)}
            title="Slug"
            aria-label="Slug"
          />
        </div>
      </FormAlani>
      <FormAlani etiket="Açıklama">
        <input
          className={formInputSinifi}
          placeholder="Ziyaretçiye gösterilen kısa açıklama"
          value={form.aciklama}
          onChange={(e) => onChange({ ...form, aciklama: e.target.value })}
        />
      </FormAlani>
    </div>
  );
}
