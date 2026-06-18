import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MenuDuzenlemePanel,
  MenuOnizlemePanel,
} from '@/components/admin/menu/MenuBilesenleri';
import { UstMenuPanel } from '@/components/admin/menu/UstMenuPanel';
import {
  AdminModulKabuk,
  AdminPanelKarti,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { sayfadanForm } from '@/components/admin/sayfa/SayfaBilesenleri';
import { useKaydedilmemisBildirim } from '@/contexts/AdminUyariBildirimContext';
import { adminMenuGuncelle, adminSayfaGuncelle, adminSayfaOlustur, adminSayfalariGetir, type AdminSayfa } from '@/features/admin/sayfaApi';
import { adminSiteApi } from '@/features/site/adminSiteApi';
import type { UstMenuOgesi } from '@/types/header';
import { headerAyarlariBirlestir } from '@/types/header';
import { slugUret } from '@/components/admin/ortak/AdminFormBilesenleri';
import {
  pendingSayfaMi,
  ustMenuEsit,
  ustMenuSayfaSenkronize,
  ustMenuSilinenSayfaGuncelle,
  headerDilCevirileriSenkronize,
} from '@/utils/menuYardimci';
import { idKarsilastir } from '@/utils/idKarsilastir';
import { siteVerisiGuncellendiYayinla } from '@/utils/siteVerisiOlaylari';

function sayfaListesiEsit(a: AdminSayfa[], b: AdminSayfa[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => idKarsilastir(x.id, y.id));
  const sb = [...b].sort((x, y) => idKarsilastir(x.id, y.id));
  return sa.every((s, i) => {
    const o = sb[i];
    return (
      s.sira === o.sira &&
      s.menudeGoster === o.menudeGoster &&
      s.baslik === o.baslik &&
      s.slug === o.slug &&
      s.yayinda === o.yayinda
    );
  });
}

export function MenuYonetimiSayfasi() {
  const [sayfalar, setSayfalar] = useState<AdminSayfa[]>([]);
  const kayitliSayfaRef = useRef<AdminSayfa[]>([]);
  const [ustMenu, setUstMenu] = useState<UstMenuOgesi[]>([]);
  const kayitliUstMenuRef = useRef<UstMenuOgesi[]>([]);
  const [headerJson, setHeaderJson] = useState<ReturnType<typeof headerAyarlariBirlestir> | null>(null);
  const [siteAd, setSiteAd] = useState('Site Adı');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const sayfaKirli = !sayfaListesiEsit(sayfalar, kayitliSayfaRef.current);
  const ustMenuKirli = !ustMenuEsit(ustMenu, kayitliUstMenuRef.current);
  const kirli = sayfaKirli || ustMenuKirli;

  useKaydedilmemisBildirim(
    kirli && !kaydediliyor,
    'Kaydedilmemiş menü değişiklikleri var.',
    'Menü Yönetimi',
    'menu'
  );

  useEffect(() => {
    void (async () => {
      try {
        const [liste, siteVeri] = await Promise.all([
          adminSayfalariGetir(),
          adminSiteApi.ayarlariGetir(),
        ]);
        setSayfalar(liste);
        kayitliSayfaRef.current = liste;
        setSiteAd(siteVeri.site.ad);
        const header = headerAyarlariBirlestir(siteVeri.ayarlar);
        setHeaderJson(header);
        const menu = header.ustMenu ?? [];
        setUstMenu(menu);
        kayitliUstMenuRef.current = menu;
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Veri alinamadi');
      } finally {
        setYukleniyor(false);
      }
    })();
  }, []);

  function toggleMenu(id: string) {
    setSayfalar((onceki) =>
      onceki.map((s) => (s.id === id ? { ...s, menudeGoster: !s.menudeGoster } : s))
    );
    setBasari('');
  }

  function yukari(id: string) {
    setSayfalar((onceki) => {
      const liste = [...onceki].sort((a, b) => a.sira - b.sira);
      const index = liste.findIndex((s) => s.id === id);
      if (index <= 0) return onceki;
      const yeni = [...liste];
      [yeni[index - 1], yeni[index]] = [yeni[index], yeni[index - 1]];
      return yeni.map((s, i) => ({ ...s, sira: i }));
    });
    setBasari('');
  }

  function asagi(id: string) {
    setSayfalar((onceki) => {
      const liste = [...onceki].sort((a, b) => a.sira - b.sira);
      const index = liste.findIndex((s) => s.id === id);
      if (index < 0 || index >= liste.length - 1) return onceki;
      const yeni = [...liste];
      [yeni[index], yeni[index + 1]] = [yeni[index + 1], yeni[index]];
      return yeni.map((s, i) => ({ ...s, sira: i }));
    });
    setBasari('');
  }

  function ustMenuGuncelle(menu: UstMenuOgesi[]) {
    const { sayfalar: syncSayfalar, ustMenu: syncMenu } = ustMenuSayfaSenkronize(
      menu,
      sayfalar,
      slugUret
    );
    setUstMenu(syncMenu);
    setSayfalar(syncSayfalar);
    setBasari('');
  }

  function ustMenuSil(silinen: UstMenuOgesi, yeniMenu: UstMenuOgesi[]) {
    setUstMenu(yeniMenu);
    setSayfalar(ustMenuSilinenSayfaGuncelle(silinen, sayfalar));
    setBasari('');
  }

  const kaydet = useCallback(async () => {
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      let guncelSayfalar = [...sayfalar];
      let guncelUstMenu = [...ustMenu];

      for (const pending of guncelSayfalar.filter((s) => pendingSayfaMi(s.id))) {
        const olusturulan = await adminSayfaOlustur(sayfadanForm(pending));
        guncelSayfalar = guncelSayfalar.map((s) => (s.id === pending.id ? olusturulan : s));
        guncelUstMenu = guncelUstMenu.map((o) =>
          o.sayfaId === pending.id ? { ...o, sayfaId: olusturulan.id } : o
        );
      }

      for (const s of guncelSayfalar) {
        const kayitli = kayitliSayfaRef.current.find((k) => k.id === s.id);
        if (!kayitli) continue;
        if (
          s.baslik !== kayitli.baslik ||
          s.yayinda !== kayitli.yayinda ||
          s.slug !== kayitli.slug
        ) {
          const guncellenen = await adminSayfaGuncelle(s.id, sayfadanForm(s));
          guncelSayfalar = guncelSayfalar.map((x) => (x.id === s.id ? guncellenen : x));
        }
      }

      guncelSayfalar = await adminMenuGuncelle(
        guncelSayfalar.map((s) => ({
          id: s.id,
          sira: s.sira,
          menudeGoster: s.menudeGoster,
        }))
      );

      if (headerJson) {
        const senkronHeader = headerDilCevirileriSenkronize(headerJson, guncelSayfalar);
        const yeniHeader = { ...senkronHeader, ustMenu: guncelUstMenu };
        const veri = await adminSiteApi.ayarlariGuncelle({ headerAyarlariJson: yeniHeader });
        const header = headerAyarlariBirlestir(veri.ayarlar);
        setHeaderJson(header);
        guncelUstMenu = header.ustMenu ?? guncelUstMenu;
      }

      setSayfalar(guncelSayfalar);
      kayitliSayfaRef.current = guncelSayfalar;
      setUstMenu(guncelUstMenu);
      kayitliUstMenuRef.current = guncelUstMenu;
      siteVerisiGuncellendiYayinla();
      setBasari('Menü başarıyla kaydedildi.');
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Menü kaydedilemedi');
    } finally {
      setKaydediliyor(false);
    }
  }, [sayfalar, ustMenu, headerJson]);

  useModulAksiyonlari(
    {
      kaydet,
      onizle: () => window.open('/', '_blank'),
    },
    { kaydet: kirli && !kaydediliyor, onizle: true }
  );

  return (
    <AdminModulKabuk
      baslik="Menü Yönetimi"
      aciklama="Üst menü linklerini ekleyin, çıkarın ve sıralayın. Sayfa menüsü düzenlemesi de bu sayfada kalır."
    >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="Kaydediliyor..." tur="bilgi" />}

      {yukleniyor ? (
        <YukleniyorDurumu mesaj="Menü verisi yükleniyor..." />
      ) : (
        <>
          <AdminPanelKarti baslik="Üst Menü" altBaslik="Header navigasyon linkleri">
            <UstMenuPanel
              ustMenu={ustMenu}
              sayfalar={sayfalar}
              kirli={ustMenuKirli}
              onChange={ustMenuGuncelle}
              onSil={ustMenuSil}
            />
          </AdminPanelKarti>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <AdminPanelKarti baslik="Menü Önizleme" altBaslik="Header'da görünecek linkler">
              <MenuOnizlemePanel sayfalar={sayfalar} ustMenu={ustMenu} siteAdi={siteAd} />
            </AdminPanelKarti>

            <AdminPanelKarti baslik="Sayfa Menüsü" altBaslik="Sayfa sırası ve görünürlük">
              <MenuDuzenlemePanel
                sayfalar={sayfalar}
                ustMenu={ustMenu}
                kirli={sayfaKirli}
                onToggleMenu={toggleMenu}
                onYukari={yukari}
                onAsagi={asagi}
              />
            </AdminPanelKarti>
          </div>
        </>
      )}
    </AdminModulKabuk>
  );
}
