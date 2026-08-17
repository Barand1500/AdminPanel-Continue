import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { RenkSecici } from '@/components/form/RenkSecici';
import { AdminAnahtarDugme } from '@/components/admin/ortak/AdminFormBilesenleri';
import type { FooterAyarlari, FooterTipEkAyarlari } from '@/types/footer';
import type { FooterTipi } from '@/data/footerTipleri';
import { footerTipTanimiBul } from '@/data/footerTipleri';

interface FooterTipEkAyarlariFormuProps {
  tip: FooterTipi;
  tipEk: FooterTipEkAyarlari;
  onGuncelle: (parcalar: Partial<FooterAyarlari>) => void;
}

export function FooterTipEkAyarlariFormu({ tip, tipEk, onGuncelle }: FooterTipEkAyarlariFormuProps) {
  const tanim = footerTipTanimiBul(tip);
  const guncelle = (parcalar: Partial<FooterTipEkAyarlari>) => {
    onGuncelle({ tipEk: { ...tipEk, ...parcalar } });
  };

  if (!tanim.ekAyarlari) {
    return <p className="ap-muted text-sm">Bu footer tipi için ek alan gerekmez.</p>;
  }

  return (
    <div className="ap-header-ek-grid">
      {tip === 'newsletter' && (
        <div className="ap-header-form-grid">
          <FormAlani etiket="Bülten başlığı">
            <input
              type="text"
              className={formInputSinifi}
              value={tipEk.newsletterBaslik ?? ''}
              onChange={(e) => guncelle({ newsletterBaslik: e.target.value })}
              placeholder="Yeniliklerden haberdar olun"
            />
          </FormAlani>
          <FormAlani etiket="E-posta placeholder">
            <input
              type="text"
              className={formInputSinifi}
              value={tipEk.newsletterPlaceholder ?? ''}
              onChange={(e) => guncelle({ newsletterPlaceholder: e.target.value })}
              placeholder="E-posta adresiniz"
            />
          </FormAlani>
          <FormAlani etiket="Buton metni">
            <input
              type="text"
              className={formInputSinifi}
              value={tipEk.newsletterButon ?? ''}
              onChange={(e) => guncelle({ newsletterButon: e.target.value })}
              placeholder="Abone ol"
            />
          </FormAlani>
        </div>
      )}

      {tip === 'kompakt' && (
        <AdminAnahtarDugme
          etiket="Koyu tema"
          acik={tipEk.kompaktKoyuTema !== false}
          onDegistir={(kompaktKoyuTema) => guncelle({ kompaktKoyuTema })}
        />
      )}

      {tip === 'kurumsal' && (
        <>
          <div className="ap-header-form-grid">
            <RenkSecici etiket="Footer ana arka planı" deger={tipEk.arkaPlanRengi ?? ''} varsayilan="#0b2a77" onChange={(arkaPlanRengi) => guncelle({ arkaPlanRengi })} />
            <RenkSecici etiket="Alt bant arka planı" deger={tipEk.altBantRengi ?? ''} varsayilan="#08245f" onChange={(altBantRengi) => guncelle({ altBantRengi })} />
            <RenkSecici etiket="Yazı rengi" deger={tipEk.metinRengi ?? ''} varsayilan="#ffffff" onChange={(metinRengi) => guncelle({ metinRengi })} />
            <RenkSecici etiket="İkon kutusu" deger={tipEk.ikonArkaPlanRengi ?? ''} varsayilan="#08245f" onChange={(ikonArkaPlanRengi) => guncelle({ ikonArkaPlanRengi })} />
          </div>
          <AdminAnahtarDugme
            etiket="Güven bandı vurgusu"
            acik={tipEk.guvenVurgu !== false}
            onDegistir={(guvenVurgu) => guncelle({ guvenVurgu })}
          />
        </>
      )}

      {tip === 'sade' && (
        <AdminAnahtarDugme
          etiket="Koyu alt bant"
          acik={tipEk.kompaktKoyuTema === true}
          onDegistir={(kompaktKoyuTema) => guncelle({ kompaktKoyuTema })}
        />
      )}

      {tip === 'split' && (
        <div className="ap-header-form-grid">
          <RenkSecici
            etiket="Sol panel rengi"
            deger={tipEk.arkaPlanRengi ?? ''}
            varsayilan="#0f172a"
            onChange={(arkaPlanRengi) => guncelle({ arkaPlanRengi })}
          />
          <RenkSecici
            etiket="Sol panel yazı rengi"
            deger={tipEk.metinRengi ?? ''}
            varsayilan="#ffffff"
            onChange={(metinRengi) => guncelle({ metinRengi })}
          />
        </div>
      )}

      {tip === 'cta-serit' && (
        <div className="ap-header-form-grid">
          <FormAlani etiket="Çağrı başlığı">
            <input
              type="text"
              className={formInputSinifi}
              value={tipEk.ctaMetni ?? ''}
              onChange={(e) => guncelle({ ctaMetni: e.target.value })}
              placeholder="Projenizi konuşalım"
            />
          </FormAlani>
          <FormAlani etiket="Alt metin">
            <input
              type="text"
              className={formInputSinifi}
              value={tipEk.ctaAltMetin ?? ''}
              onChange={(e) => guncelle({ ctaAltMetin: e.target.value })}
              placeholder="Ücretsiz keşif görüşmesi"
            />
          </FormAlani>
          <FormAlani etiket="Buton metni">
            <input
              type="text"
              className={formInputSinifi}
              value={tipEk.newsletterButon ?? ''}
              onChange={(e) => guncelle({ newsletterButon: e.target.value })}
              placeholder="İletişime geç"
            />
          </FormAlani>
          <FormAlani etiket="Buton linki">
            <input
              type="text"
              className={formInputSinifi}
              value={tipEk.ctaLink ?? ''}
              onChange={(e) => guncelle({ ctaLink: e.target.value })}
              placeholder="/iletisim"
            />
          </FormAlani>
          <RenkSecici
            etiket="Bant rengi"
            deger={tipEk.arkaPlanRengi ?? ''}
            varsayilan="#2563eb"
            onChange={(arkaPlanRengi) => guncelle({ arkaPlanRengi })}
          />
          <RenkSecici
            etiket="Bant yazı rengi"
            deger={tipEk.metinRengi ?? ''}
            varsayilan="#ffffff"
            onChange={(metinRengi) => guncelle({ metinRengi })}
          />
        </div>
      )}
    </div>
  );
}
