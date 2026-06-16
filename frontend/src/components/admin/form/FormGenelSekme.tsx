import type { FormFormDegeri } from '@/features/admin/formApi';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';

interface FormGenelSekmeProps {
  form: FormFormDegeri;
  onChange: (form: FormFormDegeri) => void;
}

export function FormGenelSekme({ form, onChange }: FormGenelSekmeProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormAlani etiket="Form Adı" aciklama="Yönetim panelinde görünen isim">
          <input
            className={formInputSinifi}
            placeholder="İletişim Formu"
            value={form.ad}
            onChange={(e) => onChange({ ...form, ad: e.target.value })}
          />
        </FormAlani>
        <FormAlani etiket="Slug" aciklama="URL: /form/iletisim">
          <input
            className={formInputSinifi}
            placeholder="iletisim"
            value={form.slug}
            onChange={(e) => onChange({ ...form, slug: e.target.value })}
          />
        </FormAlani>
      </div>
      <FormAlani etiket="Form Açıklaması" aciklama="Ziyaretçiye gösterilen kısa açıklama">
        <textarea
          className={formInputSinifi}
          rows={3}
          placeholder="Sorularınız için formu doldurun..."
          value={form.aciklama}
          onChange={(e) => onChange({ ...form, aciklama: e.target.value })}
        />
      </FormAlani>
      <label className="ap-form-toggle-satir">
        <div>
          <p className="font-medium text-sm">Form yayında</p>
          <p className="ap-muted text-xs">Kapalıyken sitede görünmez</p>
        </div>
        <input
          type="checkbox"
          className="h-5 w-5 accent-[var(--ap-accent)]"
          checked={form.aktif}
          onChange={(e) => onChange({ ...form, aktif: e.target.checked })}
        />
      </label>
    </div>
  );
}
