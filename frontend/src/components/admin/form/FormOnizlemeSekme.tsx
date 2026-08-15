import { useEffect } from 'react';
import type { FormFormDegeri } from '@/features/admin/formApi';
import { DinamikForm } from '@/components/ortak/form/DinamikForm';
import { GORUNUM_TIPLERI } from '@/types/formYonetimi';

interface FormOnizlemeSekmeProps {
  form: FormFormDegeri;
  kayitliSlug?: string | null;
}

export function FormOnizlemeSekme({ form, kayitliSlug }: FormOnizlemeSekmeProps) {
  const ayar = form.ayarlarJson;
  const slug = kayitliSlug ?? form.slug;

  return (
    <div className="ap-form-oniz-icerik">
      <p className="ap-muted text-sm">
        Görünüm: {GORUNUM_TIPLERI.find((g) => g.id === ayar.gorunumTipi)?.ad}
        {!slug.trim() ? ' · Kaydetmeden gerçek gönderim yapılamaz' : ' · Doldurup test edebilirsiniz'}
      </p>
      <div className="ap-form-onizleme-cerceve">
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

export function FormOnizlemeModal({
  acik,
  form,
  kayitliSlug,
  onKapat,
}: {
  acik: boolean;
  form: FormFormDegeri;
  kayitliSlug?: string | null;
  onKapat: () => void;
}) {
  useEffect(() => {
    if (!acik) return;
    function tus(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onKapat();
      }
    }
    document.addEventListener('keydown', tus);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tus);
      document.body.style.overflow = '';
    };
  }, [acik, onKapat]);

  if (!acik) return null;

  return (
    <div className="ap-admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="form-onizleme-baslik">
      <button type="button" className="ap-admin-modal-backdrop" aria-label="Kapat" onClick={onKapat} />
      <div className="ap-admin-modal ap-admin-modal-genis ap-form-oniz-modal">
        <header className="ap-admin-modal-header">
          <div>
            <h2 id="form-onizleme-baslik" className="ap-admin-modal-baslik">
              Form önizleme
            </h2>
            <p className="ap-admin-modal-alt">{form.ad.trim() || 'Adsız form'}</p>
          </div>
          <button type="button" className="ap-admin-modal-kapat" onClick={onKapat}>
            ✕ ESC
          </button>
        </header>
        <div className="ap-form-oniz-govde">
          <FormOnizlemeSekme form={form} kayitliSlug={kayitliSlug} />
        </div>
      </div>
    </div>
  );
}
