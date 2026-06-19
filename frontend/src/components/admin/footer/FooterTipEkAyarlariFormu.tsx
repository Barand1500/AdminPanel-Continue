import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import type { FooterAyarlari, FooterTipEkAyarlari } from '@/types/footer';
import type { FooterTipi } from '@/data/footerTipleri';
import { footerTipTanimiBul } from '@/data/footerTipleri';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';

interface FooterTipEkAyarlariFormuProps {
  tip: FooterTipi;
  tipEk: FooterTipEkAyarlari;
  onGuncelle: (parcalar: Partial<FooterAyarlari>) => void;
}

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

export function FooterTipEkAyarlariFormu({ tip, tipEk, onGuncelle }: FooterTipEkAyarlariFormuProps) {
  const tanim = footerTipTanimiBul(tip);
  const guncelle = (parcalar: Partial<FooterTipEkAyarlari>) => {
    onGuncelle({ tipEk: { ...tipEk, ...parcalar } });
  };

  if (!tanim.ekAyarlari) {
    return (
      <AdminPanelKarti baslik="Ek Ayarlar" altBaslik="Bu footer tipi için ek alan gerekmez.">
        <p className="ap-muted text-sm">Standart sekmelerden marka, kolon ve alt bant ayarlarını yönetebilirsiniz.</p>
      </AdminPanelKarti>
    );
  }

  return (
    <AdminPanelKarti baslik="Ek Ayarlar" altBaslik={`${tanim.ad} tipine özel alanlar`}>
      <div className="space-y-4">
        {tip === 'newsletter' && (
          <>
            <FormAlani etiket="Newsletter başlığı">
              <input
                type="text"
                className={formInputSinifi}
                value={tipEk.newsletterBaslik ?? ''}
                onChange={(e) => guncelle({ newsletterBaslik: e.target.value })}
              />
            </FormAlani>
            <FormAlani etiket="E-posta placeholder">
              <input
                type="text"
                className={formInputSinifi}
                value={tipEk.newsletterPlaceholder ?? ''}
                onChange={(e) => guncelle({ newsletterPlaceholder: e.target.value })}
              />
            </FormAlani>
            <FormAlani etiket="Buton metni">
              <input
                type="text"
                className={formInputSinifi}
                value={tipEk.newsletterButon ?? ''}
                onChange={(e) => guncelle({ newsletterButon: e.target.value })}
              />
            </FormAlani>
          </>
        )}

        {tip === 'kompakt' && (
          <ToggleSatir
            etiket="Koyu tema"
            aciklama="Kapalıyken açık arka plan kullanılır"
            acik={tipEk.kompaktKoyuTema !== false}
            onDegistir={(kompaktKoyuTema) => guncelle({ kompaktKoyuTema })}
          />
        )}

        {tip === 'kurumsal' && (
          <ToggleSatir
            etiket="Güven bandı vurgusu"
            aciklama="Rozetler daha belirgin görünür"
            acik={tipEk.guvenVurgu !== false}
            onDegistir={(guvenVurgu) => guncelle({ guvenVurgu })}
          />
        )}

        {tip === 'sade' && (
          <ToggleSatir
            etiket="Koyu alt bant"
            aciklama="Telif satırı için koyu arka plan"
            acik={tipEk.kompaktKoyuTema === true}
            onDegistir={(kompaktKoyuTema) => guncelle({ kompaktKoyuTema })}
          />
        )}
      </div>
    </AdminPanelKarti>
  );
}
