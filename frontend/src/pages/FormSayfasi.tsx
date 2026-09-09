import { useLocation, useOutletContext, useParams } from 'react-router-dom';
import { DinamikForm } from '@/components/ortak/form/DinamikForm';
import type { SitePublicData } from '@/types/site';

/** Form Yönetimi listesindeki /form/:slug adresinin public karşılığıdır. */
export function FormSayfasi() {
  const { slug = '' } = useParams();
  const { search } = useLocation();
  const { formlar = [] } = useOutletContext<SitePublicData>();
  const form = formlar.find((kayit) => kayit.aktif && kayit.slug === slug);
  const parametreler = new URLSearchParams(search);
  const paket = parametreler.get('paket')?.trim();
  const fiyat = parametreler.get('fiyat')?.trim();

  if (!form) {
    return (
      <section className="py-16 sm:py-24">
        <div className="container-site text-center">
          <p className="text-sm font-semibold text-primary">404</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Form bulunamadı</h1>
          <p className="mt-3 text-slate-600">Bu form yayında olmayabilir veya adresi değiştirilmiş olabilir.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="teklif-form-sayfasi">
      <div className="container-site">
        <div className="teklif-form-baslik">
          <p className="teklif-form-eyebrow">Teklif Talebi</p>
          <h1>Size uygun teklifi hazırlayalım</h1>
          <p>Bilgilerinizi bırakın; ekibimiz en kısa sürede sizinle iletişime geçsin.</p>
        </div>
        {paket && (
          <div className="teklif-form-paket-karti">
            <div>
              <p className="teklif-form-paket-etiket">Seçilen paket</p>
              <p className="teklif-form-paket-ad">{paket}</p>
            </div>
            {fiyat && <p className="teklif-form-paket-fiyat">{fiyat}</p>}
          </div>
        )}
        <div className="teklif-form-kapsayici">
          <div className="teklif-form-guven-notu">
            <span aria-hidden="true">✦</span>
            Bilgileriniz sadece teklifinizi hazırlamak için kullanılır.
          </div>
          <DinamikForm
            slug={form.slug}
            ad={form.ad}
            aciklama={form.aciklama ?? undefined}
            alanlar={form.alanlarJson}
            ayarlar={form.ayarlarJson}
            paketOzetiGoster={false}
            baslikGoster={false}
            basariBildirimSatirIci
          />
        </div>
      </div>
    </section>
  );
}
