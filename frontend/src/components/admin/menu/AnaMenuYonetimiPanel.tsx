import { useCallback, useEffect, useMemo, useState, type DragEvent, type ReactNode } from 'react';
import { AdminPanelKarti, BildirimKutusu, YukleniyorDurumu } from '@/components/admin/ortak/AdminBilesenleri';
import { AdminAnahtarDugme, AdminAramaKutusu, AdminDurumEtiketi } from '@/components/admin/ortak/AdminFormBilesenleri';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { adminSayfalariGetir, type AdminSayfa } from '@/features/admin/sayfaApi';
import { navKategorileriGetir } from '@/features/admin/navKategoriApi';
import { adminBloglariGetir, type AdminBlog } from '@/features/admin/blogApi';
import { adminFormlariGetir, type AdminForm } from '@/features/admin/formApi';
import type { NavKategoriKayit } from '@/types/navKategori';
import type { KayitliMenu, UstMenuOgesi } from '@/types/header';
import { footerAyarlariBirlestir } from '@/types/footer';
import { sayfaYolunuBul } from '@/data/bosSiteVerisi';
import { menuLinkGecerliMi, yeniMenuId } from '@/utils/menuYardimci';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { IconAlertTriangle, IconX } from '@tabler/icons-react';

type KaynakSekmesi = 'sayfalar' | 'kategoriler' | 'bloglar' | 'formlar' | 'ozel-link';
type DuzSatir = { oge: UstMenuOgesi; derinlik: number };
type KaynakGorunurluk = Record<KaynakSekmesi, boolean>;
const VARSAYILAN_KAYNAKLAR: KaynakGorunurluk = { sayfalar: true, kategoriler: true, bloglar: false, formlar: false, 'ozel-link': true };
const ANA_MENU_GIZLI_AKSIYONLAR = ['altEkle'] as const;

function menuleriCoz(header: { menuler?: KayitliMenu[]; ustMenu?: UstMenuOgesi[] }): KayitliMenu[] {
  return header.menuler?.length ? header.menuler : [{ id: 'ana-menu', ad: 'Ana Menü', ogeler: header.ustMenu ?? [] }];
}

function normalize(menu: UstMenuOgesi[]): UstMenuOgesi[] {
  const ids = new Set(menu.map((o) => o.id));
  const temiz = menu.map((o) => ({
    ...o,
    gorunur: o.gorunur !== false,
    ustOgeId: o.ustOgeId && ids.has(o.ustOgeId) && o.ustOgeId !== o.id ? o.ustOgeId : null,
  }));
  const gruplar = new Map<string | null, UstMenuOgesi[]>();
  for (const oge of temiz) {
    const anahtar = oge.ustOgeId ?? null;
    gruplar.set(anahtar, [...(gruplar.get(anahtar) ?? []), oge]);
  }
  return [...gruplar.values()].flatMap((grup) =>
    grup.sort((a, b) => a.sira - b.sira).map((oge, sira) => ({ ...oge, sira }))
  );
}

function duzListe(menu: UstMenuOgesi[]): DuzSatir[] {
  const sirali = normalize(menu);
  const altlar = new Map<string | null, UstMenuOgesi[]>();
  for (const oge of sirali) altlar.set(oge.ustOgeId ?? null, [...(altlar.get(oge.ustOgeId ?? null) ?? []), oge]);
  const dal = (ust: string | null, derinlik: number, gorulen: Set<string>): DuzSatir[] =>
    [...(altlar.get(ust) ?? [])].sort((a, b) => a.sira - b.sira).flatMap((oge) => {
      if (gorulen.has(oge.id)) return [];
      const sonraki = new Set(gorulen).add(oge.id);
      return [{ oge, derinlik }, ...dal(oge.id, derinlik + 1, sonraki)];
    });
  return dal(null, 0, new Set());
}

function altSoyMu(menu: UstMenuOgesi[], adayUstId: string, id: string): boolean {
  let ust = menu.find((o) => o.id === adayUstId)?.ustOgeId ?? null;
  while (ust) {
    if (ust === id) return true;
    ust = menu.find((o) => o.id === ust)?.ustOgeId ?? null;
  }
  return false;
}

export function AnaMenuYonetimiPanel({ menuSekmeleri }: { menuSekmeleri?: ReactNode }) {
  const { ayarlar, headerAyarlari, headerGuncelle, kaydet, kaydediliyor } = useSiteAyarlariYonetimi();
  const footerAyarlari = useMemo(() => footerAyarlariBirlestir(ayarlar), [ayarlar]);
  const [sayfalar, setSayfalar] = useState<AdminSayfa[]>([]);
  const [kategoriler, setKategoriler] = useState<NavKategoriKayit[]>([]);
  const [bloglar, setBloglar] = useState<AdminBlog[]>([]);
  const [formlar, setFormlar] = useState<AdminForm[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaynak, setKaynak] = useState<KaynakSekmesi>('sayfalar');
  const [arama, setArama] = useState('');
  const [seciliKaynakIdleri, setSeciliKaynakIdleri] = useState<string[]>([]);
  const [suruklenenId, setSuruklenenId] = useState<string | null>(null);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [ozelBaslik, setOzelBaslik] = useState('');
  const [ozelUrl, setOzelUrl] = useState('');
  const [mobilOnizleme, setMobilOnizleme] = useState(false);
  const [onizlemeAcik, setOnizlemeAcik] = useState(false);
  const [tercihlerAcik, setTercihlerAcik] = useState(false);
  const [kaynaklar, setKaynaklar] = useState<KaynakGorunurluk>(() => {
    try { return { ...VARSAYILAN_KAYNAKLAR, ...JSON.parse(localStorage.getItem('gt-menu-kaynaklari') ?? '{}') }; } catch { return VARSAYILAN_KAYNAKLAR; }
  });
  const [menu, setMenu] = useState<UstMenuOgesi[]>(() => normalize(headerAyarlari.ustMenu ?? []));
  const [menuListesi, setMenuListesi] = useState<KayitliMenu[]>(() => menuleriCoz(headerAyarlari));
  const [seciliMenuId, setSeciliMenuId] = useState(() => headerAyarlari.menuKonumlari?.header ?? menuleriCoz(headerAyarlari)[0].id);
  const [konumlar, setKonumlar] = useState(() => ({ header: headerAyarlari.menuKonumlari?.header ?? seciliMenuId, footer: headerAyarlari.menuKonumlari?.footer ?? '', footerKolonId: headerAyarlari.menuKonumlari?.footerKolonId ?? '', mobil: headerAyarlari.menuKonumlari?.mobil ?? seciliMenuId }));
  const [menuModal, setMenuModal] = useState<'yeni' | 'adlandir' | null>(null);
  const [menuAdiTaslak, setMenuAdiTaslak] = useState('');
  const [menuSilOnayAcik, setMenuSilOnayAcik] = useState(false);

  useEffect(() => {
    const liste = menuleriCoz(headerAyarlari);
    setMenuListesi(liste); const id = headerAyarlari.menuKonumlari?.header ?? liste[0].id;
    setSeciliMenuId(id); setMenu(normalize(liste.find((m) => m.id === id)?.ogeler ?? []));
    setKonumlar({ header: headerAyarlari.menuKonumlari?.header ?? id, footer: headerAyarlari.menuKonumlari?.footer ?? '', footerKolonId: headerAyarlari.menuKonumlari?.footerKolonId ?? '', mobil: headerAyarlari.menuKonumlari?.mobil ?? id });
  }, [headerAyarlari]);

  useEffect(() => {
    void (async () => {
      try {
        const [sayfaVerisi, kategoriVerisi, blogVerisi, formVerisi] = await Promise.all([adminSayfalariGetir(), navKategorileriGetir(), adminBloglariGetir(), adminFormlariGetir()]);
        setSayfalar(sayfaVerisi);
        setKategoriler(kategoriVerisi);
        setBloglar(blogVerisi);
        setFormlar(formVerisi);
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Menü kaynakları yüklenemedi.');
      } finally {
        setYukleniyor(false);
      }
    })();
  }, []);

  useEffect(() => { localStorage.setItem('gt-menu-kaynaklari', JSON.stringify(kaynaklar)); }, [kaynaklar]);

  const degistir = useCallback((sonraki: UstMenuOgesi[]) => {
    const normalizeEdilmis = normalize(sonraki); setMenu(normalizeEdilmis);
    setMenuListesi((liste) => liste.map((m) => m.id === seciliMenuId ? { ...m, ogeler: normalizeEdilmis } : m));
    setBasari('');
  }, [seciliMenuId]);
  const duz = useMemo(() => duzListe(menu), [menu]);
  const menudekiSayfaIdleri = useMemo(() => new Set(menu.filter((o) => o.tip === 'sayfa').map((o) => o.sayfaId)), [menu]);
  const filtre = arama.trim().toLocaleLowerCase('tr');
  const gorunenKaynakIdleri = useMemo(() => {
    if (kaynak === 'sayfalar') return sayfalar.filter((s) => s.yayinda && !menudekiSayfaIdleri.has(s.id) && (!filtre || s.baslik.toLocaleLowerCase('tr').includes(filtre))).map((s) => s.id);
    if (kaynak === 'kategoriler') return kategoriler.filter((k) => k.aktif && (!filtre || k.baslik.toLocaleLowerCase('tr').includes(filtre))).map((k) => k.id);
    if (kaynak === 'bloglar') return bloglar.filter((b) => b.yayinda && (!filtre || b.baslik.toLocaleLowerCase('tr').includes(filtre))).map((b) => b.id);
    if (kaynak === 'formlar') return formlar.filter((f) => f.aktif && (!filtre || f.ad.toLocaleLowerCase('tr').includes(filtre))).map((f) => f.id);
    return [];
  }, [bloglar, filtre, formlar, kategoriler, kaynak, menudekiSayfaIdleri, sayfalar]);

  const ekle = (oge: UstMenuOgesi) => degistir([...menu, oge]);
  const ozelEkle = () => {
    if (!ozelBaslik.trim() || !menuLinkGecerliMi(ozelUrl)) {
      setHata('Özel bağlantı için başlık ve geçerli bir URL girin. (/iletisim, #bolum, https://... gibi)');
      return;
    }
    ekle({ id: yeniMenuId(), ad: ozelBaslik.trim(), link: ozelUrl.trim(), yeniSekme: false, gorunur: true, tip: 'ozel_link', ustOgeId: null, sira: menu.length });
    setOzelBaslik(''); setOzelUrl(''); setHata('');
  };
  const kaynakSeciminiDegistir = (id: string, secili: boolean) => setSeciliKaynakIdleri((mevcut) => secili ? [...mevcut, id] : mevcut.filter((mevcutId) => mevcutId !== id));
  const gorunenlerinSeciminiDegistir = () => {
    const tumuSecili = gorunenKaynakIdleri.length > 0 && gorunenKaynakIdleri.every((id) => seciliKaynakIdleri.includes(id));
    setSeciliKaynakIdleri((mevcut) => tumuSecili ? mevcut.filter((id) => !gorunenKaynakIdleri.includes(id)) : [...new Set([...mevcut, ...gorunenKaynakIdleri])]);
  };
  const secilenleriMenuyeEkle = () => {
    if (seciliKaynakIdleri.length === 0) return;
    const secili = new Set(seciliKaynakIdleri);
    const ekler: UstMenuOgesi[] = kaynak === 'sayfalar'
      ? sayfalar.filter((sayfa) => secili.has(sayfa.id) && sayfa.yayinda && !menudekiSayfaIdleri.has(sayfa.id)).map((sayfa, sira) => ({ id: yeniMenuId(), ad: sayfa.baslik, link: sayfaYolunuBul(sayfa.slug), sayfaId: sayfa.id, yeniSekme: false, gorunur: true, tip: 'sayfa', ustOgeId: null, sira: menu.length + sira }))
      : kaynak === 'kategoriler'
        ? kategoriler.filter((kategori) => secili.has(kategori.id) && kategori.aktif).map((kategori, sira) => ({ id: yeniMenuId(), ad: kategori.baslik, link: kategori.yol?.trim() || `/kategori/${kategori.slug}`, yeniSekme: false, gorunur: true, tip: 'kategori', ustOgeId: null, sira: menu.length + sira }))
        : kaynak === 'bloglar'
          ? bloglar.filter((blog) => secili.has(blog.id) && blog.yayinda).map((blog, sira) => ({ id: yeniMenuId(), ad: blog.baslik, link: `/blog/${blog.slug}`, yeniSekme: false, gorunur: true, tip: 'ozel_link', ustOgeId: null, sira: menu.length + sira }))
          : formlar.filter((form) => secili.has(form.id) && form.aktif).map((form, sira) => ({ id: yeniMenuId(), ad: form.ad, link: `/form/${form.slug}`, yeniSekme: false, gorunur: true, tip: 'ozel_link', ustOgeId: null, sira: menu.length + sira }));
    if (ekler.length) degistir([...menu, ...ekler]);
    setSeciliKaynakIdleri([]);
  };

  const guncelle = (id: string, parca: Partial<UstMenuOgesi>) => degistir(menu.map((o) => o.id === id ? { ...o, ...parca } : o));
  const sil = (id: string) => {
    const silinecek = new Set<string>([id]);
    let degisti = true;
    while (degisti) {
      degisti = false;
      for (const oge of menu) if (oge.ustOgeId && silinecek.has(oge.ustOgeId) && !silinecek.has(oge.id)) { silinecek.add(oge.id); degisti = true; }
    }
    degistir(menu.filter((o) => !silinecek.has(o.id)));
  };

  const birak = (hedefId: string, event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const suruklenen = menu.find((o) => o.id === suruklenenId);
    const hedef = menu.find((o) => o.id === hedefId);
    setSuruklenenId(null);
    if (!suruklenen || !hedef || suruklenen.id === hedef.id || altSoyMu(menu, hedef.id, suruklenen.id)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const altina = event.clientX > rect.left + 56;
    const yeniUst = altina ? hedef.id : hedef.ustOgeId ?? null;
    const kalan = menu.filter((o) => o.id !== suruklenen.id);
    const kardesler = kalan.filter((o) => (o.ustOgeId ?? null) === yeniUst);
    const hedefSira = altina ? kardesler.length : Math.max(0, kardesler.findIndex((o) => o.id === hedef.id) + (event.clientY > rect.top + rect.height / 2 ? 1 : 0));
    const yerlestirilmis = kalan.map((o) => o.id === suruklenen.id ? o : o);
    yerlestirilmis.push({ ...suruklenen, ustOgeId: yeniUst, sira: hedefSira });
    const sonuc = yerlestirilmis.map((o) => {
      if ((o.ustOgeId ?? null) !== yeniUst || o.id === suruklenen.id) return o;
      const eskiSira = o.sira;
      return eskiSira >= hedefSira ? { ...o, sira: eskiSira + 1 } : o;
    });
    degistir(sonuc);
  };

  const kaydetMenu = async () => {
    setHata(''); setBasari('');
    try {
      const menuler = menuListesi.map((m) => m.id === seciliMenuId ? { ...m, ogeler: normalize(menu) } : m);
      const headerMenu = menuler.find((m) => m.id === (konumlar.header || seciliMenuId));
      const header = { ...headerAyarlari, ustMenu: headerMenu?.ogeler ?? normalize(menu), menuler, menuKonumlari: { header: konumlar.header || null, footer: konumlar.footer || null, footerKolonId: konumlar.footer && konumlar.footerKolonId ? konumlar.footerKolonId : null, mobil: konumlar.mobil || null } };
      headerGuncelle(header);
      await kaydet({ header });
      setBasari('Ana menü kaydedildi.');
    } catch (err) { setHata(err instanceof Error ? err.message : 'Menü kaydedilemedi.'); }
  };

  const menuSec = (id: string) => { setSeciliMenuId(id); setMenu(normalize(menuListesi.find((m) => m.id === id)?.ogeler ?? [])); };
  const menuOlustur = () => { setMenuAdiTaslak(''); setMenuModal('yeni'); };
  const menuYenidenAdlandir = () => { setMenuAdiTaslak(menuListesi.find((m) => m.id === seciliMenuId)?.ad ?? ''); setMenuModal('adlandir'); };
  const menuModalKaydet = () => { if (!menuAdiTaslak.trim()) return; if (menuModal === 'yeni') { const yeni = { id: yeniMenuId(), ad: menuAdiTaslak.trim(), ogeler: [] }; setMenuListesi((l) => [...l, yeni]); setSeciliMenuId(yeni.id); setMenu([]); } else { setMenuListesi((l) => l.map((m) => m.id === seciliMenuId ? { ...m, ad: menuAdiTaslak.trim() } : m)); } setMenuModal(null); };
  const menuSilTalep = () => { if (menuListesi.length > 1) setMenuSilOnayAcik(true); };
  const menuSilOnayla = () => { const kalan = menuListesi.filter((m) => m.id !== seciliMenuId); if (!kalan.length) return; const sonraki = kalan[0].id; setMenuListesi(kalan); setSeciliMenuId(sonraki); setMenu(normalize(kalan[0].ogeler)); setKonumlar((k) => ({ header: k.header === seciliMenuId ? sonraki : k.header, footer: k.footer === seciliMenuId ? '' : k.footer, footerKolonId: k.footer === seciliMenuId ? '' : k.footerKolonId, mobil: k.mobil === seciliMenuId ? sonraki : k.mobil })); setMenuSilOnayAcik(false); };

  useEffect(() => {
    const dinleyiciler: Array<[string, () => void]> = [
      ['ap-ana-menu-kaydet', () => { void kaydetMenu(); }],
      ['ap-ana-menu-yeni', menuOlustur],
      ['ap-ana-menu-adlandir', menuYenidenAdlandir],
      ['ap-ana-menu-sil', menuSilTalep],
      ['ap-ana-menu-onizle', () => setOnizlemeAcik(true)],
    ];
    dinleyiciler.forEach(([ad, dinleyici]) => window.addEventListener(ad, dinleyici));
    return () => dinleyiciler.forEach(([ad, dinleyici]) => window.removeEventListener(ad, dinleyici));
  }, [menu, menuListesi, seciliMenuId, konumlar, headerAyarlari]);

  // Ana Menü açıkken ortak çubuktan yeni menü oluşturulabilir; öğe düzenleme
  // işlemleri doğrudan menü yapısı kartlarında kalır.
  useModulAksiyonlari(
    { kaydet: kaydetMenu, ekle: menuOlustur, sil: menuSilTalep, duzenle: menuYenidenAdlandir, onizle: () => setOnizlemeAcik(true) },
    { kaydet: !kaydediliyor, ekle: true, sil: menuListesi.length > 1, duzenle: true, onizle: true, gizli: ANA_MENU_GIZLI_AKSIYONLAR }
  );

  if (yukleniyor) return <YukleniyorDurumu mesaj="Ana menü yükleniyor..." />;

  return <div className="space-y-4">
    {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
    {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--ap-border)] bg-[var(--ap-panel)] p-4">
      <div><select value={seciliMenuId} onChange={(e) => menuSec(e.target.value)} className="rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-2 py-1.5 text-sm">{menuListesi.map((m) => <option key={m.id} value={m.id}>{m.ad}</option>)}</select></div>
      <div className="relative flex shrink-0 items-center gap-3"><div><button type="button" onClick={() => setTercihlerAcik((v) => !v)} className="rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-3 py-2 text-xs font-medium">Ekran Tercihleri ▾</button>{tercihlerAcik && <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] p-3 shadow-2xl ring-1 ring-black/20"><p className="ap-muted mb-2 text-xs">Sol kaynak panelinde görünecek alanlar</p>{(Object.entries({ sayfalar: 'Sayfalar', kategoriler: 'Kategoriler', bloglar: 'Blog yazıları', formlar: 'Formlar', 'ozel-link': 'Özel bağlantı' }) as [KaynakSekmesi, string][]).map(([id, etiket]) => <label key={id} className="flex cursor-pointer items-center justify-between py-1.5 text-sm"><span>{etiket}</span><input type="checkbox" checked={kaynaklar[id]} onChange={(e) => { const sonraki = { ...kaynaklar, [id]: e.target.checked }; setKaynaklar(sonraki); setSeciliKaynakIdleri([]); if (!e.target.checked && kaynak === id) setKaynak('sayfalar'); }} /></label>)}</div>}</div>{menuSekmeleri}</div>
    </div>

    <AdminPanelKarti baslik="Menü konumları" altBaslik="Footer menüsü, seçtiğiniz Footer bağlantı kolonunun içeriğini kullanır; yeni alt şerit oluşturmaz.">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MenuKonumuSecici etiket="Header / bilgisayar menüsü" deger={konumlar.header} secenekler={menuListesi} bosEtiket="Varsayılan menüyü kullan" onDegistir={(header) => setKonumlar((mevcut) => ({ ...mevcut, header }))} />
        <MenuKonumuSecici etiket="Footer / alt bilgi menüsü" deger={konumlar.footer} secenekler={menuListesi} bosEtiket="Footer menüsü kullanma" onDegistir={(footer) => setKonumlar((mevcut) => ({ ...mevcut, footer, footerKolonId: footer ? mevcut.footerKolonId : '' }))} />
        <label className="block text-xs font-medium">
          Footer’da kullanılacak bağlantı kolonu
          <select value={konumlar.footerKolonId} disabled={!konumlar.footer} onChange={(e) => setKonumlar((mevcut) => ({ ...mevcut, footerKolonId: e.target.value }))} className="mt-1 w-full rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-2 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
            <option value="">Kolon seçin</option>
            {footerAyarlari.kolonlar.filter((kolon) => kolon.aktif).sort((a, b) => a.sira - b.sira).map((kolon) => <option key={kolon.id} value={kolon.id}>{kolon.baslik}</option>)}
          </select>
          <span className="ap-muted mt-1 block font-normal">Seçilen menü sadece bu kolonu besler.</span>
        </label>
        <MenuKonumuSecici etiket="Mobil / hamburger menüsü" deger={konumlar.mobil} secenekler={menuListesi} bosEtiket="Varsayılan menüyü kullan" onDegistir={(mobil) => setKonumlar((mevcut) => ({ ...mevcut, mobil }))} />
      </div>
    </AdminPanelKarti>

    <div className="grid gap-4 xl:grid-cols-[minmax(250px,0.8fr)_minmax(0,1.5fr)]">
      <AdminPanelKarti baslik="Menü öğesi ekle" altBaslik="WordPress tarzı kaynak panelleri">
        <div className="mb-3 flex gap-1 border-b border-[var(--ap-border)] text-xs">
          {(['sayfalar', 'kategoriler', 'bloglar', 'formlar', 'ozel-link'] as KaynakSekmesi[]).filter((id) => kaynaklar[id]).map((id) => <button key={id} type="button" onClick={() => { setKaynak(id); setSeciliKaynakIdleri([]); }} className={`px-2 py-2 font-medium ${kaynak === id ? 'border-b-2 border-[var(--ap-accent)] text-[var(--ap-accent)]' : 'ap-muted'}`}>{id === 'sayfalar' ? 'Sayfalar' : id === 'kategoriler' ? 'Kategoriler' : id === 'bloglar' ? 'Blog' : id === 'formlar' ? 'Formlar' : 'Özel bağlantı'}</button>)}
        </div>
        {kaynak !== 'ozel-link' && <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Ara..." />}
        {kaynak !== 'ozel-link' && <div className="mt-3 flex items-center justify-between gap-2"><span className="ap-muted text-xs">Arama sonucundaki uygun kayıtlar</span><button type="button" onClick={gorunenlerinSeciminiDegistir} disabled={gorunenKaynakIdleri.length === 0} className="rounded-md border border-[var(--ap-border)] px-2 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40">{gorunenKaynakIdleri.length > 0 && gorunenKaynakIdleri.every((id) => seciliKaynakIdleri.includes(id)) ? 'Seçimi kaldır' : 'Tümünü seç'}</button></div>}
        {kaynak === 'sayfalar' && <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">{sayfalar.filter((s) => s.yayinda && (!filtre || s.baslik.toLocaleLowerCase('tr').includes(filtre))).map((s) => <label key={s.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--ap-border)] p-2"><input type="checkbox" checked={seciliKaynakIdleri.includes(s.id)} disabled={menudekiSayfaIdleri.has(s.id)} onChange={(e) => kaynakSeciminiDegistir(s.id, e.target.checked)} /><div className="min-w-0"><p className="ap-heading truncate text-sm">{s.baslik}</p><p className="ap-muted truncate text-xs">{sayfaYolunuBul(s.slug)}</p></div><span className="ap-muted ml-auto text-xs">{menudekiSayfaIdleri.has(s.id) ? 'Eklendi' : 'Seç'}</span></label>)}{sayfalar.filter((s) => s.yayinda).length === 0 && <p className="ap-muted text-sm">Yayındaki sayfa bulunmuyor.</p>}</div>}
        {kaynak === 'kategoriler' && <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">{kategoriler.filter((k) => k.aktif && (!filtre || k.baslik.toLocaleLowerCase('tr').includes(filtre))).map((k) => <label key={k.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--ap-border)] p-2"><input type="checkbox" checked={seciliKaynakIdleri.includes(k.id)} onChange={(e) => kaynakSeciminiDegistir(k.id, e.target.checked)} /><div className="min-w-0"><p className="ap-heading truncate text-sm">{k.baslik}</p><p className="ap-muted truncate text-xs">{k.yol || `/kategori/${k.slug}`}</p></div><span className="ap-muted ml-auto text-xs">Seç</span></label>)}{kategoriler.length === 0 && <p className="ap-muted text-sm">Kategori menüsünde kayıt yok.</p>}</div>}
        {kaynak === 'bloglar' && <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">{bloglar.filter((b) => b.yayinda && (!filtre || b.baslik.toLocaleLowerCase('tr').includes(filtre))).map((b) => <label key={b.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--ap-border)] p-2"><input type="checkbox" checked={seciliKaynakIdleri.includes(b.id)} onChange={(e) => kaynakSeciminiDegistir(b.id, e.target.checked)} /><div className="min-w-0"><p className="ap-heading truncate text-sm">{b.baslik}</p><p className="ap-muted truncate text-xs">/blog/{b.slug}</p></div><span className="ap-muted ml-auto text-xs">Seç</span></label>)}</div>}
        {kaynak === 'formlar' && <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">{formlar.filter((f) => f.aktif && (!filtre || f.ad.toLocaleLowerCase('tr').includes(filtre))).map((f) => <label key={f.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--ap-border)] p-2"><input type="checkbox" checked={seciliKaynakIdleri.includes(f.id)} onChange={(e) => kaynakSeciminiDegistir(f.id, e.target.checked)} /><div className="min-w-0"><p className="ap-heading truncate text-sm">{f.ad}</p><p className="ap-muted truncate text-xs">/form/{f.slug}</p></div><span className="ap-muted ml-auto text-xs">Seç</span></label>)}</div>}
        {kaynak === 'ozel-link' && <div className="mt-3 space-y-3"><label className="block text-xs font-medium">Menü başlığı<input value={ozelBaslik} onChange={(e) => setOzelBaslik(e.target.value)} className="mt-1 w-full rounded-lg border border-[var(--ap-border)] bg-transparent px-3 py-2 text-sm" placeholder="Örn. WhatsApp" /></label><label className="block text-xs font-medium">URL<input value={ozelUrl} onChange={(e) => setOzelUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-[var(--ap-border)] bg-transparent px-3 py-2 text-sm" placeholder="https:// veya /iletisim" /></label><button type="button" onClick={ozelEkle} className="rounded-lg border border-[var(--ap-border)] px-3 py-2 text-sm font-medium">Menüye ekle</button></div>}
        {kaynak !== 'ozel-link' && <div className="mt-4 flex items-center justify-between border-t border-[var(--ap-border)] pt-3"><span className="ap-muted text-xs">{seciliKaynakIdleri.length} öğe seçildi</span><button type="button" onClick={secilenleriMenuyeEkle} disabled={seciliKaynakIdleri.length === 0} className="rounded-lg bg-[var(--ap-accent)] px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40">Menüye ekle</button></div>}
      </AdminPanelKarti>

      <AdminPanelKarti baslik="Menü yapısı" altBaslik="Sağa bırak: alt menü. Aynı hizada bırak: sıralama.">
        <div className="space-y-2">{duz.length === 0 ? <div className="rounded-lg border border-dashed border-[var(--ap-border)] p-8 text-center ap-muted text-sm">Soldan sayfa, kategori veya özel bağlantı ekleyin.</div> : duz.map(({ oge, derinlik }) => <div key={oge.id} draggable onDragStart={() => setSuruklenenId(oge.id)} onDragEnd={() => setSuruklenenId(null)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => birak(oge.id, e)} className={`rounded-lg border border-[var(--ap-border)] bg-[var(--ap-panel)] p-3 ${suruklenenId === oge.id ? 'opacity-50' : ''}`} style={{ marginLeft: `${Math.min(derinlik, 4) * 22}px` }}><div className="flex items-start gap-2"><span className="cursor-grab select-none pt-1 ap-muted" aria-label="Sürükle">⠿</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><input value={oge.ad} onChange={(e) => guncelle(oge.id, { ad: e.target.value })} className="min-w-32 flex-1 bg-transparent text-sm font-semibold outline-none" aria-label="Menü başlığı" /><AdminDurumEtiketi tur={oge.tip === 'sayfa' ? 'menu' : oge.tip === 'kategori' ? 'aktif' : 'bilgi'}>{oge.tip === 'sayfa' ? 'Sayfa' : oge.tip === 'kategori' ? 'Kategori' : 'Özel link'}</AdminDurumEtiketi></div><input value={oge.link} onChange={(e) => guncelle(oge.id, { link: e.target.value, tip: oge.sayfaId ? 'sayfa' : oge.tip })} className="ap-muted mt-1 w-full bg-transparent text-xs outline-none" aria-label="Bağlantı adresi" /></div><div className="flex flex-wrap items-center justify-end gap-2"><AdminAnahtarDugme etiket="Yeni sekme" acik={oge.yeniSekme} onDegistir={(v) => guncelle(oge.id, { yeniSekme: v })} /><AdminAnahtarDugme etiket="Göster" acik={oge.gorunur !== false} onDegistir={(v) => guncelle(oge.id, { gorunur: v })} /><button type="button" onClick={() => sil(oge.id)} className="text-xs font-medium text-red-600">Sil</button></div></div></div>)}</div>
      </AdminPanelKarti>
    </div>

    <MenuOnizlemeModal acik={onizlemeAcik} mobil={mobilOnizleme} menu={menu} onKapat={() => setOnizlemeAcik(false)} onModDegistir={setMobilOnizleme} />
    <MenuSilModal acik={menuSilOnayAcik} menuAd={menuListesi.find((m) => m.id === seciliMenuId)?.ad ?? ''} onKapat={() => setMenuSilOnayAcik(false)} onOnayla={menuSilOnayla} />
    <MenuAdModal acik={menuModal !== null} kip={menuModal} deger={menuAdiTaslak} onDegerDegistir={setMenuAdiTaslak} onKapat={() => setMenuModal(null)} onKaydet={menuModalKaydet} />
  </div>;
}

function MenuSilModal({ acik, menuAd, onKapat, onOnayla }: { acik: boolean; menuAd: string; onKapat: () => void; onOnayla: () => void }) {
  useEffect(() => {
    if (!acik) return;
    const tusHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onKapat(); }
      if (event.key === 'Enter') { event.preventDefault(); onOnayla(); }
    };
    document.addEventListener('keydown', tusHandler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', tusHandler); document.body.style.overflow = ''; };
  }, [acik, onKapat, onOnayla]);

  if (!acik) return null;
  return <div className="ap-yap-modal-arka" role="presentation">
    <div className="erp-donen-cerceve erp-donen-cerceve-surekli">
      <span className="erp-donen-cerceve-iz" />
      <div className="erp-donen-cerceve-icerik">
        <div className="ap-yap-sil-modal" role="alertdialog" aria-modal="true" aria-labelledby="menu-sil-baslik">
          <header><span className="ap-yap-sil-uyari"><IconAlertTriangle size={19} /></span><h2 id="menu-sil-baslik">Bu menüyü silmek istiyor musunuz?</h2><button type="button" onClick={onKapat}><IconX size={15} /> ESC</button></header>
          <p><strong>{menuAd}</strong> menü taslağından kaldırılacak. Değişikliğin kalıcı olması için ardından Kaydet&apos;e basmanız gerekir.</p>
          <footer><button type="button" onClick={onKapat}>Vazgeç<small>(ESC)</small></button><button type="button" onClick={onOnayla}>Evet, Sil<small>(ENTER)</small></button></footer>
        </div>
      </div>
    </div>
  </div>;
}

function MenuAdModal({ acik, kip, deger, onDegerDegistir, onKapat, onKaydet }: { acik: boolean; kip: 'yeni' | 'adlandir' | null; deger: string; onDegerDegistir: (deger: string) => void; onKapat: () => void; onKaydet: () => void }) {
  useEffect(() => {
    if (!acik) return;
    const tusHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onKapat(); }
      if (event.key === 'Enter') { event.preventDefault(); onKaydet(); }
    };
    document.addEventListener('keydown', tusHandler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', tusHandler); document.body.style.overflow = ''; };
  }, [acik, onKapat, onKaydet]);

  if (!acik || !kip) return null;
  const yeni = kip === 'yeni';
  return <div className="ap-yap-modal-arka" role="presentation">
    <div className="erp-donen-cerceve erp-donen-cerceve-surekli">
      <span className="erp-donen-cerceve-iz" />
      <div className="erp-donen-cerceve-icerik">
        <div className="ap-yap-form-modal" role="dialog" aria-modal="true" aria-labelledby="menu-ad-baslik">
          <header><h2 id="menu-ad-baslik">{yeni ? 'Yeni Menü Oluştur' : 'Menüyü Yeniden Adlandır'}</h2><button type="button" onClick={onKapat}><IconX size={15} /> ESC</button></header>
          <div><p>Menü adı ziyaretçilere değil, yönetim ekranına görünür.</p><label>Menü adı<input autoFocus value={deger} onChange={(event) => onDegerDegistir(event.target.value)} /></label></div>
          <footer><button type="button" onClick={onKapat}>Vazgeç<small>(ESC)</small></button><button type="button" onClick={onKaydet}>{yeni ? 'Menüyü Oluştur' : 'Kaydet'}<small>(ENTER)</small></button></footer>
        </div>
      </div>
    </div>
  </div>;
}

function MenuKonumuSecici({ etiket, deger, secenekler, bosEtiket, onDegistir }: { etiket: string; deger: string; secenekler: KayitliMenu[]; bosEtiket: string; onDegistir: (deger: string) => void }) {
  return <label className="block text-xs font-medium">
    {etiket}
    <select value={deger} onChange={(e) => onDegistir(e.target.value)} className="mt-1 w-full rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-2 py-2 text-sm">
      <option value="">{bosEtiket}</option>
      {secenekler.map((kayitliMenu) => <option key={kayitliMenu.id} value={kayitliMenu.id}>{kayitliMenu.ad}</option>)}
    </select>
  </label>;
}

function MenuOnizlemeModal({ acik, mobil, menu, onKapat, onModDegistir }: { acik: boolean; mobil: boolean; menu: UstMenuOgesi[]; onKapat: () => void; onModDegistir: (mobil: boolean) => void }) {
  useEffect(() => {
    if (!acik) return;
    const kapat = (e: KeyboardEvent) => { if (e.key === 'Escape') onKapat(); };
    document.addEventListener('keydown', kapat); document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', kapat); document.body.style.overflow = ''; };
  }, [acik, onKapat]);
  if (!acik) return null;
  return <div className="ap-admin-modal-overlay" role="dialog" aria-modal="true" aria-label="Menü önizleme"><button type="button" className="ap-admin-modal-backdrop" aria-label="Kapat" onClick={onKapat} /><div className="ap-admin-modal ap-admin-modal-genis"><header className="ap-admin-modal-header"><div><h2 className="ap-admin-modal-baslik">Menü önizleme</h2><p className="ap-admin-modal-alt">Header'da masaüstü ve mobil görünüm</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => onModDegistir(false)} className={`rounded-md px-2 py-1 text-xs ${!mobil ? 'bg-[var(--ap-accent)] text-white' : 'border border-[var(--ap-border)]'}`}>Masaüstü</button><button type="button" onClick={() => onModDegistir(true)} className={`rounded-md px-2 py-1 text-xs ${mobil ? 'bg-[var(--ap-accent)] text-white' : 'border border-[var(--ap-border)]'}`}>Mobil</button><button type="button" className="ap-admin-modal-kapat" onClick={onKapat}>× ESC</button></div></header><div className="p-6"><div className={`rounded-xl border border-[var(--ap-border)] bg-slate-900 p-4 text-white ${mobil ? 'mx-auto max-w-sm' : ''}`}><div className="mb-3 flex items-center justify-between border-b border-white/20 pb-3"><strong>{mobil ? '☰ Menü' : 'Site Adı'}</strong>{!mobil && <span className="text-xs text-white/60">Header önizlemesi</span>}</div><OnizlemeDali ogeler={menu.filter((o) => !o.ustOgeId)} tumMenu={menu} mobil={mobil} /></div></div></div></div>;
}

function OnizlemeDali({ ogeler, tumMenu, mobil }: { ogeler: UstMenuOgesi[]; tumMenu: UstMenuOgesi[]; mobil: boolean }) {
  return <div className={mobil ? 'space-y-2' : 'flex flex-wrap gap-x-5 gap-y-2'}>{[...ogeler].filter((o) => o.gorunur !== false).sort((a, b) => a.sira - b.sira).map((oge) => { const alt = tumMenu.filter((o) => o.ustOgeId === oge.id); return <div key={oge.id} className={mobil ? 'rounded-md bg-white/10 p-2' : 'text-sm'}><span>{oge.ad}{oge.yeniSekme && ' ↗'}{alt.some((o) => o.gorunur !== false) && ' ▾'}</span>{mobil && alt.length > 0 && <div className="ml-3 mt-2 border-l border-white/20 pl-3"><OnizlemeDali ogeler={alt} tumMenu={tumMenu} mobil /></div>}</div>; })}</div>;
}
