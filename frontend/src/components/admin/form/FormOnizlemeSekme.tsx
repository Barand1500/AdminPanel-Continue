import type { FormFormDegeri } from '@/features/admin/formApi';
import { DinamikForm } from '@/components/ortak/form/DinamikForm';
import { GORUNUM_TIPLERI } from '@/types/formYonetimi';

interface FormOnizlemeSekmeProps {
  form: FormFormDegeri;
  /** Kayıtlı formda slug ile gerçek API gönderimi test edilir */
  kayitliSlug?: string | null;
}

export function FormOnizlemeSekme({ form, kayitliSlug }: FormOnizlemeSekmeProps) {
  const ayar = form.ayarlarJson;
  const slug = kayitliSlug ?? form.slug;

  return (
    <div className="space-y-4">
      <p className="ap-muted text-sm">
        Canlı önizleme — doldurup göndererek test edin. Görünüm:{' '}
        <strong>{GORUNUM_TIPLERI.find((g) => g.id === ayar.gorunumTipi)?.ad}</strong>
        {!slug.trim() && ' · Gerçek gönderim için formu kaydedin (slug gerekli).'}
      </p>

      <div className="ap-form-onizleme-cerceve py-6">
        <DinamikForm
          slug={slug}
          ad={form.ad}
          aciklama={form.aciklama}
          alanlar={form.alanlarJson}
          ayarlar={form.ayarlarJson}
          onizlemeModu={!slug.trim()}
        />
      </div>
    </div>
  );
}
