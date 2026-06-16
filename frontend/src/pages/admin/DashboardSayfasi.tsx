import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { AdminSiteOnizleLink } from '@/components/admin/AdminHeader';
import { HizliErisimAyarlariModal } from '@/components/admin/ortak/HizliErisimAyarlariModal';
import { YukleniyorDurumu } from '@/components/admin/ortak/AdminBilesenleri';
import { dashboardOzetGetir, type DashboardOzet } from '@/features/admin/dashboardApi';
import { hizliErisimModulleri } from '@/utils/dashboardTercihleri';

interface DashboardSayfasiProps {
  onModulAc: (modulId: string) => void;
}

function tarihKisa(iso: string) {
  try {
    return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' }).format(new Date(iso));
  } catch {
    return '';
  }
}

function DonutGrafik({
  yuzde,
  renk,
  etiket,
  alt,
}: {
  yuzde: number;
  renk: string;
  etiket: string;
  alt?: string;
}) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, yuzde));
  const offset = c - (pct / 100) * c;

  return (
    <div className="ap-dash-mini-kart">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <svg viewBox="0 0 96 96" className="h-[5.5rem] w-[5.5rem] -rotate-90">
            <circle cx="48" cy="48" r={r} fill="none" stroke="var(--ap-border)" strokeWidth="9" opacity="0.45" />
            <circle
              cx="48"
              cy="48"
              r={r}
              fill="none"
              stroke={renk}
              strokeWidth="9"
              strokeDasharray={c}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <span className="ap-heading absolute inset-0 flex items-center justify-center text-sm font-bold">
            {pct.toFixed(0)}%
          </span>
        </div>
        <div className="min-w-0">
          <p className="ap-heading text-sm font-semibold">{etiket}</p>
          {alt && <p className="ap-muted mt-0.5 text-xs">{alt}</p>}
        </div>
      </div>
    </div>
  );
}

function BarGrafik({
  veriler,
}: {
  veriler: { etiket: string; deger: number; renk: string }[];
}) {
  const max = Math.max(...veriler.map((v) => v.deger), 1);

  return (
    <div className="ap-dash-bar-grafik">
      <div className="flex h-44 items-end justify-between gap-2 sm:gap-3">
        {veriler.map((v) => (
          <div key={v.etiket} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <span className="ap-muted text-[10px] font-medium sm:text-xs">{v.deger}</span>
            <div className="flex w-full flex-1 items-end">
              <div
                className="ap-dash-bar w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${Math.max(8, (v.deger / max) * 100)}%`,
                  background: `linear-gradient(180deg, ${v.renk}, color-mix(in srgb, ${v.renk} 65%, transparent))`,
                }}
              />
            </div>
            <span className="ap-muted w-full truncate text-center text-[10px] sm:text-xs">{v.etiket}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IstatistikHucresi({
  ikon,
  renk,
  deger,
  etiket,
  alt,
}: {
  ikon: string;
  renk: string;
  deger: number | string;
  etiket: string;
  alt?: string;
}) {
  return (
    <div className="ap-dash-stat-hucresi">
      <div className="ap-dash-stat-ikon" style={{ background: `color-mix(in srgb, ${renk} 14%, transparent)`, color: renk }}>
        {ikon}
      </div>
      <div className="min-w-0">
        <p className="ap-heading text-lg font-bold leading-tight sm:text-xl">{deger}</p>
        <p className="ap-muted text-xs">{etiket}</p>
        {alt && <p className="ap-muted mt-0.5 text-[10px] opacity-80">{alt}</p>}
      </div>
    </div>
  );
}

export function DashboardSayfasi({ onModulAc }: DashboardSayfasiProps) {
  const { kullanici } = useAuth();
  const { siteAd } = useSiteAyarlariYonetimi();
  const [ozet, setOzet] = useState<DashboardOzet | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const [hizliErisimAcik, setHizliErisimAcik] = useState(false);

  useModulAksiyonlari(
    { onizle: () => window.open('/', '_blank') },
    { onizle: true }
  );

  const hizliModuller = useMemo(
    () => hizliErisimModulleri(kullanici?.tercihler?.dashboardHizliErisim),
    [kullanici?.tercihler?.dashboardHizliErisim]
  );

  useEffect(() => {
    void (async () => {
      try {
        setOzet(await dashboardOzetGetir());
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Dashboard yüklenemedi');
      } finally {
        setYukleniyor(false);
      }
    })();
  }, []);

  const s = ozet?.istatistikler;

  const hesap = useMemo(() => {
    if (!s) return null;
    const toplamIcerik = s.sayfaSayisi + s.blogSayisi + s.formSayisi + s.medyaSayisi;
    const yayinlanabilir = s.sayfaSayisi + s.blogSayisi;
    const yayindaToplam = s.yayindaSayfa + s.yayindaBlog;
    const yayinOrani = yayinlanabilir > 0 ? (yayindaToplam / yayinlanabilir) * 100 : 0;
    const okunmamisOrani = s.gonderimSayisi > 0 ? (s.okunmamisGonderim / s.gonderimSayisi) * 100 : 0;
    const taslakSayfa = s.sayfaSayisi - s.yayindaSayfa;
    const taslakBlog = s.blogSayisi - s.yayindaBlog;

    return { toplamIcerik, yayinOrani, okunmamisOrani, yayindaToplam, taslakSayfa, taslakBlog };
  }, [s]);

  const ad = kullanici?.ad?.split(' ')[0] ?? 'Admin';

  if (yukleniyor) {
    return <YukleniyorDurumu mesaj="Dashboard yükleniyor..." />;
  }

  return (
    <div className="ap-dash">
      <header className="ap-dash-header">
        <div>
          <p className="ap-muted text-sm">Anasayfa</p>
          <h1 className="ap-heading mt-0.5 text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <AdminSiteOnizleLink />
      </header>

      {hata && <p className="ap-dash-hata mb-4 text-sm">{hata}</p>}

      {s && hesap && (
        <div className="ap-dash-icerik">
          {/* Genel Bakış */}
          <section>
            <h2 className="ap-dash-bolum-baslik">Genel Bakış</h2>
            <div className="ap-dash-genel-grid">
              <div className="ap-dash-hosgeldin">
                <div className="relative z-[1] max-w-[16rem]">
                  <p className="text-sm font-medium text-violet-200/90">Hoş geldiniz</p>
                  <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    Tebrikler {ad}! <span aria-hidden>🎉</span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-violet-100/80">
                    <strong className="font-semibold text-white">{siteAd || 'Siteniz'}</strong> için toplam{' '}
                    <strong className="text-white">{hesap.toplamIcerik}</strong> içerik kaydı yönetiliyor.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button type="button" onClick={() => onModulAc('sayfalar')} className="ap-dash-btn-birincil">
                      Sayfalar
                    </button>
                    <button type="button" onClick={() => onModulAc('blog')} className="ap-dash-btn-ikincil">
                      Blog
                    </button>
                  </div>
                </div>
                <div className="ap-dash-hosgeldin-dekor" aria-hidden>
                  <div className="ap-dash-avatar">
                    <span>{ad.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="ap-dash-stat-panel">
                <IstatistikHucresi ikon="📄" renk="#8b5cf6" deger={s.sayfaSayisi} etiket="Sayfa" alt={`${s.yayindaSayfa} yayında`} />
                <IstatistikHucresi ikon="📰" renk="#06b6d4" deger={s.blogSayisi} etiket="Blog" alt={`${s.yayindaBlog} yayında`} />
                <IstatistikHucresi
                  ikon="📝"
                  renk="#22c55e"
                  deger={s.gonderimSayisi}
                  etiket="Form Gönderimi"
                  alt={s.okunmamisGonderim > 0 ? `${s.okunmamisGonderim} yeni` : 'Tümü okundu'}
                />
              </div>
            </div>
          </section>

          {/* İçerik Özeti */}
          <section className="mt-8">
            <h2 className="ap-dash-bolum-baslik">İçerik Özeti</h2>
            <div className="ap-dash-ozet-grid">
              <div className="ap-dash-kart ap-dash-kart-buyuk">
                <div className="ap-dash-kart-ust">
                  <div>
                    <h3 className="ap-heading text-base font-semibold">İçerik Dağılımı</h3>
                    <p className="ap-muted mt-0.5 text-xs">Sayfa, blog, form ve medya</p>
                  </div>
                  <div className="ap-dash-legend">
                    <span><i style={{ background: '#8b5cf6' }} />Sayfa</span>
                    <span><i style={{ background: '#06b6d4' }} />Blog</span>
                  </div>
                </div>
                <BarGrafik
                  veriler={[
                    { etiket: 'Sayfa', deger: s.sayfaSayisi, renk: '#8b5cf6' },
                    { etiket: 'Blog', deger: s.blogSayisi, renk: '#06b6d4' },
                    { etiket: 'Form', deger: s.formSayisi, renk: '#f59e0b' },
                    { etiket: 'Medya', deger: s.medyaSayisi, renk: '#3b82f6' },
                  ]}
                />
              </div>

              <div className="ap-dash-yan-kolon">
                <DonutGrafik
                  yuzde={hesap.yayinOrani}
                  renk="#8b5cf6"
                  etiket="Yayın Oranı"
                  alt={`${hesap.yayindaToplam} yayında içerik`}
                />
                <DonutGrafik
                  yuzde={hesap.okunmamisOrani}
                  renk="#f43f5e"
                  etiket="Okunmamış Form"
                  alt={`${s.okunmamisGonderim} / ${s.gonderimSayisi} gönderim`}
                />
                <div className="ap-dash-mini-kart">
                  <p className="ap-heading text-sm font-semibold">Yayın Durumu</p>
                  <p className="ap-muted mt-0.5 text-xs">Sayfa ve blog karşılaştırması</p>
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="ap-muted">Yayında</span>
                        <span className="ap-heading font-semibold">{hesap.yayindaToplam}</span>
                      </div>
                      <div className="ap-dash-progress">
                        <div
                          className="ap-dash-progress-dolgu"
                          style={{
                            width: `${hesap.yayinOrani}%`,
                            background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="ap-muted">Taslak</span>
                        <span className="ap-heading font-semibold">{hesap.taslakSayfa + hesap.taslakBlog}</span>
                      </div>
                      <div className="ap-dash-progress">
                        <div
                          className="ap-dash-progress-dolgu"
                          style={{
                            width: `${100 - hesap.yayinOrani}%`,
                            background: 'linear-gradient(90deg, #94a3b8, #cbd5e1)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Hızlı Erişim */}
          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="ap-dash-bolum-baslik mb-0">Hızlı Erişim</h2>
              <button
                type="button"
                onClick={() => setHizliErisimAcik(true)}
                className="ap-dash-ayar-btn"
                title="Hızlı erişimi düzenle"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">Düzenle</span>
              </button>
            </div>
            <div className="ap-dash-hizli-grid">
              {hizliModuller.map((modul) => (
                <button key={modul.id} type="button" onClick={() => onModulAc(modul.id)} className="ap-dash-hizli-oge">
                  <span className="ap-dash-hizli-ikon">{modul.ikon}</span>
                  <span className="ap-dash-hizli-baslik">{modul.baslik}</span>
                </button>
              ))}
            </div>
          </section>

          <HizliErisimAyarlariModal acik={hizliErisimAcik} onKapat={() => setHizliErisimAcik(false)} />

          {/* Son Aktiviteler */}
          <section className="mt-8">
            <h2 className="ap-dash-bolum-baslik">Son Aktiviteler</h2>
            <div className="ap-dash-aktivite-grid">
              <div className="ap-dash-kart">
                <div className="ap-dash-kart-ust ap-dash-kart-ust-border">
                  <h3 className="ap-heading text-sm font-semibold">Son Blog Yazıları</h3>
                  <button type="button" onClick={() => onModulAc('blog')} className="ap-dash-link">
                    Tümü →
                  </button>
                </div>
                <div className="ap-dash-liste">
                  {ozet.sonBloglar.length === 0 ? (
                    <p className="ap-muted px-4 py-6 text-center text-sm">Henüz blog yazısı yok.</p>
                  ) : (
                    ozet.sonBloglar.map((b) => (
                      <div key={b.id} className="ap-dash-liste-satir">
                        <div className="min-w-0">
                          <p className="ap-heading truncate text-sm font-medium">{b.baslik}</p>
                          <p className="ap-muted text-xs">{tarihKisa(b.olusturma)}</p>
                        </div>
                        <span className={`ap-etiket shrink-0 ${b.yayinda ? 'ap-etiket-yayinda' : 'ap-etiket-taslak'}`}>
                          {b.yayinda ? 'Yayında' : 'Taslak'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="ap-dash-kart">
                <div className="ap-dash-kart-ust ap-dash-kart-ust-border">
                  <h3 className="ap-heading text-sm font-semibold">Son Form Gönderimleri</h3>
                  <button type="button" onClick={() => onModulAc('formlar')} className="ap-dash-link">
                    Tümü →
                  </button>
                </div>
                <div className="ap-dash-liste">
                  {ozet.sonGonderimler.length === 0 ? (
                    <p className="ap-muted px-4 py-6 text-center text-sm">Henüz gönderim yok.</p>
                  ) : (
                    ozet.sonGonderimler.map((g) => (
                      <div key={g.id} className="ap-dash-liste-satir">
                        <div className="min-w-0">
                          <p className="ap-heading truncate text-sm font-medium">{g.formAd}</p>
                          <p className="ap-muted text-xs">{tarihKisa(g.olusturma)}</p>
                        </div>
                        <span
                          className={`ap-etiket shrink-0 ${g.okundu ? 'ap-etiket-gri' : 'ap-etiket-menu'}`}
                        >
                          {g.okundu ? 'Okundu' : 'Yeni'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
