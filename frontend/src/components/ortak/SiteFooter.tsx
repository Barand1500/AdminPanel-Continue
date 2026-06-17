import type { SiteAyarlari } from '@/types/site';
import type { ParaBirimiKaydi } from '@/types/header';
import { headerAyarlariBirlestir } from '@/types/header';
import {
  footerAyarlariBirlestir,
  footerLinkIkonGoster,
  footerSemaGridSinifi,
} from '@/types/footer';
import { FooterNavLink } from '@/components/ortak/FooterNavLink';
import {
  SosyalMedyaIkonGoster,
  platformIkonDegeri,
  sosyalMedyaLinkleri,
} from '@/components/ortak/SosyalMedyaIkon';
import { SiteMarkaAlani } from '@/components/ortak/SiteMarkaAlani';
import { siteLogoUrl } from '@/types/logo';
import { whatsappFormatla } from '@/utils/telefonFormat';

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
}: {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  footer: ReturnType<typeof footerAyarlariBirlestir>;
}) {
  const ikonlar = footer.marka.iletisimIkonlari;
  const banka = footer.marka.bankaLinki;
  const logoUrl = siteLogoUrl(ayarlar);

  return (
    <div className="footer-marka">
      {footer.marka.logoGoster && (
        <SiteMarkaAlani
          siteAdi={siteAdi}
          logoUrl={logoUrl}
          logoBoyutu={footer.marka.logoBoyutu}
          yer="footer"
          anaRenk={ayarlar?.anaRenk}
          ikincilRenk={ayarlar?.ikincilRenk}
        />
      )}

      <ul className="mt-5 space-y-3 text-sm" style={{ color: 'var(--color-footer-text)' }}>
        {ayarlar?.adres && (
          <li className="flex gap-2">
            <span className="text-primary">{ikonlar.adres}</span>
            <span>{ayarlar.adres}</span>
          </li>
        )}
        {ayarlar?.email && (
          <li>
            <a href={`mailto:${ayarlar.email}`} className="site-footer-link flex gap-2">
              <span className="text-primary">{ikonlar.email}</span>
              {ayarlar.email}
            </a>
          </li>
        )}
        {ayarlar?.telefon && (
          <li>
            <a href={`tel:${ayarlar.telefon.replace(/\s/g, '')}`} className="site-footer-link flex gap-2">
              <span className="text-primary">{ikonlar.telefon}</span>
              {ayarlar.telefon}
            </a>
          </li>
        )}
        {ayarlar?.whatsapp && (
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
              />
            ) : (
              <span className="flex gap-2">
                <span className="text-primary">{banka.ikon}</span>
                {banka.ad}
              </span>
            )}
          </li>
        )}
      </ul>

      {footer.marka.sosyalGoster && ayarlar?.sosyalMedyaJson && sosyalMedyaLinkleri(ayarlar.sosyalMedyaJson).length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2.5">
          {sosyalMedyaLinkleri(ayarlar.sosyalMedyaJson).map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition hover:scale-105 hover:bg-primary/20"
              title={platform}
            >
              <SosyalMedyaIkonGoster
                platform={platform}
                ikonDeger={platformIkonDegeri(ayarlar.sosyalMedyaJson!, platform)}
                className="h-5 w-5"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function FooterKolonlar({
  footer,
}: {
  footer: ReturnType<typeof footerAyarlariBirlestir>;
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
            <h4 className="site-footer-baslik">{kolon.baslik}</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {linkler.map((l) => (
                <li key={l.id}>
                  <FooterNavLink link={l} ikon={linkIkon} />
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
  const header = headerAyarlariBirlestir(ayarlar);
  const footer = footerAyarlariBirlestir(ayarlar);
  const semaSinif = footerSemaGridSinifi(footer.sema);

  const kurlar = (header.kurlar ?? [])
    .filter((k) => k.kod !== 'TRY')
    .sort((a, b) => a.sira - b.sira);

  const pazaryeriOgeleri = footer.pazaryeri.ogeler.filter((o) => o.aktif);
  const rozetler = footer.guvenBandi.rozetler.filter((r) => r.aktif);

  return (
    <footer className="site-footer mt-auto">
      <div className={`container-site footer-icerik ${semaSinif}`}>
        <FooterMarka siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} />
        <div className="footer-kolonlar">
          <FooterKolonlar footer={footer} />
        </div>
      </div>

      {footer.pazaryeri.aktif && pazaryeriOgeleri.length > 0 && (
        <div className="border-t border-primary/10 bg-white/50">
          <div className="container-site flex flex-wrap items-center justify-center gap-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
            {pazaryeriOgeleri.map((oge) =>
              oge.link ? (
                <a key={oge.id} href={oge.link} className="hover:text-primary" target="_blank" rel="noreferrer">
                  {oge.ad}
                </a>
              ) : (
                <span key={oge.id} className="hover:text-primary">
                  {oge.ad}
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
                {r.ikon} {r.metin}
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

      <div className="border-t border-primary/10 bg-white/80">
        <div className="container-site py-4 text-center text-xs text-slate-500">
          {ayarlar?.telifYazisi ?? `© Telif Hakkı 2016 - ${new Date().getFullYear()} ${siteAdi} — Tüm hakları saklıdır.`}
        </div>
      </div>
    </footer>
  );
}
