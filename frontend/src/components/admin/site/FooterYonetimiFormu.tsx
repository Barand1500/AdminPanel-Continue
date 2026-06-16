import { useMemo, useState } from 'react';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { useSiteYonetimiAksiyonlari } from '@/hooks/useSiteYonetimiAksiyonlari';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { TelefonInput } from '@/components/form/TelefonInput';
import { EmailInput } from '@/components/form/EmailInput';
import { WhatsAppInput } from '@/components/form/WhatsAppInput';
import { FooterSemaSecici } from '@/components/admin/footer/FooterSemaSecici';
import { FooterKolonPanel } from '@/components/admin/footer/FooterKolonPanel';
import { FooterAltBantPanel } from '@/components/admin/footer/FooterAltBantPanel';
import { FooterOnizleme } from '@/components/admin/footer/FooterOnizleme';
import { FooterYuzucuPanel } from '@/components/admin/footer/FooterYuzucuPanel';
import { EmojiIkonSecici } from '@/components/admin/footer/EmojiIkonSecici';
import { SosyalMedyaAlani } from '@/components/form/SosyalMedyaAlani';
import {
  AdminPanelKarti,
  BildirimKutusu,
  HataDurumu,
  ModulBaslik,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { footerAyarlariBirlestir, type FooterAyarlari } from '@/types/footer';
import { whatsappFormatla } from '@/utils/telefonFormat';

const SEKMELER = [
  { id: 'sema', ad: 'Şema & Görünüm' },
  { id: 'marka', ad: 'Marka & İletişim' },
  { id: 'sosyal', ad: 'Sosyal Medya' },
  { id: 'kolonlar', ad: 'Link Kolonları' },
  { id: 'alt-bant', ad: 'Alt Bantlar' },
  { id: 'yuzucu', ad: 'Yüzen Butonlar' },
] as const;

type SekmeId = (typeof SEKMELER)[number]['id'];

function ToggleSatir({
  etiket,
  aciklama,
  acik,
  onDegistir,
}: {
  etiket: string;
  aciklama?: string;
  acik: boolean;
  onDegistir: (v: boolean) => void;
}) {
  return (
    <label className={`ap-toggle-kart ${acik ? 'ap-toggle-aktif ap-toggle-yesil' : ''}`}>
      <div>
        <p className="ap-heading text-sm font-semibold">{etiket}</p>
        {aciklama && <p className="ap-muted text-xs">{aciklama}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={acik}
        onClick={() => onDegistir(!acik)}
        className={`ap-toggle ${acik ? 'ap-toggle-on' : ''}`}
      >
        <span className="ap-toggle-thumb" />
      </button>
    </label>
  );
}

export function FooterYonetimiFormu() {
  const { ayarlar, siteAd, yukleniyor, hata, kaydediliyor, alanGuncelle } =
    useSiteAyarlariYonetimi();
  useSiteYonetimiAksiyonlari();
  const [sekme, setSekme] = useState<SekmeId>('sema');

  const footer = useMemo(() => footerAyarlariBirlestir(ayarlar), [ayarlar]);

  const footerGuncelle = (guncel: FooterAyarlari) => {
    alanGuncelle('footerAyarlariJson', guncel);
  };

  if (yukleniyor) return <YukleniyorDurumu mesaj="Footer ayarları yükleniyor..." />;
  if (!ayarlar) return <HataDurumu mesaj={hata ?? 'Ayarlar yüklenemedi'} />;

  const whatsappGorunen = ayarlar.whatsapp
    ? ayarlar.whatsapp.includes('+')
      ? ayarlar.whatsapp
      : whatsappFormatla(ayarlar.whatsapp)
    : '';

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_min(480px,44%)]">
      <div className="space-y-5">
        <ModulBaslik
          baslik="Footer Yönetimi"
          aciklama="Footer şeması, link kolonları, alt bantlar ve yüzen butonları yönetin."
        />

        {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
        {kaydediliyor && <BildirimKutusu mesaj="Kaydediliyor..." tur="bilgi" />}

        <div className="flex flex-wrap gap-2 border-b border-[var(--ap-border)] pb-2">
          {SEKMELER.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSekme(s.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                sekme === s.id
                  ? 'bg-[var(--ap-accent)] text-white'
                  : 'ap-muted hover:bg-[var(--ap-hover)]'
              }`}
            >
              {s.ad}
            </button>
          ))}
        </div>

        {sekme === 'sema' && (
          <AdminPanelKarti baslik="Şema & Görünüm">
            <FooterSemaSecici footer={footer} onDegistir={footerGuncelle} />
          </AdminPanelKarti>
        )}

        {sekme === 'marka' && (
          <>
            <AdminPanelKarti baslik="Marka Alanı">
              <div className="space-y-3">
                <ToggleSatir
                  etiket="Logo göster"
                  acik={footer.marka.logoGoster}
                  onDegistir={(logoGoster) =>
                    footerGuncelle({ ...footer, marka: { ...footer.marka, logoGoster } })
                  }
                />
                <ToggleSatir
                  etiket="Sosyal medya ikonları"
                  acik={footer.marka.sosyalGoster}
                  onDegistir={(sosyalGoster) =>
                    footerGuncelle({ ...footer, marka: { ...footer.marka, sosyalGoster } })
                  }
                />
                <ToggleSatir
                  etiket="Banka hesapları linki"
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
                {footer.marka.bankaLinki.aktif && (
                  <div className="flex flex-wrap items-end gap-4">
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
                    <div className="min-w-0 flex-1">
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
                        />
                      </FormAlani>
                    </div>
                    <div className="min-w-0 flex-1">
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
                  </div>
                )}
              </div>
            </AdminPanelKarti>

            <AdminPanelKarti baslik="İletişim Bilgileri" altBaslik="Footer sol sütununda görünür">
              <div className="space-y-4">
                <FormAlani etiket="Adres">
                  <textarea
                    rows={3}
                    value={ayarlar.adres ?? ''}
                    onChange={(e) => alanGuncelle('adres', e.target.value || null)}
                    className={formInputSinifi}
                    placeholder="Mahalle, sokak, ilçe, il..."
                  />
                </FormAlani>
                <TelefonInput
                  deger={ayarlar.telefon ?? ''}
                  onChange={(v) => alanGuncelle('telefon', v || null)}
                />
                <EmailInput
                  deger={ayarlar.email ?? ''}
                  onChange={(v) => alanGuncelle('email', v || null)}
                />
                <WhatsAppInput
                  deger={whatsappGorunen}
                  onChange={(v) => alanGuncelle('whatsapp', v || null)}
                />
              </div>
            </AdminPanelKarti>

            <AdminPanelKarti baslik="İletişim İkonları" altBaslik="Yalnızca emoji seçin">
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
            </AdminPanelKarti>

            <AdminPanelKarti baslik="Telif Yazısı">
              <FormAlani etiket="Telif metni">
                <input
                  type="text"
                  value={ayarlar.telifYazisi ?? ''}
                  onChange={(e) => alanGuncelle('telifYazisi', e.target.value || null)}
                  className={formInputSinifi}
                  placeholder={`© ${new Date().getFullYear()} ${siteAd}. Tüm hakları saklıdır.`}
                />
              </FormAlani>
            </AdminPanelKarti>
          </>
        )}

        {sekme === 'sosyal' && (
          <AdminPanelKarti baslik="Sosyal Medya" altBaslik="Footer'da görünecek platform linkleri ve ikonları">
            <SosyalMedyaAlani
              sosyal={ayarlar.sosyalMedyaJson ?? {}}
              onGuncelle={(sosyalMedyaJson) => alanGuncelle('sosyalMedyaJson', sosyalMedyaJson)}
            />
          </AdminPanelKarti>
        )}

        {sekme === 'kolonlar' && (
          <AdminPanelKarti baslik="Link Kolonları" altBaslik="Kolon ekle, sırala ve linkleri yönetin">
            <FooterKolonPanel footer={footer} onDegistir={footerGuncelle} />
          </AdminPanelKarti>
        )}

        {sekme === 'alt-bant' && (
          <AdminPanelKarti baslik="Alt Bantlar">
            <FooterAltBantPanel footer={footer} onDegistir={footerGuncelle} />
          </AdminPanelKarti>
        )}

        {sekme === 'yuzucu' && (
          <AdminPanelKarti baslik="Yüzen Butonlar" altBaslik="Sağ alttaki sabit butonlar — ekle, düzenle, sırala">
            <FooterYuzucuPanel footer={footer} onDegistir={footerGuncelle} />
          </AdminPanelKarti>
        )}
      </div>

      <FooterOnizleme siteAdi={siteAd} ayarlar={ayarlar} footer={footer} />
    </div>
  );
}
