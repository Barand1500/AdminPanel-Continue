import type { SiteAyarlari } from '@/types/site';
import type { ParaBirimiKaydi } from '@/types/header';
import { headerAyarlariBirlestir } from '@/types/header';
import {
  footerAyarlariBirlestir,
  footerLinkIkonGoster,
  footerSemaGridSinifi,
} from '@/types/footer';
import { FooterNavLink } from '@/components/ortak/FooterNavLink';
import { SosyalMedyaIkonSatirlari } from '@/components/ortak/SosyalMedyaIkon';
import { SiteMarkaAlani } from '@/components/ortak/SiteMarkaAlani';
import { siteLogoUrl } from '@/types/logo';
import { whatsappFormatla } from '@/utils/telefonFormat';
import { aktifMagazaBadgeleri, FooterMagazaBadgeGoster } from '@/components/ortak/FooterMagazaBadge';
import { metinCevir } from '@/utils/menuYardimci';

export function kurDegeri(k: ParaBirimiKaydi): string {
  if (k.kod === 'TRY') return '1,0000';
  const deger = k.guncelKur ?? k.manuelKur;
  if (deger == null) return '—';
  return deger.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

export type FooterBirlesik = ReturnType<typeof footerAyarlariBirlestir>;
export type CevirFn = (anahtar: string, varsayilan?: string) => string;

export function FooterMarka({
  siteAdi,
  ayarlar,
  footer,
  cevir,
  kompakt = false,
}: {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  footer: FooterBirlesik;
  cevir: CevirFn;
  kompakt?: boolean;
}) {
  const ikonlar = footer.marka.iletisimIkonlari;
  const banka = footer.marka.bankaLinki;
  const logoUrl = siteLogoUrl(ayarlar);

  return (
    <div className="footer-marka">
      <SiteMarkaAlani
        siteAdi={siteAdi}
        logoUrl={logoUrl}
        logoBoyutu={footer.marka.logoBoyutu}
        yer="footer"
        anaRenk={ayarlar?.anaRenk}
        ikincilRenk={ayarlar?.ikincilRenk}
        gorunum={footer.marka.logoGoster ? 'sadece-logo' : 'sadece-metin'}
      />

      {!kompakt && (
        <ul className="mt-5 space-y-3 text-sm" style={{ color: 'var(--color-footer-text)' }}>
          {footer.marka.adresGoster && ayarlar?.adres && (
            <li className="flex gap-2">
              <span className="text-primary">{ikonlar.adres}</span>
              <span>{ayarlar.adres}</span>
            </li>
          )}
          {footer.marka.emailGoster && ayarlar?.email && (
            <li>
              <a href={`mailto:${ayarlar.email}`} className="site-footer-link flex gap-2">
                <span className="text-primary">{ikonlar.email}</span>
                {ayarlar.email}
              </a>
            </li>
          )}
          {footer.marka.telefonGoster && ayarlar?.telefon && (
            <li>
              <a href={`tel:${ayarlar.telefon.replace(/\s/g, '')}`} className="site-footer-link flex gap-2">
                <span className="text-primary">{ikonlar.telefon}</span>
                {ayarlar.telefon}
              </a>
            </li>
          )}
          {footer.marka.whatsappGoster && ayarlar?.whatsapp && (
            <li>
              <a
                href={`https://wa.me/${ayarlar.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="site-footer-link flex gap-2"
              >
                <span className="text-green-600">{ikonlar.whatsapp}</span>
                {whatsappFormatla(ayarlar.whatsapp)}
              </a>
            </li>
          )}
          {banka.aktif && banka.ad && (
            <li>
              {banka.link ? (
                <FooterNavLink
                  link={{ id: 'banka', ad: banka.ad, link: banka.link, yeniSekme: false, aktif: true, sira: 0 }}
                  ikon={banka.ikon}
                  className="site-footer-link flex gap-2"
                  cevir={cevir}
                />
              ) : (
                <span className="flex gap-2">
                  <span className="text-primary">{banka.ikon}</span>
                  {metinCevir(cevir, banka.ad)}
                </span>
              )}
            </li>
          )}
        </ul>
      )}

      {footer.marka.sosyalGoster && ayarlar?.sosyalMedyaJson && (
        <SosyalMedyaIkonSatirlari sosyal={ayarlar.sosyalMedyaJson} className={kompakt ? '' : 'mt-5'} />
      )}
    </div>
  );
}

export function FooterKolonlar({
  footer,
  cevir,
}: {
  footer: FooterBirlesik;
  cevir: CevirFn;
}) {
  const linkIkon = footerLinkIkonGoster(footer.linkIkon);
  const aktifKolonlar = footer.kolonlar.filter((k) => k.aktif);

  return (
    <>
      {aktifKolonlar.map((kolon) => {
        const linkler = [...kolon.linkler]
          .filter((l) => l.aktif !== false)
          .sort((a, b) => a.sira - b.sira);
        return (
          <div key={kolon.id} className="footer-kolon">
            <h4 className="site-footer-baslik">{metinCevir(cevir, kolon.baslik)}</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {linkler.map((l) => (
                <li key={l.id}>
                  <FooterNavLink link={l} ikon={linkIkon} cevir={cevir} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}

export function footerDuzLinkler(footer: FooterBirlesik) {
  return footer.kolonlar
    .filter((k) => k.aktif)
    .flatMap((k) =>
      [...k.linkler]
        .filter((l) => l.aktif !== false)
        .sort((a, b) => a.sira - b.sira)
    );
}

export function FooterDekorGorsel({
  footer,
  cevir,
}: {
  footer: FooterBirlesik;
  cevir: CevirFn;
}) {
  const dekor = footer.gorselDekor;
  const magazalar = aktifMagazaBadgeleri(dekor?.magazalar);
  const dekorAktif =
    !!dekor?.aktif && (!!dekor.gorselUrl?.trim() || magazalar.length > 0);

  if (!dekorAktif) return null;

  const gorselImg = dekor!.gorselUrl?.trim() ? (
    <img src={dekor!.gorselUrl} alt="" className="footer-dekor-gorsel-img" />
  ) : null;

  const gorselLink = dekor!.link?.trim();
  const yeniSekme = dekor!.yeniSekme !== false;
  const gorselIcerik =
    gorselImg &&
    (gorselLink ? (
      <a
        href={gorselLink}
        target={yeniSekme ? '_blank' : undefined}
        rel={yeniSekme ? 'noreferrer' : undefined}
        className="footer-dekor-gorsel-link"
      >
        {gorselImg}
      </a>
    ) : (
      gorselImg
    ));

  return (
    <div className={`footer-dekor-gorsel footer-dekor-gorsel-${dekor!.konum}`}>
      {gorselIcerik}
      {magazalar.length > 0 && (
        <div className="footer-magaza-badgeler">
          {magazalar.map((badge) => (
            <a
              key={badge.tip}
              href={badge.url.trim()}
              target="_blank"
              rel="noreferrer"
              className="footer-magaza-badge-link"
              title={badge.tip === 'appstore' ? cevir('site.appStore', 'App Store') : cevir('site.googlePlay', 'Google Play')}
            >
              <FooterMagazaBadgeGoster badge={badge} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function FooterPazaryeriBand({
  footer,
  cevir,
  vurgulu = false,
}: {
  footer: FooterBirlesik;
  cevir: CevirFn;
  vurgulu?: boolean;
}) {
  const pazaryeriOgeleri = footer.pazaryeri.ogeler.filter((o) => o.aktif);
  if (!footer.pazaryeri.aktif || pazaryeriOgeleri.length === 0) return null;

  return (
    <div className={`footer-pazaryeri-band ${vurgulu ? 'footer-pazaryeri-vurgulu' : ''}`}>
      <div className="container-site flex flex-wrap items-center justify-center gap-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
        {pazaryeriOgeleri.map((oge) =>
          oge.link ? (
            <a key={oge.id} href={oge.link} className="hover:text-primary" target="_blank" rel="noreferrer">
              {metinCevir(cevir, oge.ad)}
            </a>
          ) : (
            <span key={oge.id} className="hover:text-primary">
              {metinCevir(cevir, oge.ad)}
            </span>
          )
        )}
      </div>
    </div>
  );
}

export function FooterGuvenBand({
  footer,
  cevir,
  ayarlar,
  vurgulu = false,
}: {
  footer: FooterBirlesik;
  cevir: CevirFn;
  ayarlar?: SiteAyarlari | null;
  vurgulu?: boolean;
}) {
  const header = headerAyarlariBirlestir(ayarlar);
  const kurlar = (header.kurlar ?? [])
    .filter((k) => k.kod !== 'TRY')
    .sort((a, b) => a.sira - b.sira);
  const rozetler = footer.guvenBandi.rozetler.filter((r) => r.aktif);

  if (
    !footer.guvenBandi.aktif ||
    (rozetler.length === 0 && !(footer.guvenBandi.kurlarGoster && kurlar.length > 0))
  ) {
    return null;
  }

  return (
    <div className={`footer-guven-band ${vurgulu ? 'footer-guven-vurgu' : ''}`}>
      <div className="container-site flex flex-wrap items-center justify-center gap-4 py-5 text-xs text-slate-500">
        {rozetler.map((r) => (
          <span key={r.id} className="footer-guven-rozet">
            {r.ikon} {metinCevir(cevir, r.metin)}
          </span>
        ))}
        {footer.guvenBandi.kurlarGoster && kurlar.length > 0 && (
          <span className="footer-guven-rozet font-mono">
            {kurlar.map((k, i) => (
              <span key={k.id}>
                {i > 0 && ' · '}
                {k.sembol} {kurDegeri(k)}
              </span>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

export function FooterTelifBand({
  siteAdi,
  ayarlar,
  cevir,
}: {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  cevir: CevirFn;
}) {
  return (
    <div className="footer-telif-band">
      <div className="container-site py-4 text-center text-xs text-slate-500">
        {ayarlar?.telifYazisi ??
          `© Telif Hakkı 2016 - ${new Date().getFullYear()} ${siteAdi} — ${cevir('site.tumHaklariSaklidir', 'Tüm hakları saklıdır.')}`}
      </div>
    </div>
  );
}

export function FooterNewsletterCta({
  footer,
}: {
  footer: FooterBirlesik;
}) {
  const tipEk = footer.tipEk;
  return (
    <div className="footer-newsletter-cta">
      <div className="container-site flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">{tipEk?.newsletterBaslik ?? 'Bültenimize katılın'}</p>
          <p className="mt-1 text-xs opacity-80">Kampanya ve yeniliklerden haberdar olun</p>
        </div>
        <div className="flex w-full max-w-md gap-2">
          <input
            type="email"
            readOnly
            placeholder={tipEk?.newsletterPlaceholder ?? 'E-posta adresiniz'}
            className="footer-newsletter-input min-w-0 flex-1 rounded-lg border border-primary/20 bg-white/80 px-3 py-2 text-sm"
          />
          <span className="footer-newsletter-btn shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
            {tipEk?.newsletterButon ?? 'Abone ol'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function footerAnaIcerik({
  siteAdi,
  ayarlar,
  footer,
  cevir,
  semaOverride,
}: {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  footer: FooterBirlesik;
  cevir: CevirFn;
  semaOverride?: string;
}) {
  const sema = semaOverride ?? footerSemaGridSinifi(footer.sema);
  const dekor = footer.gorselDekor;
  const dekorAktif =
    !!dekor?.aktif &&
    (!!dekor.gorselUrl?.trim() || aktifMagazaBadgeleri(dekor?.magazalar).length > 0);

  const icerik = (
    <div className={`footer-icerik ${sema}`}>
      <FooterMarka siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} cevir={cevir} />
      <div className="footer-kolonlar">
        <FooterKolonlar footer={footer} cevir={cevir} />
      </div>
    </div>
  );

  if (dekorAktif && (dekor!.konum === 'sol' || dekor!.konum === 'sag')) {
    return (
      <div className={`container-site footer-dekor-yatay footer-dekor-yer-${dekor!.konum}`}>
        {dekor!.konum === 'sol' && <FooterDekorGorsel footer={footer} cevir={cevir} />}
        {icerik}
        {dekor!.konum === 'sag' && <FooterDekorGorsel footer={footer} cevir={cevir} />}
      </div>
    );
  }

  return <div className="container-site">{icerik}</div>;
}
