import type { SiteAyarlari } from '@/types/site';
import { footerTipiNormalize } from '@/data/footerTipleri';
import { footerSemaGridSinifi } from '@/types/footer';
import { FooterNavLink } from '@/components/ortak/FooterNavLink';
import { footerLinkIkonGoster } from '@/types/footer';
import type { FooterBirlesik, CevirFn } from './FooterOrtakParcalar';
import { SosyalMedyaIkonSatirlari } from '@/components/ortak/SosyalMedyaIkon';
import {
  FooterMarka,
  FooterKolonlar,
  FooterDekorGorsel,
  FooterPazaryeriBand,
  FooterGuvenBand,
  FooterTelifBand,
  FooterNewsletterCta,
  footerAnaIcerik,
  footerDuzLinkler,
} from './FooterOrtakParcalar';

interface FooterLayoutProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  footer: FooterBirlesik;
  cevir: CevirFn;
}

function FooterLayoutKlasik({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  const dekor = footer.gorselDekor;
  const dekorAktif =
    !!dekor?.aktif &&
    (!!dekor.gorselUrl?.trim() || (dekor.magazalar?.some((m) => m.aktif) ?? false));

  return (
    <>
      {dekorAktif && dekor!.konum === 'ust' && <FooterDekorGorsel footer={footer} cevir={cevir} />}
      {footerAnaIcerik({ siteAdi, ayarlar, footer, cevir })}
      <FooterPazaryeriBand footer={footer} cevir={cevir} />
      <FooterGuvenBand footer={footer} cevir={cevir} ayarlar={ayarlar} />
      {dekorAktif && dekor!.konum === 'alt' && <FooterDekorGorsel footer={footer} cevir={cevir} />}
      <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
    </>
  );
}

function FooterLayoutSade({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  const linkIkon = footerLinkIkonGoster(footer.linkIkon);
  const linkler = footerDuzLinkler(footer).slice(0, 8);

  return (
    <>
      <div className="container-site py-8">
        <div className="footer-sade-ust flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
          <FooterMarka siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} cevir={cevir} kompakt />
          {linkler.length > 0 && (
            <nav className="footer-sade-linkler flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
              {linkler.map((l) => (
                <FooterNavLink key={l.id} link={l} ikon={linkIkon} cevir={cevir} />
              ))}
            </nav>
          )}
        </div>
      </div>
      <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
    </>
  );
}

function FooterLayoutKompakt({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  const linkIkon = footerLinkIkonGoster(footer.linkIkon);
  const linkler = footerDuzLinkler(footer).slice(0, 6);
  const koyu = footer.tipEk?.kompaktKoyuTema !== false;

  return (
    <div className={`footer-kompakt-ic ${koyu ? 'footer-kompakt-koyu' : ''}`}>
      <div className="container-site flex flex-col items-center gap-3 py-4 sm:flex-row sm:justify-between">
        <FooterMarka siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} cevir={cevir} kompakt />
        {linkler.length > 0 && (
          <nav className="footer-kompakt-linkler flex flex-wrap justify-center gap-x-4 text-xs">
            {linkler.map((l) => (
              <FooterNavLink key={l.id} link={l} ikon={linkIkon} cevir={cevir} />
            ))}
          </nav>
        )}
      </div>
      <div className="container-site border-t border-white/10 py-2 text-center text-[10px] opacity-70">
        {ayarlar?.telifYazisi ??
          `© ${new Date().getFullYear()} ${siteAdi} — ${cevir('site.tumHaklariSaklidir', 'Tüm hakları saklıdır.')}`}
      </div>
    </div>
  );
}

function FooterLayoutMerkezi({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  return (
    <>
      {footerAnaIcerik({
        siteAdi,
        ayarlar,
        footer,
        cevir,
        semaOverride: footerSemaGridSinifi('merkezi'),
      })}
      <FooterPazaryeriBand footer={footer} cevir={cevir} />
      <FooterGuvenBand footer={footer} cevir={cevir} ayarlar={ayarlar} />
      <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
    </>
  );
}

function FooterLayoutMagaza({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  return (
    <>
      <FooterPazaryeriBand footer={footer} cevir={cevir} vurgulu />
      {footerAnaIcerik({ siteAdi, ayarlar, footer, cevir })}
      <FooterGuvenBand footer={footer} cevir={cevir} ayarlar={ayarlar} />
      <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
    </>
  );
}

function FooterLayoutNewsletter({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  return (
    <>
      <div className="container-site py-10">
        <div className="footer-sema-uc grid gap-8">
          <FooterMarka siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} cevir={cevir} />
          <div className="footer-kolonlar grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FooterKolonlar footer={footer} cevir={cevir} />
          </div>
        </div>
      </div>
      <FooterNewsletterCta footer={footer} />
      <FooterGuvenBand footer={footer} cevir={cevir} ayarlar={ayarlar} />
      <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
    </>
  );
}

function FooterLayoutKurumsal({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  const vurgu = footer.tipEk?.guvenVurgu !== false;
  return (
    <>
      {footerAnaIcerik({ siteAdi, ayarlar, footer, cevir })}
      <FooterGuvenBand footer={footer} cevir={cevir} ayarlar={ayarlar} vurgulu={vurgu} />
      <FooterPazaryeriBand footer={footer} cevir={cevir} />
      <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
    </>
  );
}

function FooterLayoutDetayli({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  const dekor = footer.gorselDekor;
  const dekorAktif =
    !!dekor?.aktif &&
    (!!dekor.gorselUrl?.trim() || (dekor.magazalar?.some((m) => m.aktif) ?? false));

  return (
    <>
      {dekorAktif && dekor!.konum === 'ust' && <FooterDekorGorsel footer={footer} cevir={cevir} />}
      {footerAnaIcerik({ siteAdi, ayarlar, footer, cevir })}
      <FooterPazaryeriBand footer={footer} cevir={cevir} vurgulu />
      <FooterGuvenBand footer={footer} cevir={cevir} ayarlar={ayarlar} vurgulu />
      {dekorAktif && dekor!.konum === 'alt' && <FooterDekorGorsel footer={footer} cevir={cevir} />}
      <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
    </>
  );
}

function FooterLayoutSplit({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  return (
    <>
      <div className="container-site py-8 lg:py-10">
        <div className="footer-split-ic">
          <div className="footer-split-marka">
            <FooterMarka siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} cevir={cevir} />
          </div>
          <div className="footer-split-kolonlar">
            <FooterKolonlar footer={footer} cevir={cevir} />
          </div>
        </div>
      </div>
      <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
    </>
  );
}

function FooterLayoutSplitVitrin({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  return (
    <>
      <div className="container-site py-10">
        <div className="footer-split-vitrin">
          <FooterMarka siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} cevir={cevir} />
          <div className="footer-kolonlar grid gap-8 sm:grid-cols-2">
            <FooterKolonlar footer={footer} cevir={cevir} />
          </div>
        </div>
      </div>
      <FooterPazaryeriBand footer={footer} cevir={cevir} vurgulu />
      <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
    </>
  );
}

function FooterLayoutCtaSerit({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  const ek = footer.tipEk;
  const baslik = ek?.ctaMetni?.trim() || 'Projenizi konuşalım';
  const alt = ek?.ctaAltMetin?.trim() || '';
  const buton = ek?.newsletterButon?.trim() || 'İletişime geç';
  const href = ek?.ctaLink?.trim() || '/iletisim';
  const linkIkon = footerLinkIkonGoster(footer.linkIkon);
  const linkler = footerDuzLinkler(footer).slice(0, 8);

  return (
    <>
      <div className="footer-cta-serit">
        <div className="container-site footer-cta-serit-ic">
          <div className="footer-cta-serit-metin">
            {alt ? <p className="footer-cta-serit-alt">{alt}</p> : null}
            <h3 className="footer-cta-serit-baslik">{baslik}</h3>
          </div>
          <FooterNavLink
            link={{ id: 'footer-cta', ad: buton, link: href, yeniSekme: false, aktif: true, sira: 0 }}
            ikon={null}
            className="footer-cta-serit-btn"
            cevir={cevir}
          />
        </div>
      </div>
      <div className="container-site py-6">
        <div className="footer-cta-alt flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <FooterMarka siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} cevir={cevir} kompakt />
          {linkler.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
              {linkler.map((l) => (
                <FooterNavLink key={l.id} link={l} ikon={linkIkon} cevir={cevir} />
              ))}
            </nav>
          )}
        </div>
      </div>
      <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
    </>
  );
}

function FooterLayoutYuzen({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  const linkIkon = footerLinkIkonGoster(footer.linkIkon);
  const linkler = footerDuzLinkler(footer).slice(0, 8);
  const koyu = footer.tipEk?.kompaktKoyuTema === true;

  return (
    <div className="footer-yuzen-dis">
      <div className={`footer-yuzen-kart${koyu ? ' footer-kompakt-koyu' : ''}`}>
        <div className="flex flex-col items-center gap-6 px-6 py-8 lg:flex-row lg:justify-between">
          <FooterMarka siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} cevir={cevir} kompakt />
          {linkler.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
              {linkler.map((l) => (
                <FooterNavLink key={l.id} link={l} ikon={linkIkon} cevir={cevir} />
              ))}
            </nav>
          )}
        </div>
        <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
      </div>
    </div>
  );
}

function FooterLayoutSosyalSahne({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  const sosyal = ayarlar?.sosyalMedyaJson ?? {};
  const markaFooter = {
    ...footer,
    marka: { ...footer.marka, sosyalGoster: false },
  };
  const linkIkon = footerLinkIkonGoster(footer.linkIkon);
  const linkler = footerDuzLinkler(footer).slice(0, 5);

  return (
    <>
      <div className="container-site footer-sosyal-sahne">
        <p className="footer-sosyal-sahne-etiket">{cevir('site.biziTakipEdin', 'Bizi takip edin')}</p>
        <SosyalMedyaIkonSatirlari sosyal={sosyal} ikonSinifi="h-11 w-11" className="footer-sosyal-sahne-ikonlar" />
        <FooterMarka siteAdi={siteAdi} ayarlar={ayarlar} footer={markaFooter} cevir={cevir} kompakt />
        {linkler.length > 0 && (
          <nav className="footer-sosyal-sahne-linkler">
            {linkler.map((l) => (
              <FooterNavLink key={l.id} link={l} ikon={linkIkon} cevir={cevir} />
            ))}
          </nav>
        )}
      </div>
      <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
    </>
  );
}

function FooterLayoutKartlar({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  return (
    <>
      <div className="container-site py-10">
        <div className="footer-kartlar-grid">
          <div className="footer-kart footer-kart--marka">
            <FooterMarka siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} cevir={cevir} />
          </div>
          <FooterKolonlar footer={footer} cevir={cevir} />
        </div>
      </div>
      <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
    </>
  );
}

function FooterLayoutMasthead({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  return (
    <>
      <div className="footer-masthead">
        <div className="container-site flex flex-col items-center gap-3 py-10 text-center">
          <FooterMarka siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} cevir={cevir} />
        </div>
      </div>
      <div className="container-site py-10">
        <div className="footer-kolonlar grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FooterKolonlar footer={footer} cevir={cevir} />
        </div>
      </div>
      <FooterGuvenBand footer={footer} cevir={cevir} ayarlar={ayarlar} />
      <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
    </>
  );
}

function FooterLayoutCamPanel({ siteAdi, ayarlar, footer, cevir }: FooterLayoutProps) {
  const koyu = footer.tipEk?.kompaktKoyuTema === true;
  return (
    <div className={`footer-cam-panel-ic${koyu ? ' footer-cam-panel-ic--koyu' : ''}`}>
      {footerAnaIcerik({ siteAdi, ayarlar, footer, cevir })}
      <FooterGuvenBand footer={footer} cevir={cevir} ayarlar={ayarlar} />
      <FooterTelifBand siteAdi={siteAdi} ayarlar={ayarlar} cevir={cevir} />
    </div>
  );
}

export function FooterLayoutSec(props: FooterLayoutProps) {
  const tip = footerTipiNormalize(props.footer.footerTipi);
  switch (tip) {
    case 'sade':
      return <FooterLayoutSade {...props} />;
    case 'kompakt':
      return <FooterLayoutKompakt {...props} />;
    case 'merkezi':
      return <FooterLayoutMerkezi {...props} />;
    case 'magaza':
      return <FooterLayoutMagaza {...props} />;
    case 'newsletter':
      return <FooterLayoutNewsletter {...props} />;
    case 'kurumsal':
      return <FooterLayoutKurumsal {...props} />;
    case 'detayli':
      return <FooterLayoutDetayli {...props} />;
    case 'split':
      return <FooterLayoutSplit {...props} />;
    case 'cta-serit':
      return <FooterLayoutCtaSerit {...props} />;
    case 'sosyal-sahne':
      return <FooterLayoutSosyalSahne {...props} />;
    case 'kartlar':
      return <FooterLayoutKartlar {...props} />;
    case 'split-vitrin':
      return <FooterLayoutSplitVitrin {...props} />;
    case 'yuzen':
      return <FooterLayoutYuzen {...props} />;
    case 'masthead':
      return <FooterLayoutMasthead {...props} />;
    case 'cam-panel':
      return <FooterLayoutCamPanel {...props} />;
    default:
      return <FooterLayoutKlasik {...props} />;
  }
}

export function footerTipSinifi(tip?: string | null): string {
  return `site-footer--${footerTipiNormalize(tip)}`;
}
