import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import type { HeaderAyarlari, HeaderTipEkAyarlari } from '@/types/header';
import type { HeaderTipi } from '@/data/headerTipleri';
import { headerTipTanimiBul } from '@/data/headerTipleri';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';

interface HeaderTipEkAyarlariFormuProps {
  tip: HeaderTipi;
  tipEk: HeaderTipEkAyarlari;
  onGuncelle: (parcalar: Partial<HeaderAyarlari>) => void;
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

export function HeaderTipEkAyarlariFormu({ tip, tipEk, onGuncelle }: HeaderTipEkAyarlariFormuProps) {
  const tanim = headerTipTanimiBul(tip);
  const guncelle = (parcalar: Partial<HeaderTipEkAyarlari>) => {
    onGuncelle({ tipEk: { ...tipEk, ...parcalar } });
  };

  if (!tanim.ekAyarlari) {
    return (
      <AdminPanelKarti baslik="Ek Ayarlar" altBaslik="Bu header tipi için ek alan gerekmez.">
        <p className="ap-muted text-sm">Standart sekmelerden logo, menü ve arama ayarlarını yönetebilirsiniz.</p>
      </AdminPanelKarti>
    );
  }

  return (
    <AdminPanelKarti baslik="Ek Ayarlar" altBaslik={`${tanim.ad} tipine özel alanlar`}>
      <div className="space-y-4">
        {(tip === 'sade' || tip === 'kompakt' || tip === 'arama-odakli' || tip === 'split') && (
          <>
            <ToggleSatir
              etiket="Arama kutusu göster"
              acik={tipEk.aramaGoster !== false}
              onDegistir={(aramaGoster) => guncelle({ aramaGoster })}
            />
            <FormAlani etiket="Arama modu">
              <select
                className={formInputSinifi}
                value={tipEk.aramaModu ?? 'tam'}
                onChange={(e) => guncelle({ aramaModu: e.target.value as 'tam' | 'ikon' })}
              >
                <option value="tam">Tam genişlik kutu</option>
                <option value="ikon">Yalnızca ikon</option>
              </select>
            </FormAlani>
            <ToggleSatir
              etiket="Kullanıcı alanı göster"
              aciklama="Header sağındaki hesap / giriş ikonu"
              acik={tipEk.kullaniciGoster !== false}
              onDegistir={(kullaniciGoster) => guncelle({ kullaniciGoster })}
            />
          </>
        )}

        {tip === 'kompakt' && (
          <FormAlani etiket="Header yüksekliği (px)">
            <select
              className={formInputSinifi}
              value={tipEk.kompaktYukseklik ?? 48}
              onChange={(e) =>
                guncelle({ kompaktYukseklik: Number(e.target.value) as 40 | 48 | 56 })
              }
            >
              <option value={40}>40</option>
              <option value={48}>48</option>
              <option value={56}>56</option>
            </select>
          </FormAlani>
        )}

        {tip === 'modern' && (
          <>
            <FormAlani etiket="CTA buton metni">
              <input
                className={formInputSinifi}
                value={tipEk.ctaMetni ?? ''}
                onChange={(e) => guncelle({ ctaMetni: e.target.value })}
              />
            </FormAlani>
            <FormAlani etiket="CTA link">
              <input
                className={formInputSinifi}
                value={tipEk.ctaLink ?? ''}
                onChange={(e) => guncelle({ ctaLink: e.target.value })}
                placeholder="/iletisim"
              />
            </FormAlani>
          </>
        )}

        {(tip === 'merkez-logo' || tip === 'split') && (
          <>
            <GorselAlan
              etiket="İkinci logo"
              aciklama="Split veya merkez logo düzeninde ikincil marka"
              deger={tipEk.ikinciLogoUrl ?? ''}
              onChange={(v) => guncelle({ ikinciLogoUrl: v || null })}
              onizlemeSinifi="h-10 max-w-[120px] rounded object-contain border border-[var(--ap-border)] p-1"
            />
            <FormAlani etiket="İkinci marka metni">
              <input
                className={formInputSinifi}
                value={tipEk.ikinciMarkaMetni ?? ''}
                onChange={(e) => guncelle({ ikinciMarkaMetni: e.target.value || null })}
              />
            </FormAlani>
          </>
        )}

        {tip === 'merkez-logo' && (
          <FormAlani etiket="Menü bölme noktası (%)">
            <input
              type="number"
              min={20}
              max={80}
              className={formInputSinifi}
              value={tipEk.menuBolmeNoktasi ?? 50}
              onChange={(e) => guncelle({ menuBolmeNoktasi: Number(e.target.value) })}
            />
          </FormAlani>
        )}

        {tip === 'kurumsal' && (
          <FormAlani etiket="Destek metni">
            <input
              className={formInputSinifi}
              value={tipEk.destekMetni ?? ''}
              onChange={(e) => guncelle({ destekMetni: e.target.value })}
            />
          </FormAlani>
        )}

        {tip === 'mega-menu' && (
          <FormAlani etiket="Mega menü kolon sayısı">
            <select
              className={formInputSinifi}
              value={tipEk.megaMenuKolon ?? 4}
              onChange={(e) =>
                guncelle({ megaMenuKolon: Number(e.target.value) as 3 | 4 | 5 })
              }
            >
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </FormAlani>
        )}

        {tip === 'seffaf-hero' && (
          <>
            <ToggleSatir
              etiket="Sayfa üstünde şeffaf başla"
              acik={tipEk.seffafBaslangic !== false}
              onDegistir={(seffafBaslangic) => guncelle({ seffafBaslangic })}
            />
            <FormAlani etiket="Scroll sonrası stil">
              <select
                className={formInputSinifi}
                value={tipEk.scrollSonrasiStil ?? 'beyaz'}
                onChange={(e) =>
                  guncelle({ scrollSonrasiStil: e.target.value as 'beyaz' | 'koyu' | 'cam' })
                }
              >
                <option value="beyaz">Beyaz</option>
                <option value="koyu">Koyu</option>
                <option value="cam">Cam (blur)</option>
              </select>
            </FormAlani>
          </>
        )}

        {tip !== 'sade' && tip !== 'kompakt' && tip !== 'arama-odakli' && tip !== 'split' && (
          <ToggleSatir
            etiket="Kullanıcı alanı göster"
            aciklama="Header sağındaki hesap / giriş ikonu"
            acik={tipEk.kullaniciGoster !== false}
            onDegistir={(kullaniciGoster) => guncelle({ kullaniciGoster })}
          />
        )}
      </div>
    </AdminPanelKarti>
  );
}
