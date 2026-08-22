import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { LogoBoyutSecici } from '@/components/admin/site/LogoBoyutSecici';
import { logoBoyutuNormalize } from '@/types/logo';
import { IkonSecici } from '@/components/admin/header/IkonSecici';
import { ParaBirimiYonetimi } from '@/components/admin/header/ParaBirimiYonetimi';
import { AramaStilSecici } from '@/components/admin/header/AramaStilSecici';
import { SiteOnizlemePaneli } from './SiteOnizlemePaneli';
import type { HeaderAyarlari } from '@/types/header';
import { HeaderDilYonetimi } from '@/components/admin/header/HeaderDilYonetimi';
import { HeaderTipGaleri } from '@/components/admin/header/HeaderTipGaleri';
import { HeaderTipEkAyarlariFormu } from '@/components/admin/header/HeaderTipEkAyarlariFormu';
import {
  headerTipiNormalize,
  headerTipTanimiBul,
  tipEkBirlestir,
  type HeaderTipi,
} from '@/data/headerTipleri';
import {
  AdminModulKabuk,
  BildirimKutusu,
  HataDurumu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import {
  AdminAnahtarDugme,
  AdminPilSekme,
  AdminIkiEkranSlider,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';

type Gorunum = 'galeri' | 'editor';
type IcSekme = 'logo' | 'ust-bant' | 'dil' | 'ikonlar' | 'para' | 'kategori' | 'ek-ayarlar';

function GaleriIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <rect x="3" y="4" width="7" height="7" rx="1.5" />
      <rect x="14" y="4" width="7" height="7" rx="1.5" />
      <rect x="3" y="15" width="7" height="5" rx="1.5" />
      <rect x="14" y="15" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function DuzenlemeIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function HeaderOnizlemeModal({
  acik,
  demoMod,
  siteAd,
  headerAyarlari,
  iletisim,
  onKapat,
}: {
  acik: boolean;
  demoMod: boolean;
  siteAd?: string;
  headerAyarlari: HeaderAyarlari;
  iletisim: { telefon?: string | null; email?: string | null };
  onKapat: () => void;
}) {
  useEffect(() => {
    if (!acik) return;
    function tus(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onKapat();
      }
    }
    document.addEventListener('keydown', tus);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tus);
      document.body.style.overflow = '';
    };
  }, [acik, onKapat]);

  if (!acik) return null;

  return (
    <div className="ap-admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="header-onizleme-baslik">
      <button type="button" className="ap-admin-modal-backdrop" aria-label="Kapat" onClick={onKapat} />
      <div className="ap-admin-modal ap-admin-modal-genis ap-header-oniz-modal">
        <header className="ap-admin-modal-header">
          <div>
            <h2 id="header-onizleme-baslik" className="ap-admin-modal-baslik">
              Header önizleme
            </h2>
            <p className="ap-admin-modal-alt">
              {demoMod ? 'Örnek verilerle tip görünümü' : 'Mevcut ayarlarınızla üst menü'}
            </p>
          </div>
          <button type="button" className="ap-admin-modal-kapat" onClick={onKapat}>
            ✕ ESC
          </button>
        </header>
        <SiteOnizlemePaneli
          tip="header"
          kabuksuz
          demoMod={demoMod}
          siteAd={siteAd}
          headerAyarlari={headerAyarlari}
          iletisim={iletisim}
        />
      </div>
    </div>
  );
}

export function HeaderYonetimiFormu() {
  const {
    ayarlar,
    headerAyarlari,
    yukleniyor,
    hata,
    kaydediliyor,
    kaydet,
    siteAd,
    headerGuncelle,
  } = useSiteAyarlariYonetimi();

  const [gorunum, setGorunum] = useState<Gorunum>('galeri');
  const [icSekme, setIcSekme] = useState<IcSekme>('logo');
  const [onizlemeAcik, setOnizlemeAcik] = useState(false);

  const aktifTip = headerTipiNormalize(headerAyarlari.headerTipi);
  const tipTanim = headerTipTanimiBul(aktifTip);
  const tipEk = tipEkBirlestir(aktifTip, headerAyarlari.tipEk);
  const birlesikHeader = { ...headerAyarlari, headerTipi: aktifTip, tipEk };

  const icSekmeler = useMemo(() => {
    const liste: { id: IcSekme; etiket: string }[] = [{ id: 'logo', etiket: 'Logo' }];
    if (tipTanim.ustBant) liste.push({ id: 'ust-bant', etiket: 'Üst Bant' });
    liste.push({ id: 'dil', etiket: 'Dil' });
    liste.push({ id: 'ikonlar', etiket: 'İkonlar' });
    liste.push({ id: 'para', etiket: 'Para' });
    if (tipTanim.kategoriArama) liste.push({ id: 'kategori', etiket: 'Menü' });
    liste.push({ id: 'ek-ayarlar', etiket: 'Ek Ayarlar' });
    return liste;
  }, [tipTanim]);

  const gecerliIcSekme = icSekmeler.some((s) => s.id === icSekme) ? icSekme : 'logo';

  const headerGuncelleParcali = useCallback(
    (parcalar: Partial<HeaderAyarlari>) => {
      headerGuncelle({ ...headerAyarlari, ...parcalar });
    },
    [headerAyarlari, headerGuncelle]
  );

  const tipSec = useCallback(
    (tip: HeaderTipi) => {
      headerGuncelle({
        ...headerAyarlari,
        headerTipi: tip,
        tipEk: tipEkBirlestir(tip, headerAyarlari.tipEk),
      });
      const yeni = headerTipTanimiBul(tip);
      if (!yeni.ustBant && icSekme === 'ust-bant') setIcSekme('logo');
      if (!yeni.kategoriArama && icSekme === 'kategori') setIcSekme('logo');
      if (!yeni.ekAyarlari && icSekme === 'ek-ayarlar') setIcSekme('logo');
      setGorunum('editor');
    },
    [headerAyarlari, headerGuncelle, icSekme]
  );

  const duzenlemeyeGit = useCallback(() => setGorunum('editor'), []);
  const onizlemeyiAc = useCallback(() => setOnizlemeAcik(true), []);
  const onizlemeyiKapat = useCallback(() => setOnizlemeAcik(false), []);

  useModulAksiyonlari(
    {
      kaydet,
      duzenle: duzenlemeyeGit,
      onizle: onizlemeyiAc,
    },
    {
      kaydet: !kaydediliyor,
      duzenle: gorunum === 'galeri' && !kaydediliyor,
      onizle: true,
    }
  );

  if (yukleniyor) {
    return (
      <AdminModulKabuk onizleGoster={false}>
        <YukleniyorDurumu mesaj="Header ayarları yükleniyor..." />
      </AdminModulKabuk>
    );
  }
  if (!ayarlar) return <HataDurumu mesaj={hata ?? 'Ayarlar yüklenemedi'} />;

  const ustBant = headerAyarlari.ustBant!;
  const ikonlar = headerAyarlari.ikonlar!;
  const kategori = headerAyarlari.kategori!;
  const arama = headerAyarlari.arama!;
  const dilDestegi = headerAyarlari.dilDestegi!;

  return (
    <AdminModulKabuk
      onizleGoster={false}
      ustIcerik={
        <AdminPilSekme
          sekmeler={[
            { id: 'galeri', etiket: 'Header Tipleri', ikon: <GaleriIkon /> },
            { id: 'editor', etiket: 'Düzenleme', ikon: <DuzenlemeIkon /> },
          ]}
          aktif={gorunum}
          onDegistir={setGorunum}
        />
      }
    >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {kaydediliyor && <BildirimKutusu mesaj="Kaydediliyor..." tur="bilgi" />}

      <AdminIkiEkranSlider
        aktif={gorunum === 'editor' ? 'iki' : 'bir'}
        birinci={
          <HeaderTipGaleri
            secili={aktifTip}
            onSec={tipSec}
            siteAd={siteAd}
            headerAyarlari={birlesikHeader}
            iletisim={{ telefon: ayarlar.telefon, email: ayarlar.email }}
          />
        }
        ikinci={
          <div className="ap-editor-panel ap-form-editor ap-header-editor">
          <div className="ap-form-editor-ust">
            <div>
              <h2 className="ap-heading text-sm font-semibold">Header düzenle</h2>
              <p className="ap-widget-editor-tip">
                <span>{tipTanim.ad}</span>
                <button type="button" className="ap-widget-tip-degistir" onClick={() => setGorunum('galeri')}>
                  Tipi değiştir
                </button>
              </p>
            </div>
          </div>

          <div className="ap-form-editor-govde">
            <div className="ap-form-ic-piller" role="tablist">
              {icSekmeler.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={gecerliIcSekme === s.id}
                  className={`ap-form-ic-pil${gecerliIcSekme === s.id ? ' ap-form-ic-pil--aktif' : ''}`}
                  onClick={() => setIcSekme(s.id)}
                >
                  {s.etiket}
                </button>
              ))}
            </div>

            <div className="ap-form-ic-govde">
              {gecerliIcSekme === 'logo' && (
                <div className="ap-header-form-grid">
                  <GorselAlan
                    etiket="Header logosu"
                    deger={headerAyarlari.logoUrl ?? ''}
                    onChange={(v) => headerGuncelleParcali({ logoUrl: v || null })}
                    onizlemeSinifi="h-14 max-w-[180px] rounded-lg object-contain bg-[var(--ap-input-bg)] border border-[var(--ap-border)] p-1"
                  />
                  <div className="space-y-3">
                    <LogoBoyutSecici
                      etiket="Logo boyutu"
                      deger={logoBoyutuNormalize(headerAyarlari.logoBoyutu)}
                      onChange={(logoBoyutu) => headerGuncelleParcali({ logoBoyutu })}
                    />
                    {!tipTanim.ustBant && (
                      <>
                        <FormAlani etiket="Marka metni">
                          <input
                            type="text"
                            value={headerAyarlari.markaMetni ?? ''}
                            onChange={(e) => headerGuncelleParcali({ markaMetni: e.target.value || null })}
                            className={formInputSinifi}
                            placeholder="Örn. Güzel Teknoloji"
                          />
                        </FormAlani>
                        <FormAlani etiket="Slogan">
                          <input
                            className={formInputSinifi}
                            value={headerAyarlari.slogan ?? ''}
                            onChange={(e) => headerGuncelleParcali({ slogan: e.target.value || null })}
                            placeholder="Kısa slogan"
                          />
                        </FormAlani>
                      </>
                    )}
                  </div>
                </div>
              )}

              {gecerliIcSekme === 'ust-bant' && (
                <div className="space-y-3">
                  <div className="ap-header-form-grid">
                    <FormAlani etiket="Marka metni">
                      <input
                        type="text"
                        value={headerAyarlari.markaMetni ?? ''}
                        onChange={(e) => headerGuncelleParcali({ markaMetni: e.target.value || null })}
                        className={formInputSinifi}
                        placeholder="Örn. Güzel Teknoloji"
                      />
                    </FormAlani>
                    <FormAlani etiket="Slogan">
                      <input
                        className={formInputSinifi}
                        value={headerAyarlari.slogan ?? ''}
                        onChange={(e) => headerGuncelleParcali({ slogan: e.target.value || null })}
                        placeholder="Teknolojinin en güzel hali..."
                      />
                    </FormAlani>
                  </div>
                  <p className="ap-muted text-xs">
                    Telefon, e-posta ve sosyal medya Site Ayarları iletişim bilgilerinden gelir.
                  </p>
                  <div className="ap-header-anahtar-liste">
                    <AdminAnahtarDugme
                      etiket="Telefon"
                      acik={ustBant.telefonGoster}
                      onDegistir={(telefonGoster) =>
                        headerGuncelleParcali({ ustBant: { ...ustBant, telefonGoster } })
                      }
                    />
                    <AdminAnahtarDugme
                      etiket="E-posta"
                      acik={ustBant.emailGoster}
                      onDegistir={(emailGoster) =>
                        headerGuncelleParcali({ ustBant: { ...ustBant, emailGoster } })
                      }
                    />
                    <AdminAnahtarDugme
                      etiket="Sosyal medya"
                      acik={ustBant.sosyalGoster}
                      onDegistir={(sosyalGoster) =>
                        headerGuncelleParcali({ ustBant: { ...ustBant, sosyalGoster } })
                      }
                    />
                    <AdminAnahtarDugme
                      etiket="Kurlar"
                      acik={ustBant.kurlarGoster}
                      onDegistir={(kurlarGoster) =>
                        headerGuncelleParcali({ ustBant: { ...ustBant, kurlarGoster } })
                      }
                    />
                  </div>
                </div>
              )}

              {gecerliIcSekme === 'dil' && (
                <HeaderDilYonetimi dilDestegi={dilDestegi} onGuncelle={headerGuncelleParcali} />
              )}

              {gecerliIcSekme === 'ikonlar' && (
                <div className="ap-header-form-grid">
                  <IkonSecici
                    etiket="Gündüz ikonu"
                    grup="gunduz"
                    deger={ikonlar.tema.gunduz}
                    onChange={(gunduz) =>
                      headerGuncelleParcali({ ikonlar: { ...ikonlar, tema: { ...ikonlar.tema, gunduz } } })
                    }
                  />
                  <IkonSecici
                    etiket="Gece ikonu"
                    grup="gece"
                    deger={ikonlar.tema.gece}
                    onChange={(gece) =>
                      headerGuncelleParcali({ ikonlar: { ...ikonlar, tema: { ...ikonlar.tema, gece } } })
                    }
                  />
                  <IkonSecici
                    etiket="Hesap"
                    grup="hesap"
                    deger={ikonlar.hesap}
                    onChange={(hesap) => headerGuncelleParcali({ ikonlar: { ...ikonlar, hesap } })}
                  />
                </div>
              )}

              {gecerliIcSekme === 'para' && (
                <ParaBirimiYonetimi
                  kurlar={headerAyarlari.kurlar ?? []}
                  sonKurGuncelleme={headerAyarlari.sonKurGuncelleme}
                  onChange={(kurlar, sonKurGuncelleme) =>
                    headerGuncelleParcali({ kurlar, sonKurGuncelleme })
                  }
                />
              )}

              {gecerliIcSekme === 'kategori' && (
                <div className="space-y-3">
                  <Link to="/gt-admin/kategoriler" className="ap-widget-tip-degistir text-sm">
                    Menü listesini yönet →
                  </Link>
                  <div className="ap-header-form-grid">
                    <FormAlani etiket="Menü başlığı">
                      <input
                        className={formInputSinifi}
                        value={kategori.baslikMetni}
                        onChange={(e) =>
                          headerGuncelleParcali({ kategori: { ...kategori, baslikMetni: e.target.value } })
                        }
                        placeholder="Tüm Kategoriler"
                      />
                    </FormAlani>
                    <FormAlani etiket="Açılış modu">
                      <select
                        className={formInputSinifi}
                        value={kategori.acilisModu}
                        onChange={(e) =>
                          headerGuncelleParcali({
                            kategori: { ...kategori, acilisModu: e.target.value as typeof kategori.acilisModu },
                          })
                        }
                      >
                        <option value="dropdown">Dropdown (mega menü)</option>
                        <option value="sidebar">Yan panel</option>
                        <option value="liste">Liste</option>
                      </select>
                    </FormAlani>
                  </div>
                  <AramaStilSecici
                    arama={arama}
                    onChange={(yeniArama) => headerGuncelleParcali({ arama: yeniArama })}
                  />
                </div>
              )}

              {gecerliIcSekme === 'ek-ayarlar' && (
                <HeaderTipEkAyarlariFormu tip={aktifTip} tipEk={tipEk} onGuncelle={headerGuncelleParcali} />
              )}
            </div>
          </div>
        </div>
        }
      />

      <HeaderOnizlemeModal
        acik={onizlemeAcik}
        demoMod={false}
        siteAd={siteAd}
        headerAyarlari={birlesikHeader}
        iletisim={{ telefon: ayarlar.telefon, email: ayarlar.email }}
        onKapat={onizlemeyiKapat}
      />
    </AdminModulKabuk>
  );
}
