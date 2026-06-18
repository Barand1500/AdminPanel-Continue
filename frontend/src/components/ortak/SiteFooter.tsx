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
import { useSiteDil } from '@/contexts/SiteDilContext';
import { metinCevir } from '@/utils/menuYardimci';

interface SiteFooterProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
}

function kurDegeri(k: ParaBirimiKaydi): string {
  if (k.kod === 'TRY') return '1,0000';
  const deger = k.guncelKur ?? k.manuelKur;
  if (deger == null) return '—';
  return deger.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function FooterMarka({
  siteAdi,
  ayarlar,
  footer,
  cevir,
}: {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  footer: ReturnType<typeof footerAyarlariBirlestir>;
  cevir: (anahtar: string, varsayilan?: string) => string;
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

      {footer.marka.sosyalGoster && ayarlar?.sosyalMedyaJson && (
        <SosyalMedyaIkonSatirlari sosyal={ayarlar.sosyalMedyaJson} className="mt-5" />
      )}
    </div>
  );
}

function FooterKolonlar({
  footer,
  cevir,
}: {
  footer: ReturnType<typeof footerAyarlariBirlestir>;
  cevir: (anahtar: string, varsayilan?: string) => string;
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

export function SiteFooter({ siteAdi, ayarlar }: SiteFooterProps) {
  const { cevir } = useSiteDil();
  const header = headerAyarlariBirlestir(ayarlar);
  const footer = footerAyarlariBirlestir(ayarlar);
  const semaSinif = footerSemaGridSinifi(footer.sema);

  const kurlar = (header.kurlar ?? [])
    .filter((k) => k.kod !== 'TRY')
    .sort((a, b) => a.sira - b.sira);

  const pazaryeriOgeleri = footer.pazaryeri.ogeler.filter((o) => o.aktif);
  const rozetler = footer.guvenBandi.rozetler.filter((r) => r.aktif);
  const dekor = footer.gorselDekor;
  const magazalar = aktifMagazaBadgeleri(dekor?.magazalar);
  const dekorAktif =
    !!dekor?.aktif && (!!dekor.gorselUrl?.trim() || magazalar.length > 0);

  const gorselImg = dekor?.gorselUrl?.trim() ? (
    <img src={dekor.gorselUrl} alt="" className="footer-dekor-gorsel-img" />
  ) : null;

  const gorselLink = dekor?.link?.trim();
  const yeniSekme = dekor?.yeniSekme !== false;
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

  const dekorGorsel = dekorAktif ? (
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
  ) : null;

  const icerik = (
    <div className={`footer-icerik ${semaSinif}`}>
      <FooterMarka siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} cevir={cevir} />
      <div className="footer-kolonlar">
        <FooterKolonlar footer={footer} cevir={cevir} />
      </div>
    </div>
  );

  return (
    <footer className="site-footer mt-auto">
      {dekorAktif && dekor!.konum === 'ust' && dekorGorsel}
      {dekorAktif && (dekor!.konum === 'sol' || dekor!.konum === 'sag') ? (
        <div className={`container-site footer-dekor-yatay footer-dekor-yer-${dekor!.konum}`}>
          {dekor!.konum === 'sol' && dekorGorsel}
          {icerik}
          {dekor!.konum === 'sag' && dekorGorsel}
        </div>
      ) : (
        <div className="container-site">{icerik}</div>
      )}

      {footer.pazaryeri.aktif && pazaryeriOgeleri.length > 0 && (
        <div className="border-t border-primary/10 bg-white/50">
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
      )}

      {footer.guvenBandi.aktif && (rozetler.length > 0 || (footer.guvenBandi.kurlarGoster && kurlar.length > 0)) && (
        <div className="border-t border-primary/10">
          <div className="container-site flex flex-wrap items-center justify-center gap-4 py-5 text-xs text-slate-500">
            {rozetler.map((r) => (
              <span key={r.id} className="rounded-lg border border-primary/20 bg-white px-3 py-1.5">
                {r.ikon} {metinCevir(cevir, r.metin)}
              </span>
            ))}
            {footer.guvenBandi.kurlarGoster && kurlar.length > 0 && (
              <span className="rounded-lg border border-primary/20 bg-white px-3 py-1.5 font-mono">
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
      )}

      {dekorAktif && dekor!.konum === 'alt' && dekorGorsel}

      <div className="border-t border-primary/10 bg-white/80">
        <div className="container-site py-4 text-center text-xs text-slate-500">
          {ayarlar?.telifYazisi ??
            `© Telif Hakkı 2016 - ${new Date().getFullYear()} ${siteAdi} — ${cevir('site.tumHaklariSaklidir', 'Tüm hakları saklıdır.')}`}
        </div>
      </div>
    </footer>
  );
}
