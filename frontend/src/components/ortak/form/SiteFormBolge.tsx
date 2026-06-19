import { useLocation } from 'react-router-dom';
import type { FormAyarlar } from '@/types/formYonetimi';
import type { PublicFormKayit } from '@/utils/formYardimci';
import { formKonumda, formSayfadaGoster, pathnameDenSayfaSlug } from '@/utils/formYardimci';
import { DinamikForm } from './DinamikForm';

interface SiteFormBolgeProps {
  formlar: PublicFormKayit[];
  konum: FormAyarlar['sayfaKonumu'];
  className?: string;
}

export function SiteFormBolge({ formlar, konum, className = '' }: SiteFormBolgeProps) {
  const { pathname } = useLocation();
  const sayfaSlug = pathnameDenSayfaSlug(pathname);

  const bolgeFormlari = formlar.filter(
    (f) => formSayfadaGoster(f, sayfaSlug) && formKonumda(f, konum)
  );

  if (bolgeFormlari.length === 0) return null;

  return (
    <div className={`site-form-bolge site-form-bolge-${konum} ${className}`}>
      <div className="container-site space-y-8 py-8">
        {bolgeFormlari.map((form) => (
          <DinamikForm
            key={form.id}
            slug={form.slug}
            ad={form.ad}
            aciklama={form.aciklama ?? undefined}
            alanlar={form.alanlarJson}
            ayarlar={form.ayarlarJson}
          />
        ))}
      </div>
    </div>
  );
}
