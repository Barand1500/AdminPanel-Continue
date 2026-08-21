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
  const imzaRenk = tip === 'imza-kurumsal';

  return (
    <div className="ap-header-ek-grid">
      <AdminAnahtarDugme
        etiket="Kaydırırken sabit kalsın"
        acik={tipEk.sabit !== false}
        onDegistir={(sabit) => guncelle({ sabit })}
      />
      <AdminAnahtarDugme
        etiket="Gece / gündüz butonu (PC)"
        acik={tipEk.temaGosterPc !== false}
        onDegistir={(temaGosterPc) => guncelle({ temaGosterPc })}
      />
      <AdminAnahtarDugme
        etiket="Gece / gündüz butonu (Mobil)"
        acik={tipEk.temaGosterMobil !== false}
        onDegistir={(temaGosterMobil) => guncelle({ temaGosterMobil })}
      />
      <div className="ap-header-form-grid">
        <RenkSecici
          etiket="Ana header arka planı"
          deger={tipEk.arkaPlanRengi ?? ''}
          varsayilan={imzaRenk ? '#0b2a77' : '#ffffff'}
          onChange={(arkaPlanRengi) => guncelle({ arkaPlanRengi })}
        />
        {tanim.ustBant && (
          <RenkSecici
            etiket="Üst iletişim bandı"
            deger={tipEk.ustBantRengi ?? ''}
            varsayilan={imzaRenk ? '#08245f' : '#ffffff'}
            onChange={(ustBantRengi) => guncelle({ ustBantRengi })}
          />
        )}
        <RenkSecici
          etiket="Menü / metin rengi"
          deger={tipEk.metinRengi ?? ''}
          varsayilan={imzaRenk ? '#ffffff' : '#111827'}
          onChange={(metinRengi) => guncelle({ metinRengi })}
        />
        <RenkSecici
          etiket="Katalog / buton rengi"
          deger={tipEk.butonRengi ?? ''}
          varsayilan={imzaRenk ? '#eef4ff' : '#111827'}
          onChange={(butonRengi) => guncelle({ butonRengi })}
        />
      </div>
      {tanim.ustBant && (
        <>
          <AdminAnahtarDugme
            etiket="Kaydırırken üst bant gizlensin (PC)"
            acik={tipEk.ustBantKaydirincaGizlePc === true}
            onDegistir={(ustBantKaydirincaGizlePc) => guncelle({ ustBantKaydirincaGizlePc })}
          />
          <AdminAnahtarDugme
            etiket="Kaydırırken üst bant gizlensin (Mobil)"
            acik={tipEk.ustBantKaydirincaGizleMobil === true}
            onDegistir={(ustBantKaydirincaGizleMobil) => guncelle({ ustBantKaydirincaGizleMobil })}
          />
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
              <option value="ikon">Açılır / kapanır ikon</option>
            </select>
          </FormAlani>
          {(tipEk.aramaModu === 'ikon' || tip === 'imza-kurumsal') && (
            <FormAlani etiket="Arama açılışı">
              <select
                className={formInputSinifi}
                value={tipEk.aramaAcilis ?? 'alt'}
                onChange={(e) => guncelle({ aramaAcilis: e.target.value as 'yan' | 'alt' })}
              >
                <option value="yan">Yandan açılır</option>
                <option value="alt">Alttan açılır</option>
              </select>
            </FormAlani>
          )}
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
