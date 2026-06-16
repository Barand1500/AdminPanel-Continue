import { useCallback } from 'react';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { useSiteYonetimiAksiyonlari } from '@/hooks/useSiteYonetimiAksiyonlari';
import { GorselAlan } from '@/components/form/GorselAlan';
import { FontSecici } from '@/components/form/FontSecici';
import { RenkSecici } from '@/components/form/RenkSecici';
import { TelefonInput } from '@/components/form/TelefonInput';
import { EmailInput } from '@/components/form/EmailInput';
import { WhatsAppInput } from '@/components/form/WhatsAppInput';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import {
  AdminPanelKarti,
  BildirimKutusu,
  ModulBaslik,
  YukleniyorDurumu,
  HataDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { whatsappFormatla, whatsappKayitDegeri } from '@/utils/telefonFormat';

export function SiteAyarlariSayfasi() {
  const { site, siteAd, ayarlar, yukleniyor, hata, kaydediliyor, alanGuncelle } = useSiteAyarlariYonetimi();
  useSiteYonetimiAksiyonlari();

  const whatsappGoster = ayarlar?.whatsapp ? whatsappFormatla(ayarlar.whatsapp) : '';

  const whatsappGuncelle = useCallback(
    (deger: string) => {
      alanGuncelle('whatsapp', deger ? whatsappKayitDegeri(deger) : '');
    },
    [alanGuncelle]
  );

  if (yukleniyor) return <YukleniyorDurumu mesaj="Site ayarları yükleniyor..." />;
  if (!ayarlar) return <HataDurumu mesaj={hata ?? 'Ayarlar yüklenemedi'} />;

  return (
    <div className="ap-site-ayarlari">
      <ModulBaslik
        baslik="Site Ayarları"
        aciklama={`${siteAd || site?.ad || 'Site'} — global tema ve iletişim bilgileri`}
      />

      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {kaydediliyor && <BildirimKutusu mesaj="Kaydediliyor..." tur="bilgi" />}

      <div className="mt-4 rounded-lg border border-dashed border-[var(--ap-border)] bg-[var(--ap-input-bg)] p-4">
        <p className="ap-muted text-xs leading-relaxed">
          Logo, slogan, kurlar ve header görünümü için{' '}
          <strong className="text-[var(--ap-accent)]">Header Yönetimi</strong> modülünü kullanın.
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <AdminPanelKarti baslik="Marka ve Tema" altBaslik="Favicon ve renk paleti">
          <div className="space-y-5">
            <GorselAlan
              etiket="Favicon"
              aciklama="Tarayıcı sekmesindeki küçük ikon"
              deger={ayarlar.faviconUrl ?? ''}
              onChange={(v) => alanGuncelle('faviconUrl', v || null)}
              onizlemeSinifi="h-10 w-10 rounded object-contain bg-[var(--ap-input-bg)] border border-[var(--ap-border)] p-0.5"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <RenkSecici
                etiket="Ana Renk"
                deger={ayarlar.anaRenk ?? '#7c3aed'}
                onChange={(v) => alanGuncelle('anaRenk', v)}
              />
              <RenkSecici
                etiket="İkincil Renk"
                deger={ayarlar.ikincilRenk ?? '#a78bfa'}
                onChange={(v) => alanGuncelle('ikincilRenk', v)}
              />
            </div>
          </div>
        </AdminPanelKarti>

        <AdminPanelKarti baslik="Tipografi" altBaslik="Site genelinde kullanılacak yazı tipi">
          <FontSecici deger={ayarlar.font ?? 'Inter'} onChange={(v) => alanGuncelle('font', v)} />
        </AdminPanelKarti>

        <AdminPanelKarti baslik="İletişim Bilgileri" altBaslik="Footer, üst bant ve iletişim sayfasında kullanılır">
          <div className="space-y-4">
            <TelefonInput
              deger={ayarlar.telefon ?? ''}
              onChange={(v) => alanGuncelle('telefon', v || null)}
            />
            <EmailInput deger={ayarlar.email ?? ''} onChange={(v) => alanGuncelle('email', v || null)} />
            <WhatsAppInput deger={whatsappGoster} onChange={whatsappGuncelle} />
            <FormAlani etiket="Adres">
              <textarea
                className={formInputSinifi}
                rows={3}
                placeholder="Mahalle, sokak, ilce, il..."
                value={ayarlar.adres ?? ''}
                onChange={(e) => alanGuncelle('adres', e.target.value || null)}
              />
            </FormAlani>
            <FormAlani etiket="Telif Yazisi" aciklama="Footer alt satir metni">
              <input
                className={formInputSinifi}
                placeholder={`© ${new Date().getFullYear()} ${siteAd}. Tüm hakları saklıdır.`}
                value={ayarlar.telifYazisi ?? ''}
                onChange={(e) => alanGuncelle('telifYazisi', e.target.value || null)}
              />
            </FormAlani>
          </div>
        </AdminPanelKarti>

        <AdminPanelKarti baslik="Önizleme" altBaslik="Renk ve font önizlemesi">
          <div
            className="rounded-xl border border-[var(--ap-border)] p-5"
            style={{
              fontFamily: `"${ayarlar.font ?? 'Inter'}", sans-serif`,
              background: `linear-gradient(135deg, ${ayarlar.anaRenk ?? '#7c3aed'}18, ${ayarlar.ikincilRenk ?? '#a78bfa'}22)`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${ayarlar.anaRenk ?? '#7c3aed'}, ${ayarlar.ikincilRenk ?? '#a78bfa'})`,
                }}
              >
                G
              </div>
              <div>
                <p className="font-bold" style={{ color: ayarlar.anaRenk ?? '#7c3aed' }}>
                  {siteAd}
                </p>
                <p className="text-sm opacity-70">Logo → Header Yönetimi</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <span
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                style={{ background: ayarlar.anaRenk ?? '#7c3aed' }}
              >
                Ana renk
              </span>
              <span
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                style={{ background: ayarlar.ikincilRenk ?? '#a78bfa' }}
              >
                İkincil
              </span>
            </div>
            {ayarlar.telefon && (
              <p className="ap-muted mt-4 text-sm">
                Tel: <span className="ap-heading">{ayarlar.telefon}</span>
              </p>
            )}
          </div>
        </AdminPanelKarti>
      </div>
    </div>
  );
}
