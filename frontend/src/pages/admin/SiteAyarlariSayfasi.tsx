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
import { GunduzSablonSecici, GeceSablonSecici } from '@/components/admin/site/TemaSablonSecici';
import { TemaOnizlemePaneli } from '@/components/admin/site/TemaOnizlemePaneli';
import { whatsappFormatla, whatsappKayitDegeri } from '@/utils/telefonFormat';
import {
  GUNDUZ_SABLONLARI,
  temaAyarlariBirlestir,
  type GeceSablonId,
  type TemaAyarlari,
} from '@/types/temaAyarlari';

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

  const temaAyarlari = temaAyarlariBirlestir(ayarlar?.temaAyarlariJson);

  const temaGuncelle = useCallback(
    (guncel: Partial<TemaAyarlari>) => {
      alanGuncelle('temaAyarlariJson', { ...temaAyarlariBirlestir(ayarlar?.temaAyarlariJson), ...guncel });
    },
    [alanGuncelle, ayarlar?.temaAyarlariJson]
  );

  const gunduzSablonSec = useCallback(
    (id: 'mor' | 'mavi' | 'yesil') => {
      const sablon = GUNDUZ_SABLONLARI.find((s) => s.id === id);
      if (!sablon) return;
      alanGuncelle('anaRenk', sablon.anaRenk);
      alanGuncelle('ikincilRenk', sablon.ikincilRenk);
      temaGuncelle({ gunduzSablon: id });
    },
    [alanGuncelle, temaGuncelle]
  );

  const anaRenkGuncelle = useCallback(
    (v: string) => {
      alanGuncelle('anaRenk', v);
      temaGuncelle({ gunduzSablon: 'ozel' });
    },
    [alanGuncelle, temaGuncelle]
  );

  const ikincilRenkGuncelle = useCallback(
    (v: string) => {
      alanGuncelle('ikincilRenk', v);
      temaGuncelle({ gunduzSablon: 'ozel' });
    },
    [alanGuncelle, temaGuncelle]
  );

  const geceSablonSec = useCallback(
    (id: GeceSablonId) => temaGuncelle({ geceSablon: id }),
    [temaGuncelle]
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
        <AdminPanelKarti baslik="Marka ve Tema" altBaslik="Favicon, renk paleti ve gece modu şablonları">
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
                onChange={anaRenkGuncelle}
              />
              <RenkSecici
                etiket="İkincil Renk"
                deger={ayarlar.ikincilRenk ?? '#a78bfa'}
                onChange={ikincilRenkGuncelle}
              />
            </div>
            <GunduzSablonSecici secili={temaAyarlari.gunduzSablon} onSec={gunduzSablonSec} />
            <GeceSablonSecici secili={temaAyarlari.geceSablon} onSec={geceSablonSec} />
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

        <AdminPanelKarti baslik="Önizleme" altBaslik="Gündüz ve gece modu canlı önizleme">
          <TemaOnizlemePaneli
            siteAd={siteAd || site?.ad || 'Site'}
            anaRenk={ayarlar.anaRenk ?? '#7c3aed'}
            ikincilRenk={ayarlar.ikincilRenk ?? '#a78bfa'}
            geceSablon={temaAyarlari.geceSablon}
            font={ayarlar.font}
          />
        </AdminPanelKarti>
      </div>
    </div>
  );
}
