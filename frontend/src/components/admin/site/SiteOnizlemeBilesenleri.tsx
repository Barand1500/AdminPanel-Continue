import { useState } from 'react';
import type { SiteAyarlari, MenuOgesi } from '@/types/site';
import type { HeaderAyarlari, ParaBirimiKaydi } from '@/types/header';
import { headerAyarlariBirlestir, headerMarkaMetni } from '@/types/header';
import { SiteMarkaAlani } from '@/components/ortak/SiteMarkaAlani';
import { headerLogoUrl } from '@/types/logo';
import { HeaderIkon } from '@/components/ortak/HeaderIkon';
import { SiteFooter } from '@/components/ortak/SiteFooter';
import { KategoriModuOnizleme } from './KategoriModuOnizleme';
import { SosyalMedyaIkonSatirlari } from '@/components/ortak/SosyalMedyaIkon';

interface SiteHeaderOnizlemeProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  headerAyarlari?: HeaderAyarlari | null;
  iletisim?: { telefon?: string | null; email?: string | null };
  menuOgeleri: MenuOgesi[];
}

function kurDegeri(k: ParaBirimiKaydi): string {
  if (k.kod === 'TRY') return '1,0000';
  const deger = k.guncelKur ?? k.manuelKur;
  if (deger == null) return '—';
  return deger.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function aramaSinifi(stil: 'yuvarlak' | 'kare' | 'minimal') {
  if (stil === 'kare') return 'input-search input-search-kare';
  if (stil === 'minimal') return 'input-search input-search-minimal';
  return 'input-search';
}

/** Admin onizleme — minimal, bozulmayan sabit sema */
export function SiteHeaderOnizleme({
  siteAdi,
  ayarlar,
  headerAyarlari: headerProp,
  iletisim,
  menuOgeleri: _menuOgeleri,
}: SiteHeaderOnizlemeProps) {
  const header = headerProp ?? headerAyarlariBirlestir(ayarlar);
  const ustBant = header.ustBant!;
  const ikonlar = header.ikonlar!;
  const kategori = header.kategori!;
  const arama = header.arama!;
  const telefon = iletisim?.telefon ?? ayarlar?.telefon;
  const email = iletisim?.email ?? ayarlar?.email;
  const kurlar = (header.kurlar ?? []).filter((k) => k.kod !== 'TRY').sort((a, b) => a.sira - b.sira);
  const [kategoriAcik, setKategoriAcik] = useState(false);
  const markaMetni = headerMarkaMetni(header, siteAdi);
  const logoUrl = headerProp ? header.logoUrl : headerLogoUrl(ayarlar);

  return (
    <div className="site-public min-w-0 p-2">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="bg-primary px-3 py-1.5 text-[10px] text-white">
          <p className="truncate opacity-95">{header.slogan}</p>
          {(ustBant.telefonGoster && telefon) ||
          (ustBant.emailGoster && email) ||
          ustBant.sosyalGoster ||
          (ustBant.kurlarGoster && kurlar.length > 0) ? (
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[9px]">
              {ustBant.telefonGoster && telefon && <span className="whitespace-nowrap">📞 {telefon}</span>}
              {ustBant.emailGoster && email && <span className="whitespace-nowrap">✉️ {email}</span>}
              {ustBant.sosyalGoster && ayarlar?.sosyalMedyaJson && (
                <SosyalMedyaIkonSatirlari sosyal={ayarlar.sosyalMedyaJson} ikonSinifi="h-4 w-4" />
              )}
              {ustBant.kurlarGoster &&
                kurlar.map((k, i) => (
                  <span key={k.id} className="whitespace-nowrap">
                    {i > 0 && <span className="mr-1 opacity-40">·</span>}
                    {k.sembol} {kurDegeri(k)}
                  </span>
                ))}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2">
          <div className="min-w-0 flex-1 overflow-hidden">
            <SiteMarkaAlani
              siteAdi={markaMetni}
              logoUrl={logoUrl ?? header.logoUrl}
              logoBoyutu={header.logoBoyutu}
              yer="header"
              anaRenk={ayarlar?.anaRenk}
              ikincilRenk={ayarlar?.ikincilRenk}
              className="max-w-full"
            />
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <HeaderIkon ikon={ikonlar.tema.gunduz} grup="gunduz" className="h-3.5 w-3.5" />
            <HeaderIkon ikon={ikonlar.tema.gece} grup="gece" className="h-3.5 w-3.5 opacity-60" />
            <HeaderIkon ikon={ikonlar.hesap} grup="hesap" className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="px-3 py-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setKategoriAcik((a) => !a)}
              className={`flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-semibold transition ${
                kategoriAcik
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-primary'
              }`}
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {kategori.baslikMetni}
              <svg
                className={`h-2.5 w-2.5 transition ${kategoriAcik ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="relative min-w-0 flex-1">
              <span className="absolute left-2.5 top-1/2 z-[1] -translate-y-1/2 text-primary">
                <HeaderIkon ikon={arama.ikon} grup="arama" className="h-3 w-3" />
              </span>
              <input
                type="search"
                readOnly
                placeholder={arama.placeholder}
                className={`${aramaSinifi(arama.stil)} !py-1.5 !pl-8 !pr-2 !text-[10px]`}
              />
            </div>
          </div>

          {kategoriAcik && (
            <KategoriModuOnizleme
              mod={kategori.acilisModu}
              baslik={kategori.baslikMetni}
              onKapat={() => setKategoriAcik(false)}
            />
          )}
        </div>

        {(telefon || email) && (
          <div className="border-t border-slate-100 px-3 py-1.5 text-[9px] text-slate-500">
            {telefon && <span className="mr-2">📞 {telefon}</span>}
            {email && <span>✉️ {email}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

interface SiteFooterOnizlemeProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
}

export function SiteFooterOnizleme({ siteAdi, ayarlar }: SiteFooterOnizlemeProps) {
  return <SiteFooter siteAdi={siteAdi} ayarlar={ayarlar} />;
}
