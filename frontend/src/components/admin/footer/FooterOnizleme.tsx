import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { SiteAyarlari } from '@/types/site';
import type { FooterAyarlari } from '@/types/footer';
import { footerTipiNormalize } from '@/data/footerTipleri';
import { footerTipDemoPaketi } from '@/data/footerTipDemoVerisi';
import { SiteFooter } from '@/components/ortak/SiteFooter';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import { siteOnizlemeCssStili } from '@/utils/siteOnizlemeStili';

interface FooterOnizlemeProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  footer: FooterAyarlari;
  buyuk?: boolean;
  /** Footer Tipi sekmesinde sahte örnek verilerle önizleme */
  demoMod?: boolean;
}

export function FooterOnizleme({
  siteAdi,
  ayarlar,
  footer,
  buyuk = false,
  demoMod = false,
}: FooterOnizlemeProps) {
  const tip = footerTipiNormalize(footer.footerTipi);
  const demo = footerTipDemoPaketi(tip);

  const onizlemeAyarlar = useMemo((): SiteAyarlari => {
    const temel: SiteAyarlari = {
      ...(ayarlar ?? {}),
      footerAyarlariJson: footer,
    };

    if (!demoMod) return temel;

    return {
      ...temel,
      anaRenk: demo.anaRenk,
      ikincilRenk: demo.ikincilRenk,
      adres: demo.adres || temel.adres,
      telefon: demo.telefon || temel.telefon,
      email: demo.email || temel.email,
      whatsapp: demo.whatsapp || temel.whatsapp,
      telifYazisi: demo.telifYazisi,
      sosyalMedyaJson: demo.sosyalMedya,
      footerAyarlariJson: {
        ...footer,
        kolonlar: demo.kolonlar,
        pazaryeri: {
          aktif: demo.pazaryeri.length > 0,
          ogeler: demo.pazaryeri,
        },
        guvenBandi: {
          ...footer.guvenBandi,
          aktif: demo.rozetler.length > 0,
          rozetler: demo.rozetler,
        },
        marka: {
          ...footer.marka,
          logoGoster: false,
          adresGoster: !!demo.adres,
          telefonGoster: !!demo.telefon,
          emailGoster: !!demo.email,
          whatsappGoster: !!demo.whatsapp,
          sosyalGoster: Object.keys(demo.sosyalMedya).length > 0,
        },
      },
    };
  }, [ayarlar, footer, demoMod, demo]);

  const gosterilecekSiteAdi = demoMod ? demo.siteAdi : siteAdi;

  const onizlemeStili = useMemo(() => {
    if (!demoMod) {
      return siteOnizlemeCssStili(ayarlar) as CSSProperties;
    }
    return siteOnizlemeCssStili({
      ...ayarlar,
      anaRenk: demo.anaRenk,
      ikincilRenk: demo.ikincilRenk,
    }) as CSSProperties;
  }, [demoMod, ayarlar, demo.anaRenk, demo.ikincilRenk]);

  return (
    <AdminPanelKarti
      baslik="Canlı Önizleme"
      altBaslik={
        demoMod
          ? `Örnek verilerle gösterim — ${demo.ornekNotu}. Kaydedince sitenizin gerçek içeriği görünür.`
          : 'Form değişiklikleri anında yansır — Kaydet ile public site güncellenir'
      }
    >
      {demoMod && (
        <div className="ap-onizleme-uyari mb-3">
          Bu önizleme sahte marka ve link verileri kullanır ({demo.siteAdi}). Gerçek logo, kolonlar ve iletişim bilgileriniz kayıttan sonra sitede görünür.
        </div>
      )}

      <div
        className={`site-public ap-scroll overflow-x-hidden rounded-xl border border-[var(--ap-border)] ${
          buyuk ? 'max-h-[min(70vh,720px)] overflow-y-auto' : 'max-h-[75vh] overflow-y-auto'
        }`}
        style={onizlemeStili}
      >
        <SiteFooter siteAdi={gosterilecekSiteAdi} ayarlar={onizlemeAyarlar} />
      </div>
    </AdminPanelKarti>
  );
}
