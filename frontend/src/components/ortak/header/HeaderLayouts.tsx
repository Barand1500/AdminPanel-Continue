import type { SiteAyarlari } from '@/types/site';
import type { MenuOgesi } from '@/types/site';
import type { Kategori } from '@/data/kategoriler';
import { KategoriMenu } from '../KategoriMenu';
import type { HeaderVeri } from './useHeaderVeri';
import { bolunmusMenu, headerTipSinifi } from './useHeaderVeri';
import {
  AramaAlani,
  CtaLink,
  DesktopMenu,
  HeaderGovde,
  IkinciMarka,
  IkonGrubu,
  KategoriAramaSatiri,
  MarkaAlani,
  MobilMenuPanel,
  UstBant,
} from './HeaderOrtakParcalar';

interface LayoutProps {
  veri: HeaderVeri;
  ayarlar?: SiteAyarlari | null;
}

/** 1 — Klasik: üst bant + logo sol + menü + alt kategori/arama */
export function HeaderKlasik({ veri, ayarlar }: LayoutProps) {
  return (
    <>
      <UstBant veri={veri} ayarlar={ayarlar} />
      <HeaderGovde veri={veri} className={headerTipSinifi('klasik')}>
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <MarkaAlani veri={veri} className="max-w-[min(100%,280px)] sm:max-w-xs" />
          <DesktopMenu veri={veri} />
          <IkonGrubu veri={veri} />
        </div>
        <KategoriAramaSatiri veri={veri} />
        <MobilMenuPanel veri={veri} />
      </HeaderGovde>
    </>
  );
}

/** 2 — Sade: tek satır, arama ikon */
export function HeaderSade({ veri }: LayoutProps) {
  return (
    <HeaderGovde veri={veri} className={`${headerTipSinifi('sade')} site-header--tek-satir`}>
      <div className="container-site flex h-14 items-center justify-between gap-4">
        <MarkaAlani veri={veri} className="max-w-[200px]" />
        <DesktopMenu veri={veri} className="mx-auto" />
        <div className="flex items-center gap-2">
          <AramaAlani veri={veri} />
          <IkonGrubu veri={veri} />
        </div>
      </div>
      <MobilMenuPanel veri={veri} />
    </HeaderGovde>
  );
}

/** 3 — Kompakt: düşük yükseklik, sıkışık tek satır */
export function HeaderKompakt({ veri }: LayoutProps) {
  const h = veri.tipEk.kompaktYukseklik ?? 40;
  return (
    <HeaderGovde veri={veri} className={`${headerTipSinifi('kompakt')} site-header--kompakt`} yukseklik={h}>
      <div className="container-site flex items-center justify-between gap-2" style={{ height: h }}>
        <MarkaAlani veri={veri} className="max-w-[140px] scale-90 origin-left" />
        <DesktopMenu veri={veri} className="gap-3 text-xs" />
        <div className="flex items-center gap-1">
          <AramaAlani veri={veri} />
          <IkonGrubu veri={veri} hamburger />
        </div>
      </div>
      <MobilMenuPanel veri={veri} />
    </HeaderGovde>
  );
}

/** 4 — Merkez logo: menü sol/sağ bölünmüş */
export function HeaderMerkezLogo({ veri, ayarlar }: LayoutProps) {
  const { sol, sag } = bolunmusMenu(veri.cevrilmisMenu, veri.tipEk.menuBolmeNoktasi ?? 50);
  return (
    <>
      <UstBant veri={veri} ayarlar={ayarlar} />
      <HeaderGovde veri={veri} className={`${headerTipSinifi('merkez-logo')} site-header--merkez`}>
        <div className="container-site grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4">
          <DesktopMenu veri={veri} ogeler={sol} className="justify-end" />
          <div className="flex flex-col items-center gap-1">
            <MarkaAlani veri={veri} className="max-w-[200px]" />
            <IkinciMarka
              url={veri.ikinciLogoUrl}
              metin={veri.tipEk.ikinciMarkaMetni}
              boyut={veri.header.logoBoyutu}
              anaRenk={veri.anaRenk}
              ikincilRenk={veri.ikincilRenk}
            />
          </div>
          <div className="flex items-center justify-end gap-4">
            <DesktopMenu veri={veri} ogeler={sag} />
            <IkonGrubu veri={veri} />
          </div>
        </div>
        <MobilMenuPanel veri={veri} />
      </HeaderGovde>
    </>
  );
}

/** 5 — Arama odaklı: büyük arama üstte */
export function HeaderAramaOdakli({ veri, ayarlar }: LayoutProps) {
  return (
    <>
      <UstBant veri={veri} ayarlar={ayarlar} sloganGoster={false} />
      <HeaderGovde veri={veri} className={`${headerTipSinifi('arama-odakli')} site-header--arama-ust`}>
        <div className="container-site space-y-3 py-3">
          <div className="flex items-center justify-between gap-4">
            <MarkaAlani veri={veri} className="max-w-[160px] shrink-0" />
            <div className="hidden flex-1 lg:block">
              <AramaAlani veri={{ ...veri, tipEk: { ...veri.tipEk, aramaGoster: true, aramaModu: 'tam' } }} genis />
            </div>
            <IkonGrubu veri={veri} />
          </div>
          <div className="lg:hidden">
            <AramaAlani veri={{ ...veri, tipEk: { ...veri.tipEk, aramaGoster: true, aramaModu: 'tam' } }} genis />
          </div>
          <DesktopMenu veri={veri} className="border-t pt-2 lg:flex" />
        </div>
        {veri.kategoriMenuGoster && (
          <KategoriAramaSatiri veri={veri} className="border-t-0 pt-0" />
        )}
        <MobilMenuPanel veri={veri} />
      </HeaderGovde>
    </>
  );
}

/** 6 — Modern SaaS: logo + nav + CTA */
export function HeaderModern({ veri }: LayoutProps) {
  return (
    <HeaderGovde veri={veri} className={`${headerTipSinifi('modern')} site-header--modern`}>
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <MarkaAlani veri={veri} className="max-w-[200px]" />
        <DesktopMenu veri={veri} className="flex-1 justify-center" />
        <div className="flex items-center gap-3">
          <CtaLink metin={veri.tipEk.ctaMetni} link={veri.tipEk.ctaLink} anaRenk={veri.anaRenk} />
          <IkonGrubu veri={veri} />
        </div>
      </div>
      <MobilMenuPanel veri={veri} />
    </HeaderGovde>
  );
}

/** 7 — Kurumsal: güçlü üst bant + resmi nav */
export function HeaderKurumsal({ veri, ayarlar }: LayoutProps) {
  return (
    <>
      <UstBant veri={veri} ayarlar={ayarlar} className="site-header-ust-bant--kurumsal" />
      <HeaderGovde veri={veri} className={`${headerTipSinifi('kurumsal')} site-header--kurumsal`}>
        <div className="container-site flex h-[4.25rem] items-center justify-between gap-4 border-b border-[var(--color-border)]">
          <MarkaAlani veri={veri} className="max-w-xs" />
          <DesktopMenu veri={veri} className="uppercase tracking-wide" />
          <IkonGrubu veri={veri} />
        </div>
        {veri.tipEk.destekMetni && (
          <div className="container-site border-b border-[var(--color-border)] py-2 text-center text-xs text-[var(--color-text-muted)]">
            {veri.tipEk.destekMetni}
          </div>
        )}
        <KategoriAramaSatiri veri={veri} />
        <MobilMenuPanel veri={veri} />
      </HeaderGovde>
    </>
  );
}

/** 8 — Mega menü: geniş kategori vurgusu */
export function HeaderMegaMenu({ veri, ayarlar }: LayoutProps) {
  return (
    <>
      <UstBant veri={veri} ayarlar={ayarlar} />
      <HeaderGovde veri={veri} className={`${headerTipSinifi('mega-menu')} site-header--mega`}>
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <MarkaAlani veri={veri} className="max-w-xs" />
          <DesktopMenu veri={veri} mega />
          <IkonGrubu veri={veri} />
        </div>
        <KategoriAramaSatiri veri={veri} mega />
        <MobilMenuPanel veri={veri} />
      </HeaderGovde>
    </>
  );
}

/** 9 — Şeffaf hero: scroll sonrası katı */
export function HeaderSeffafHero({ veri }: LayoutProps) {
  const seffaf = veri.seffafMod && veri.tipEk.seffafBaslangic;
  return (
    <HeaderGovde
      veri={veri}
      className={`${headerTipSinifi('seffaf-hero', veri.seffafMod)} site-header--seffaf ${seffaf ? 'is-seffaf' : 'is-kati'}`}
    >
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <MarkaAlani veri={veri} className="max-w-[200px]" gorunum={seffaf ? 'sadece-metin' : undefined} />
        <DesktopMenu veri={veri} className={seffaf ? 'text-white/90' : ''} />
        <div className="flex items-center gap-2">
          <AramaAlani veri={veri} />
          <IkonGrubu veri={veri} />
        </div>
      </div>
      <MobilMenuPanel veri={veri} />
    </HeaderGovde>
  );
}

/** 12 — Split: sol logo+kategori, sağ arama+ikon, menü orta satır */
export function HeaderSplit({ veri, ayarlar }: LayoutProps) {
  const { kategoriMenuGoster, cevrilmisKategoriler, kategoriBaslikMetni, kategori } = veri;
  return (
    <>
      <UstBant veri={veri} ayarlar={ayarlar} />
      <HeaderGovde veri={veri} className={`${headerTipSinifi('split')} site-header--split`}>
        <div className="container-site flex flex-wrap items-center gap-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <MarkaAlani veri={veri} className="max-w-[180px]" />
            <IkinciMarka
              url={veri.ikinciLogoUrl}
              metin={veri.tipEk.ikinciMarkaMetni}
              boyut={veri.header.logoBoyutu}
              anaRenk={veri.anaRenk}
              ikincilRenk={veri.ikincilRenk}
            />
            {kategoriMenuGoster && (
              <KategoriMenu
                baslikMetni={kategoriBaslikMetni}
                acilisModu={kategori.acilisModu}
                kategoriler={cevrilmisKategoriler}
              />
            )}
          </div>
          <div className="flex min-w-[240px] flex-1 items-center gap-2 sm:max-w-md lg:max-w-lg">
            <AramaAlani veri={veri} genis />
            <IkonGrubu veri={veri} />
          </div>
        </div>
        <div
          className="border-t py-2"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-elevated)' }}
        >
          <div className="container-site flex items-center justify-between gap-4">
            <DesktopMenu veri={veri} className="flex-1" />
          </div>
        </div>
        <MobilMenuPanel veri={veri} />
      </HeaderGovde>
    </>
  );
}

export function HeaderLayoutSec({
  tip,
  veri,
  ayarlar,
}: {
  tip: HeaderVeri['tip'];
  veri: HeaderVeri;
  ayarlar?: SiteAyarlari | null;
  menuOgeleri: MenuOgesi[];
  kategoriler?: Kategori[];
}) {
  switch (tip) {
    case 'sade':
      return <HeaderSade veri={veri} ayarlar={ayarlar} />;
    case 'kompakt':
      return <HeaderKompakt veri={veri} ayarlar={ayarlar} />;
    case 'merkez-logo':
      return <HeaderMerkezLogo veri={veri} ayarlar={ayarlar} />;
    case 'arama-odakli':
      return <HeaderAramaOdakli veri={veri} ayarlar={ayarlar} />;
    case 'modern':
      return <HeaderModern veri={veri} ayarlar={ayarlar} />;
    case 'kurumsal':
      return <HeaderKurumsal veri={veri} ayarlar={ayarlar} />;
    case 'mega-menu':
      return <HeaderMegaMenu veri={veri} ayarlar={ayarlar} />;
    case 'seffaf-hero':
      return <HeaderSeffafHero veri={veri} ayarlar={ayarlar} />;
    case 'split':
      return <HeaderSplit veri={veri} ayarlar={ayarlar} />;
    case 'klasik':
    default:
      return <HeaderKlasik veri={veri} ayarlar={ayarlar} />;
  }
}
