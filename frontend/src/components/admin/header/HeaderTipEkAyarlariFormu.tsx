import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { RenkSecici } from '@/components/form/RenkSecici';
import { AdminAnahtarDugme } from '@/components/admin/ortak/AdminFormBilesenleri';
import type { HeaderAyarlari, HeaderTipEkAyarlari } from '@/types/header';
import type { HeaderTipi } from '@/data/headerTipleri';
import { headerTipTanimiBul } from '@/data/headerTipleri';

interface HeaderTipEkAyarlariFormuProps {
  tip: HeaderTipi;
  tipEk: HeaderTipEkAyarlari;
  onGuncelle: (parcalar: Partial<HeaderAyarlari>) => void;
}

export function HeaderTipEkAyarlariFormu({ tip, tipEk, onGuncelle }: HeaderTipEkAyarlariFormuProps) {
  const tanim = headerTipTanimiBul(tip);
  const guncelle = (parcalar: Partial<HeaderTipEkAyarlari>) => {
    onGuncelle({ tipEk: { ...tipEk, ...parcalar } });
  };

  if (!tanim.ekAyarlari) {
    return <p className="ap-muted text-sm">Bu header tipi için ek alan gerekmez.</p>;
  }

  return (
    <div className="ap-header-ek-grid">
      {tip === 'imza-kurumsal' && (
        <>
          <AdminAnahtarDugme
            etiket="Kaydırırken sabit kalsın"
            acik={tipEk.sabit !== false}
            onDegistir={(sabit) => guncelle({ sabit })}
          />
          <div className="ap-header-form-grid">
            <RenkSecici etiket="Ana header arka planı" deger={tipEk.arkaPlanRengi ?? ''} varsayilan="#0b2a77" onChange={(arkaPlanRengi) => guncelle({ arkaPlanRengi })} />
            <RenkSecici etiket="Üst iletişim bandı" deger={tipEk.ustBantRengi ?? ''} varsayilan="#08245f" onChange={(ustBantRengi) => guncelle({ ustBantRengi })} />
            <RenkSecici etiket="Menü / metin rengi" deger={tipEk.metinRengi ?? ''} varsayilan="#ffffff" onChange={(metinRengi) => guncelle({ metinRengi })} />
            <RenkSecici etiket="Katalog butonu" deger={tipEk.butonRengi ?? ''} varsayilan="#eef4ff" onChange={(butonRengi) => guncelle({ butonRengi })} />
          </div>
        </>
      )}
      {(tip === 'sade' || tip === 'kompakt' || tip === 'arama-odakli' || tip === 'imza-kurumsal' || tip === 'yuzen-hap') && (
        <>
          <AdminAnahtarDugme
            etiket="Arama kutusu"
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
          <AdminAnahtarDugme
            etiket="Hesap ikonu"
            acik={tipEk.kullaniciGoster !== false}
            onDegistir={(kullaniciGoster) => guncelle({ kullaniciGoster })}
          />
        </>
      )}

      {tip === 'kompakt' && (
        <FormAlani etiket="Header yüksekliği">
          <select
            className={formInputSinifi}
            value={tipEk.kompaktYukseklik ?? 48}
            onChange={(e) => guncelle({ kompaktYukseklik: Number(e.target.value) as 40 | 48 | 56 })}
          >
            <option value={40}>40 px</option>
            <option value={48}>48 px</option>
            <option value={56}>56 px</option>
          </select>
        </FormAlani>
      )}

      {(tip === 'modern' || tip === 'kurumsal' || tip === 'imza-kurumsal' || tip === 'yuzen-hap') && (
        <div className="ap-header-form-grid">
          <FormAlani etiket={tip === 'imza-kurumsal' || tip === 'kurumsal' ? 'Katalog buton metni' : 'Buton metni'}>
            <input
              className={formInputSinifi}
              value={tipEk.ctaMetni ?? ''}
              onChange={(e) => guncelle({ ctaMetni: e.target.value })}
              placeholder={tip === 'imza-kurumsal' || tip === 'kurumsal' ? 'Katalog' : 'İletişim'}
            />
          </FormAlani>
          <FormAlani etiket={tip === 'imza-kurumsal' || tip === 'kurumsal' ? 'Katalog link' : 'Buton link'}>
            <input
              className={formInputSinifi}
              value={tipEk.ctaLink ?? ''}
              onChange={(e) => guncelle({ ctaLink: e.target.value })}
              placeholder={tip === 'imza-kurumsal' || tip === 'kurumsal' ? '/katalog' : '/iletisim'}
            />
          </FormAlani>
        </div>
      )}

      {tip === 'merkez-logo' && (
        <>
          <GorselAlan
            etiket="İkinci logo"
            deger={tipEk.ikinciLogoUrl ?? ''}
            onChange={(v) => guncelle({ ikinciLogoUrl: v || null })}
            onizlemeSinifi="h-10 max-w-[120px] rounded object-contain border border-[var(--ap-border)] p-1"
          />
          <div className="ap-header-form-grid">
            <FormAlani etiket="İkinci marka metni">
              <input
                className={formInputSinifi}
                value={tipEk.ikinciMarkaMetni ?? ''}
                onChange={(e) => guncelle({ ikinciMarkaMetni: e.target.value || null })}
                placeholder="İkincil marka"
              />
            </FormAlani>
            <FormAlani etiket="Menü bölme noktası (%)">
              <input
                type="number"
                min={20}
                max={80}
                className={formInputSinifi}
                value={tipEk.menuBolmeNoktasi ?? 50}
                onChange={(e) => guncelle({ menuBolmeNoktasi: Number(e.target.value) })}
                placeholder="50"
              />
            </FormAlani>
          </div>
        </>
      )}

      {(tip === 'kurumsal' || tip === 'masthead') && (
        <FormAlani etiket={tip === 'masthead' ? 'Üst satır metni' : 'Destek metni'}>
          <input
            className={formInputSinifi}
            value={tipEk.destekMetni ?? ''}
            onChange={(e) => guncelle({ destekMetni: e.target.value })}
            placeholder={tip === 'masthead' ? '17 Ağustos 2026 · Pazartesi' : '7/24 destek hattı'}
          />
        </FormAlani>
      )}

      {tip === 'mega-menu' && (
        <FormAlani etiket="Mega menü kolon sayısı">
          <select
            className={formInputSinifi}
            value={tipEk.megaMenuKolon ?? 4}
            onChange={(e) => guncelle({ megaMenuKolon: Number(e.target.value) as 3 | 4 | 5 })}
          >
            <option value={3}>3 kolon</option>
            <option value={4}>4 kolon</option>
            <option value={5}>5 kolon</option>
          </select>
        </FormAlani>
      )}

      {tip === 'seffaf-hero' && (
        <>
          <AdminAnahtarDugme
            etiket="Sayfa üstünde şeffaf başla"
            acik={tipEk.seffafBaslangic !== false}
            onDegistir={(seffafBaslangic) => guncelle({ seffafBaslangic })}
          />
          <FormAlani etiket="Kaydırınca stil">
            <select
              className={formInputSinifi}
              value={tipEk.scrollSonrasiStil ?? 'beyaz'}
              onChange={(e) => guncelle({ scrollSonrasiStil: e.target.value as 'beyaz' | 'koyu' | 'cam' })}
            >
              <option value="beyaz">Beyaz</option>
              <option value="koyu">Koyu</option>
              <option value="cam">Cam (bulanık)</option>
            </select>
          </FormAlani>
        </>
      )}

      {tip !== 'sade' &&
        tip !== 'kompakt' &&
        tip !== 'arama-odakli' &&
        tip !== 'imza-kurumsal' &&
        tip !== 'modern' &&
        tip !== 'yuzen-hap' && (
          <AdminAnahtarDugme
            etiket="Hesap ikonu"
            acik={tipEk.kullaniciGoster !== false}
            onDegistir={(kullaniciGoster) => guncelle({ kullaniciGoster })}
          />
        )}
    </div>
  );
}
