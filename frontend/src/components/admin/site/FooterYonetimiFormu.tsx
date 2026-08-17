import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { SosyalMedyaAlani } from '@/components/form/SosyalMedyaAlani';
import { FooterSemaSecici } from '@/components/admin/footer/FooterSemaSecici';
import { FooterKolonPanel } from '@/components/admin/footer/FooterKolonPanel';
import { FooterAltBantPanel } from '@/components/admin/footer/FooterAltBantPanel';
import { FooterOnizleme } from '@/components/admin/footer/FooterOnizleme';
import { FooterYuzucuPanel } from '@/components/admin/footer/FooterYuzucuPanel';
import { FooterTipGaleri } from '@/components/admin/footer/FooterTipGaleri';
import { FooterTipEkAyarlariFormu } from '@/components/admin/footer/FooterTipEkAyarlariFormu';
import { LogoBoyutSecici } from '@/components/admin/site/LogoBoyutSecici';
import { EmojiIkonSecici } from '@/components/admin/footer/EmojiIkonSecici';
import {
  IletisimOzetSatirlari,
  SiteVerisiYonlendirme,
} from '@/components/admin/site/SiteVerisiYonlendirme';
import { logoBoyutuNormalize } from '@/types/logo';
import {
  AdminModulKabuk,
  BildirimKutusu,
  HataDurumu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import {
  AdminAnahtarDugme,
  AdminPilSekme,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import { footerAyarlariBirlestir, type FooterAyarlari } from '@/types/footer';
import type { SiteAyarlari } from '@/types/site';
import { telefonFormatla, whatsappFormatla } from '@/utils/telefonFormat';
import {
  footerTipiNormalize,
  footerTipTanimiBul,
  footerTipEkBirlestir,
  type FooterTipi,
} from '@/data/footerTipleri';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';

type Gorunum = 'galeri' | 'editor';
type IcSekme = 'marka' | 'sema' | 'kolonlar' | 'alt-bant' | 'ek-ayarlar' | 'yuzucu';

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

function FooterOnizlemeModal({
  acik,
  demoMod,
  siteAd,
  ayarlar,
  footer,
  onKapat,
}: {
  acik: boolean;
  demoMod: boolean;
  siteAd: string;
  ayarlar?: SiteAyarlari | null;
  footer: FooterAyarlari;
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
    <div className="ap-admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="footer-onizleme-baslik">
      <button type="button" className="ap-admin-modal-backdrop" aria-label="Kapat" onClick={onKapat} />
      <div className="ap-admin-modal ap-admin-modal-genis ap-header-oniz-modal ap-footer-oniz-modal">
        <header className="ap-admin-modal-header">
          <div>
            <h2 id="footer-onizleme-baslik" className="ap-admin-modal-baslik">
              Footer önizleme
            </h2>
            <p className="ap-admin-modal-alt">
              {demoMod ? 'Örnek verilerle tip görünümü' : 'Mevcut ayarlarınızla alt bilgi'}
            </p>
          </div>
          <button type="button" className="ap-admin-modal-kapat" onClick={onKapat}>
            ✕ ESC
          </button>
        </header>
        <FooterOnizleme
          siteAdi={siteAd}
          ayarlar={ayarlar}
          footer={footer}
          buyuk
          kabuksuz
          demoMod={demoMod}
        />
      </div>
    </div>
  );
}

export function FooterYonetimiFormu() {
  const { ayarlar, siteAd, yukleniyor, hata, kaydediliyor, kaydet, alanGuncelle } =
    useSiteAyarlariYonetimi();

  const [gorunum, setGorunum] = useState<Gorunum>('galeri');
  const [icSekme, setIcSekme] = useState<IcSekme>('marka');
  const [onizlemeAcik, setOnizlemeAcik] = useState(false);

  const footerHam = useMemo(() => footerAyarlariBirlestir(ayarlar), [ayarlar]);
  const aktifTip = footerTipiNormalize(footerHam.footerTipi);
  const tipTanim = footerTipTanimiBul(aktifTip);
  const tipEk = footerTipEkBirlestir(aktifTip, footerHam.tipEk);
  const footer = { ...footerHam, footerTipi: aktifTip, tipEk };

  const icSekmeler = useMemo(() => {
    const liste: { id: IcSekme; etiket: string }[] = [{ id: 'marka', etiket: 'Marka' }];
    if (tipTanim.semaGoster) liste.push({ id: 'sema', etiket: 'Şema' });
    if (tipTanim.kolonlar) liste.push({ id: 'kolonlar', etiket: 'Kolonlar' });
    liste.push({ id: 'alt-bant', etiket: 'Alt Bant' });
    if (tipTanim.ekAyarlari) liste.push({ id: 'ek-ayarlar', etiket: 'Ek Ayarlar' });
    liste.push({ id: 'yuzucu', etiket: 'Yüzen' });
    return liste;
  }, [tipTanim]);

  const gecerliIcSekme = icSekmeler.some((s) => s.id === icSekme) ? icSekme : 'marka';

  const footerGuncelle = useCallback(
    (guncel: FooterAyarlari) => {
      alanGuncelle('footerAyarlariJson', guncel);
    },
    [alanGuncelle]
  );

  const tipSec = useCallback(
    (tip: FooterTipi) => {
      footerGuncelle({
        ...footer,
        footerTipi: tip,
        tipEk: footerTipEkBirlestir(tip, footer.tipEk),
      });
      const yeni = footerTipTanimiBul(tip);
      if (!yeni.semaGoster && icSekme === 'sema') setIcSekme('marka');
      if (!yeni.kolonlar && icSekme === 'kolonlar') setIcSekme('marka');
      if (!yeni.ekAyarlari && icSekme === 'ek-ayarlar') setIcSekme('marka');
      setGorunum('editor');
    },
    [footer, footerGuncelle, icSekme]
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
        <YukleniyorDurumu mesaj="Footer ayarları yükleniyor..." />
      </AdminModulKabuk>
    );
  }
  if (!ayarlar) return <HataDurumu mesaj={hata ?? 'Ayarlar yüklenemedi'} />;

  const telefonGoster = ayarlar.telefon ? telefonFormatla(ayarlar.telefon) : null;
  const whatsappGoster = ayarlar.whatsapp
    ? ayarlar.whatsapp.includes('+')
      ? ayarlar.whatsapp
      : whatsappFormatla(ayarlar.whatsapp)
    : null;

  return (
    <AdminModulKabuk
      onizleGoster={false}
      ustIcerik={
        <AdminPilSekme
          sekmeler={[
            { id: 'galeri', etiket: 'Footer Tipleri', ikon: <GaleriIkon /> },
            { id: 'editor', etiket: 'Düzenleme', ikon: <DuzenlemeIkon /> },
          ]}
          aktif={gorunum}
          onDegistir={setGorunum}
        />
      }
    >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {kaydediliyor && <BildirimKutusu mesaj="Kaydediliyor..." tur="bilgi" />}

      {gorunum === 'galeri' && <FooterTipGaleri secili={aktifTip} onSec={tipSec} />}

      {gorunum === 'editor' && (
        <div className="ap-editor-panel ap-form-editor ap-header-editor">
          <div className="ap-form-editor-ust">
            <div>
              <h2 className="ap-heading text-sm font-semibold">Footer düzenle</h2>
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
              {gecerliIcSekme === 'marka' && (
                <div className="space-y-4">
                  <div className="ap-header-anahtar-liste">
                    <AdminAnahtarDugme
                      etiket="Logo göster"
                      acik={footer.marka.logoGoster}
                      onDegistir={(logoGoster) =>
                        footerGuncelle({ ...footer, marka: { ...footer.marka, logoGoster } })
                      }
                    />
                    <AdminAnahtarDugme
                      etiket="Sosyal ikonlar"
                      acik={footer.marka.sosyalGoster}
                      onDegistir={(sosyalGoster) =>
                        footerGuncelle({ ...footer, marka: { ...footer.marka, sosyalGoster } })
                      }
                    />
                    <AdminAnahtarDugme
                      etiket="Banka linki"
                      acik={footer.marka.bankaLinki.aktif}
                      onDegistir={(aktif) =>
                        footerGuncelle({
                          ...footer,
                          marka: {
                            ...footer.marka,
                            bankaLinki: { ...footer.marka.bankaLinki, aktif },
                          },
                        })
                      }
                    />
                  </div>

                  {footer.marka.logoGoster && (
                    <LogoBoyutSecici
                      etiket="Footer logo boyutu"
                      deger={logoBoyutuNormalize(footer.marka.logoBoyutu)}
                      onChange={(logoBoyutu) =>
                        footerGuncelle({ ...footer, marka: { ...footer.marka, logoBoyutu } })
                      }
                    />
                  )}

                  {footer.marka.bankaLinki.aktif && (
                    <div className="ap-header-form-grid">
                      <EmojiIkonSecici
                        etiket="Banka ikon"
                        deger={footer.marka.bankaLinki.ikon}
                        onDegistir={(ikon) =>
                          footerGuncelle({
                            ...footer,
                            marka: {
                              ...footer.marka,
                              bankaLinki: { ...footer.marka.bankaLinki, ikon },
                            },
                          })
                        }
                        oneriler={['🏦', '💳', '🏧', '💰']}
                      />
                      <FormAlani etiket="Link metni">
                        <input
                          type="text"
                          value={footer.marka.bankaLinki.ad}
                          onChange={(e) =>
                            footerGuncelle({
                              ...footer,
                              marka: {
                                ...footer.marka,
                                bankaLinki: { ...footer.marka.bankaLinki, ad: e.target.value },
                              },
                            })
                          }
                          className={formInputSinifi}
                          placeholder="Banka hesapları"
                        />
                      </FormAlani>
                      <FormAlani etiket="Link URL">
                        <input
                          type="text"
                          value={footer.marka.bankaLinki.link}
                          onChange={(e) =>
                            footerGuncelle({
                              ...footer,
                              marka: {
                                ...footer.marka,
                                bankaLinki: { ...footer.marka.bankaLinki, link: e.target.value },
                              },
                            })
                          }
                          className={formInputSinifi}
                          placeholder="/iletisim"
                        />
                      </FormAlani>
                    </div>
                  )}

                  <SosyalMedyaAlani
                    sosyal={ayarlar.sosyalMedyaJson ?? {}}
                    onGuncelle={(sosyalMedyaJson) => alanGuncelle('sosyalMedyaJson', sosyalMedyaJson)}
                  />

                  <SiteVerisiYonlendirme aciklama="Adres, telefon, e-posta ve WhatsApp Site Ayarları'ndan gelir. Burada yalnızca footer'da görünüp görünmeyeceğini seçersiniz." />
                  <div className="ap-header-anahtar-liste">
                    <AdminAnahtarDugme
                      etiket="Adres"
                      acik={footer.marka.adresGoster}
                      onDegistir={(adresGoster) =>
                        footerGuncelle({ ...footer, marka: { ...footer.marka, adresGoster } })
                      }
                    />
                    <AdminAnahtarDugme
                      etiket="Telefon"
                      acik={footer.marka.telefonGoster}
                      onDegistir={(telefonGoster) =>
                        footerGuncelle({ ...footer, marka: { ...footer.marka, telefonGoster } })
                      }
                    />
                    <AdminAnahtarDugme
                      etiket="E-posta"
                      acik={footer.marka.emailGoster}
                      onDegistir={(emailGoster) =>
                        footerGuncelle({ ...footer, marka: { ...footer.marka, emailGoster } })
                      }
                    />
                    <AdminAnahtarDugme
                      etiket="WhatsApp"
                      acik={footer.marka.whatsappGoster}
                      onDegistir={(whatsappGoster) =>
                        footerGuncelle({ ...footer, marka: { ...footer.marka, whatsappGoster } })
                      }
                    />
                  </div>
                  <IletisimOzetSatirlari
                    adres={ayarlar.adres}
                    telefon={telefonGoster}
                    email={ayarlar.email}
                    whatsapp={whatsappGoster}
                  />

                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {(['adres', 'email', 'telefon', 'whatsapp'] as const).map((alan) => (
                      <EmojiIkonSecici
                        key={alan}
                        etiket={alan.charAt(0).toUpperCase() + alan.slice(1)}
                        deger={footer.marka.iletisimIkonlari[alan]}
                        onDegistir={(ikon) =>
                          footerGuncelle({
                            ...footer,
                            marka: {
                              ...footer.marka,
                              iletisimIkonlari: {
                                ...footer.marka.iletisimIkonlari,
                                [alan]: ikon,
                              },
                            },
                          })
                        }
                        oneriler={
                          alan === 'adres'
                            ? ['📍', '🗺️', '🏠']
                            : alan === 'email'
                              ? ['✉️', '📧', '📨']
                              : alan === 'telefon'
                                ? ['📞', '☎️', '📱']
                                : ['💬', '📲', '💚']
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {gecerliIcSekme === 'sema' && (
                <FooterSemaSecici footer={footer} onDegistir={footerGuncelle} />
              )}

              {gecerliIcSekme === 'kolonlar' && (
                <FooterKolonPanel footer={footer} onDegistir={footerGuncelle} />
              )}

              {gecerliIcSekme === 'alt-bant' && (
                <FooterAltBantPanel footer={footer} onDegistir={footerGuncelle} />
              )}

              {gecerliIcSekme === 'ek-ayarlar' && (
                <FooterTipEkAyarlariFormu
                  tip={aktifTip}
                  tipEk={tipEk}
                  onGuncelle={(parcalar) => footerGuncelle({ ...footer, ...parcalar })}
                />
              )}

              {gecerliIcSekme === 'yuzucu' && (
                <FooterYuzucuPanel footer={footer} onDegistir={footerGuncelle} />
              )}
            </div>
          </div>
        </div>
      )}

      <FooterOnizlemeModal
        acik={onizlemeAcik}
        demoMod={gorunum === 'galeri'}
        siteAd={siteAd}
        ayarlar={ayarlar}
        footer={footer}
        onKapat={onizlemeyiKapat}
      />
    </AdminModulKabuk>
  );
}
