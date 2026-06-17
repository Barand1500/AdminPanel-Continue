import { useEffect } from 'react';
import type { SiteAyarlari } from '@/types/site';

export function SiteKapaliEkrani({
  siteAdi,
  ayarlar,
  onizleme = false,
}: {
  siteAdi: string;
  ayarlar: SiteAyarlari | null;
  onizleme?: boolean;
}) {
  const anaRenk = ayarlar?.anaRenk ?? '#7c3aed';
  const ikincilRenk = ayarlar?.ikincilRenk ?? '#a78bfa';
  const logoUrl = ayarlar?.logoUrl;
  const email = ayarlar?.email;
  const telefon = ayarlar?.telefon;

  useEffect(() => {
    if (onizleme) return;
    const onceki = document.title;
    document.title = `Site Ulaşılamıyor — ${siteAdi}`;
    return () => {
      document.title = onceki;
    };
  }, [onizleme, siteAdi]);

  return (
    <div
      className={`site-kapali-ekrani relative flex items-center justify-center overflow-hidden bg-slate-950 ${
        onizleme ? 'min-h-[420px] rounded-xl' : 'min-h-screen px-4 py-10'
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at 20% 20%, ${anaRenk}22, transparent 45%), radial-gradient(circle at 80% 0%, ${ikincilRenk}33, transparent 40%), linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
      }}
    >
      <div
        className={`relative z-10 w-full text-center ${
          onizleme ? 'max-w-sm px-4 py-6' : 'max-w-lg rounded-3xl border border-white/10 bg-white/5 px-8 py-10 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto mb-5 flex items-center justify-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={siteAdi} className="h-12 w-auto object-contain opacity-60" />
          ) : (
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-lg opacity-80"
              style={{ background: `linear-gradient(135deg, ${anaRenk}, ${ikincilRenk})` }}
            >
              🌐
            </div>
          )}
        </div>

        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-red-200">
          Site Kapalı
        </div>

        <h1 className={`font-bold text-white ${onizleme ? 'text-lg' : 'text-2xl sm:text-3xl'}`}>
          Bu site ulaşılamıyor
        </h1>

        <p className={`mt-3 leading-relaxed text-slate-300 ${onizleme ? 'text-xs' : 'text-sm sm:text-base'}`}>
          {siteAdi} şu anda yayında değil. Lütfen daha sonra tekrar deneyin veya site yöneticisiyle iletişime geçin.
        </p>

        {(email || telefon) && !onizleme && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-slate-300">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">İletişim</p>
            {telefon && <p>📞 {telefon}</p>}
            {email && <p className={telefon ? 'mt-1' : ''}>✉️ {email}</p>}
          </div>
        )}

        <p className={`text-slate-500 ${onizleme ? 'mt-4 text-[10px]' : 'mt-6 text-xs'}`}>{siteAdi}</p>
      </div>
    </div>
  );
}
