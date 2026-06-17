import { sayfaYolunuBul } from '@/data/bosSiteVerisi';
import { menuOgeleriOlustur } from '@/data/bosSiteVerisi';
import type { AdminSayfa } from '@/features/admin/sayfaApi';
import type { UstMenuOgesi, HeaderAyarlari } from '@/types/header';
import type { MenuOgesi, Sayfa, SayfaAcilisModu, SiteAyarlari } from '@/types/site';
import { blogAyarlariBirlestir } from '@/types/blog';
import { idKarsilastir, idString } from '@/utils/idKarsilastir';

export function yeniMenuId(): string {
  return crypto.randomUUID();
}

export function hariciLinkMi(link: string): boolean {
  const t = link.trim();
  return /^(https?:|mailto:|tel:)/i.test(t);
}

export function anchorLinkMi(link: string): boolean {
  return link.trim().startsWith('#');
}

export function menuLinkGecerliMi(link: string): boolean {
  const t = link.trim();
  if (!t) return false;
  if (hariciLinkMi(t) || anchorLinkMi(t)) return true;
  return t.startsWith('/');
}

export const SABIT_HIZLI_LINKLER: { ad: string; link: string }[] = [
  { ad: 'Ana Sayfa', link: '/' },
  { ad: 'Ürünler', link: '/urunler' },
  { ad: 'Blog', link: '/blog' },
  { ad: 'Hakkımızda', link: '/hakkimizda' },
  { ad: 'İletişim', link: '/iletisim' },
];

export function ustMenuOgeleriOlustur(ustMenu: UstMenuOgesi[], sayfalar: Sayfa[] = []): MenuOgesi[] {
  return [...ustMenu]
    .sort((a, b) => a.sira - b.sira)
    .map((o) => {
      const slug = linktenSlugCikar(o.link);
      const sayfa = slug ? sayfalar.find((s) => s.slug === slug) : undefined;
      const acilisModu: SayfaAcilisModu =
        sayfa?.acilisModu ?? (o.yeniSekme ? 'yeni_sekme' : 'normal');
      return {
        baslik: o.ad,
        yol: o.link,
        yeniSekme: acilisModu === 'yeni_sekme',
        acilisModu,
      };
    });
}

export function sayfaMenudenUstMenuAktar(sayfalar: AdminSayfa[]): UstMenuOgesi[] {
  return [...sayfalar]
    .filter((s) => s.menudeGoster && s.yayinda)
    .sort((a, b) => a.sira - b.sira)
    .map((s, i) => ({
      id: yeniMenuId(),
      ad: s.baslik,
      link: sayfaYolunuBul(s.slug),
      yeniSekme: s.acilisModu === 'yeni_sekme',
      sira: i,
      sayfaId: idString(s.id),
    }));
}

export function headerMenuOlustur(
  sayfalar: Sayfa[],
  headerAyarlari?: HeaderAyarlari | null,
  siteAyarlari?: SiteAyarlari | null
): MenuOgesi[] {
  const ust = headerAyarlari?.ustMenu;
  if (ust && ust.length > 0) {
    return ustMenuOgeleriOlustur(ust, sayfalar);
  }
  return menuOgeleriOlustur(sayfalar, blogAyarlariBirlestir(siteAyarlari));
}

export function ustMenuEsit(a: UstMenuOgesi[], b: UstMenuOgesi[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => idKarsilastir(x.id, y.id));
  const sb = [...b].sort((x, y) => idKarsilastir(x.id, y.id));
  return sa.every((o, i) => {
    const k = sb[i];
    return (
      o.ad === k.ad &&
      o.link === k.link &&
      o.yeniSekme === k.yeniSekme &&
      o.sira === k.sira &&
      o.sayfaId === k.sayfaId
    );
  });
}

export const PENDING_SAYFA_ON_EK = 'pending:';

export function pendingSayfaMi(id: string): boolean {
  return id.startsWith(PENDING_SAYFA_ON_EK);
}

export function linktenSlugCikar(link: string): string | null {
  const t = link.trim();
  if (anchorLinkMi(t) || hariciLinkMi(t)) return null;
  if (t === '/') return 'ana-sayfa';
  if (!t.startsWith('/')) return null;
  const path = t.replace(/^\//, '').replace(/\/$/, '');
  if (!path) return 'ana-sayfa';
  if (path.startsWith('sayfa/')) return path.slice(6).split('/')[0] || null;
  return path.split('/')[0] || null;
}

export function sayfaLinkiEslesiyor(sayfa: AdminSayfa, link: string): boolean {
  return sayfaYolunuBul(sayfa.slug) === link.trim();
}

export function ustMenuSayfaSenkronize(
  ustMenu: UstMenuOgesi[],
  sayfalar: AdminSayfa[],
  slugUretFn: (ad: string) => string
): { sayfalar: AdminSayfa[]; ustMenu: UstMenuOgesi[] } {
  let guncelSayfalar = [...sayfalar];
  const guncelUstMenu = ustMenu.map((oge) => ({ ...oge }));

  for (const oge of guncelUstMenu) {
    const slugFromLink = linktenSlugCikar(oge.link);
    if (!slugFromLink) continue;

    let sayfa =
      oge.sayfaId && !pendingSayfaMi(oge.sayfaId)
        ? guncelSayfalar.find((s) => s.id === oge.sayfaId)
        : undefined;

    if (!sayfa && oge.sayfaId && pendingSayfaMi(oge.sayfaId)) {
      sayfa = guncelSayfalar.find((s) => s.id === oge.sayfaId);
    }

    if (!sayfa) {
      sayfa = guncelSayfalar.find(
        (s) => sayfaLinkiEslesiyor(s, oge.link) || s.slug === slugFromLink
      );
    }

    if (sayfa) {
      guncelSayfalar = guncelSayfalar.map((s) =>
        s.id === sayfa!.id
          ? {
              ...s,
              baslik: oge.ad,
              menudeGoster: true,
              sira: oge.sira,
              yayinda: true,
            }
          : s
      );
      oge.sayfaId = sayfa.id;
    } else {
      const slug = slugFromLink || slugUretFn(oge.ad);
      const pendingId = `${PENDING_SAYFA_ON_EK}${oge.id}`;
      const mevcutPending = guncelSayfalar.find((s) => s.id === pendingId);
      if (mevcutPending) {
        guncelSayfalar = guncelSayfalar.map((s) =>
          s.id === pendingId
            ? { ...s, baslik: oge.ad, slug, menudeGoster: true, sira: oge.sira, yayinda: true }
            : s
        );
      } else {
        guncelSayfalar.push({
          id: pendingId,
          baslik: oge.ad,
          slug,
          icerik: `<p>${oge.ad}</p>`,
          yayinda: true,
          menudeGoster: true,
          sira: oge.sira,
          acilisModu: 'normal',
        });
      }
      oge.sayfaId = pendingId;
    }
  }

  return { sayfalar: guncelSayfalar, ustMenu: guncelUstMenu };
}

export function ustMenuSilinenSayfaGuncelle(
  silinen: UstMenuOgesi,
  sayfalar: AdminSayfa[]
): AdminSayfa[] {
  if (!silinen.sayfaId) return sayfalar;
  if (pendingSayfaMi(silinen.sayfaId)) {
    return sayfalar.filter((s) => s.id !== silinen.sayfaId);
  }
  return sayfalar.map((s) =>
    s.id === silinen.sayfaId ? { ...s, menudeGoster: false } : s
  );
}
