import { useCallback, useEffect, useMemo, useState, type DragEvent, type ReactNode } from 'react';
import { AdminPanelKarti, BildirimKutusu, YukleniyorDurumu } from '@/components/admin/ortak/AdminBilesenleri';
import { AdminAnahtarDugme, AdminAramaKutusu, AdminDurumEtiketi } from '@/components/admin/ortak/AdminFormBilesenleri';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { adminSayfalariGetir, type AdminSayfa } from '@/features/admin/sayfaApi';
import { navKategorileriGetir } from '@/features/admin/navKategoriApi';
import { adminBloglariGetir, type AdminBlog } from '@/features/admin/blogApi';
import { adminFormlariGetir, type AdminForm } from '@/features/admin/formApi';
import type { NavKategoriKayit } from '@/types/navKategori';
import type { UstMenuOgesi } from '@/types/header';
import { sayfaYolunuBul } from '@/data/bosSiteVerisi';
import { menuLinkGecerliMi, yeniMenuId } from '@/utils/menuYardimci';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';

type KaynakSekmesi = 'sayfalar' | 'kategoriler' | 'bloglar' | 'formlar' | 'ozel-link';
type DuzSatir = { oge: UstMenuOgesi; derinlik: number };
type KaynakGorunurluk = Record<KaynakSekmesi, boolean>;
const VARSAYILAN_KAYNAKLAR: KaynakGorunurluk = { sayfalar: true, kategoriler: true, bloglar: false, formlar: false, 'ozel-link': true };

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
  const { headerAyarlari, headerGuncelle, kaydet, kaydediliyor } = useSiteAyarlariYonetimi();
  const [sayfalar, setSayfalar] = useState<AdminSayfa[]>([]);
  const [kategoriler, setKategoriler] = useState<NavKategoriKayit[]>([]);
  const [bloglar, setBloglar] = useState<AdminBlog[]>([]);
  const [formlar, setFormlar] = useState<AdminForm[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaynak, setKaynak] = useState<KaynakSekmesi>('sayfalar');
  const [arama, setArama] = useState('');
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

  useEffect(() => setMenu(normalize(headerAyarlari.ustMenu ?? [])), [headerAyarlari.ustMenu]);

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
    setMenu(normalize(sonraki));
    setBasari('');
  }, []);
  const duz = useMemo(() => duzListe(menu), [menu]);
  const menudekiSayfaIdleri = useMemo(() => new Set(menu.filter((o) => o.tip === 'sayfa').map((o) => o.sayfaId)), [menu]);
  const filtre = arama.trim().toLocaleLowerCase('tr');

  const ekle = (oge: UstMenuOgesi) => degistir([...menu, oge]);
  const sayfaEkle = (sayfa: AdminSayfa) => ekle({
    id: yeniMenuId(), ad: sayfa.baslik, link: sayfaYolunuBul(sayfa.slug), sayfaId: sayfa.id,
    yeniSekme: false, gorunur: true, tip: 'sayfa', ustOgeId: null, sira: menu.filter((o) => !o.ustOgeId).length,
  });
  const kategoriEkle = (kategori: NavKategoriKayit) => ekle({
    id: yeniMenuId(), ad: kategori.baslik, link: kategori.yol?.trim() || `/kategori/${kategori.slug}`,
    yeniSekme: false, gorunur: true, tip: 'kategori', ustOgeId: null, sira: menu.filter((o) => !o.ustOgeId).length,
  });
  const blogEkle = (blog: AdminBlog) => ekle({ id: yeniMenuId(), ad: blog.baslik, link: `/blog/${blog.slug}`, yeniSekme: false, gorunur: true, tip: 'ozel_link', ustOgeId: null, sira: menu.length });
  const formEkle = (form: AdminForm) => ekle({ id: yeniMenuId(), ad: form.ad, link: `/form/${form.slug}`, yeniSekme: false, gorunur: true, tip: 'ozel_link', ustOgeId: null, sira: menu.length });
  const ozelEkle = () => {
    if (!ozelBaslik.trim() || !menuLinkGecerliMi(ozelUrl)) {
      setHata('Özel bağlantı için başlık ve geçerli bir URL girin. (/iletisim, #bolum, https://... gibi)');
      return;
    }
    ekle({ id: yeniMenuId(), ad: ozelBaslik.trim(), link: ozelUrl.trim(), yeniSekme: false, gorunur: true, tip: 'ozel_link', ustOgeId: null, sira: menu.length });
    setOzelBaslik(''); setOzelUrl(''); setHata('');
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
      const header = { ...headerAyarlari, ustMenu: normalize(menu) };
      headerGuncelle(header);
      await kaydet({ header });
      setBasari('Ana menü kaydedildi.');
    } catch (err) { setHata(err instanceof Error ? err.message : 'Menü kaydedilemedi.'); }
  };

  // Ana Menü açıkken alttaki ortak aksiyon çubuğundaki Kaydet bu işlemi çağırır.
  useModulAksiyonlari({ kaydet: kaydetMenu, onizle: () => setOnizlemeAcik(true) }, { kaydet: !kaydediliyor, onizle: true });

  if (yukleniyor) return <YukleniyorDurumu mesaj="Ana menü yükleniyor..." />;

  return <div className="space-y-4">
    {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
    {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
    <div className="flex items-start justify-between gap-3 rounded-xl border border-[var(--ap-border)] bg-[var(--ap-panel)] p-4">
      <div><h2 className="ap-heading text-base font-semibold">Ana Menü</h2><p className="ap-muted mt-1 text-xs">Sayfaları ve bağlantıları sürükleyerek ziyaretçilerin göreceği düzeni oluşturun.</p></div>
      <div className="relative flex shrink-0 items-center gap-3"><div><button type="button" onClick={() => setTercihlerAcik((v) => !v)} className="rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-3 py-2 text-xs font-medium">Ekran Tercihleri ▾</button>{tercihlerAcik && <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] p-3 shadow-2xl ring-1 ring-black/20"><p className="ap-muted mb-2 text-xs">Sol kaynak panelinde görünecek alanlar</p>{(Object.entries({ sayfalar: 'Sayfalar', kategoriler: 'Kategoriler', bloglar: 'Blog yazıları', formlar: 'Formlar', 'ozel-link': 'Özel bağlantı' }) as [KaynakSekmesi, string][]).map(([id, etiket]) => <label key={id} className="flex cursor-pointer items-center justify-between py-1.5 text-sm"><span>{etiket}</span><input type="checkbox" checked={kaynaklar[id]} onChange={(e) => { const sonraki = { ...kaynaklar, [id]: e.target.checked }; setKaynaklar(sonraki); if (!e.target.checked && kaynak === id) setKaynak('sayfalar'); }} /></label>)}</div>}</div>{menuSekmeleri}</div>
    </div>

    <div className="grid gap-4 xl:grid-cols-[minmax(250px,0.8fr)_minmax(0,1.5fr)]">
      <AdminPanelKarti baslik="Menü öğesi ekle" altBaslik="WordPress tarzı kaynak panelleri">
        <div className="mb-3 flex gap-1 border-b border-[var(--ap-border)] text-xs">
          {(['sayfalar', 'kategoriler', 'bloglar', 'formlar', 'ozel-link'] as KaynakSekmesi[]).filter((id) => kaynaklar[id]).map((id) => <button key={id} type="button" onClick={() => setKaynak(id)} className={`px-2 py-2 font-medium ${kaynak === id ? 'border-b-2 border-[var(--ap-accent)] text-[var(--ap-accent)]' : 'ap-muted'}`}>{id === 'sayfalar' ? 'Sayfalar' : id === 'kategoriler' ? 'Kategoriler' : id === 'bloglar' ? 'Blog' : id === 'formlar' ? 'Formlar' : 'Özel bağlantı'}</button>)}
        </div>
        {kaynak !== 'ozel-link' && <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Ara..." />}
        {kaynak === 'sayfalar' && <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">{sayfalar.filter((s) => s.yayinda && (!filtre || s.baslik.toLocaleLowerCase('tr').includes(filtre))).map((s) => <div key={s.id} className="flex items-center justify-between gap-2 rounded-lg border border-[var(--ap-border)] p-2"><div className="min-w-0"><p className="ap-heading truncate text-sm">{s.baslik}</p><p className="ap-muted truncate text-xs">{sayfaYolunuBul(s.slug)}</p></div><button type="button" onClick={() => sayfaEkle(s)} disabled={menudekiSayfaIdleri.has(s.id)} className="rounded-md border border-[var(--ap-border)] px-2 py-1 text-xs disabled:opacity-40">{menudekiSayfaIdleri.has(s.id) ? 'Eklendi' : '+ Ekle'}</button></div>)}{sayfalar.filter((s) => s.yayinda).length === 0 && <p className="ap-muted text-sm">Yayındaki sayfa bulunmuyor.</p>}</div>}
        {kaynak === 'kategoriler' && <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">{kategoriler.filter((k) => k.aktif && (!filtre || k.baslik.toLocaleLowerCase('tr').includes(filtre))).map((k) => <div key={k.id} className="flex items-center justify-between gap-2 rounded-lg border border-[var(--ap-border)] p-2"><div className="min-w-0"><p className="ap-heading truncate text-sm">{k.baslik}</p><p className="ap-muted truncate text-xs">{k.yol || `/kategori/${k.slug}`}</p></div><button type="button" onClick={() => kategoriEkle(k)} className="rounded-md border border-[var(--ap-border)] px-2 py-1 text-xs">+ Ekle</button></div>)}{kategoriler.length === 0 && <p className="ap-muted text-sm">Kategori menüsünde kayıt yok.</p>}</div>}
        {kaynak === 'bloglar' && <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">{bloglar.filter((b) => b.yayinda && (!filtre || b.baslik.toLocaleLowerCase('tr').includes(filtre))).map((b) => <div key={b.id} className="flex items-center justify-between gap-2 rounded-lg border border-[var(--ap-border)] p-2"><div className="min-w-0"><p className="ap-heading truncate text-sm">{b.baslik}</p><p className="ap-muted truncate text-xs">/blog/{b.slug}</p></div><button type="button" onClick={() => blogEkle(b)} className="rounded-md border border-[var(--ap-border)] px-2 py-1 text-xs">+ Ekle</button></div>)}</div>}
        {kaynak === 'formlar' && <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">{formlar.filter((f) => f.aktif && (!filtre || f.ad.toLocaleLowerCase('tr').includes(filtre))).map((f) => <div key={f.id} className="flex items-center justify-between gap-2 rounded-lg border border-[var(--ap-border)] p-2"><div className="min-w-0"><p className="ap-heading truncate text-sm">{f.ad}</p><p className="ap-muted truncate text-xs">/form/{f.slug}</p></div><button type="button" onClick={() => formEkle(f)} className="rounded-md border border-[var(--ap-border)] px-2 py-1 text-xs">+ Ekle</button></div>)}</div>}
        {kaynak === 'ozel-link' && <div className="mt-3 space-y-3"><label className="block text-xs font-medium">Menü başlığı<input value={ozelBaslik} onChange={(e) => setOzelBaslik(e.target.value)} className="mt-1 w-full rounded-lg border border-[var(--ap-border)] bg-transparent px-3 py-2 text-sm" placeholder="Örn. WhatsApp" /></label><label className="block text-xs font-medium">URL<input value={ozelUrl} onChange={(e) => setOzelUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-[var(--ap-border)] bg-transparent px-3 py-2 text-sm" placeholder="https:// veya /iletisim" /></label><button type="button" onClick={ozelEkle} className="rounded-lg border border-[var(--ap-border)] px-3 py-2 text-sm font-medium">Menüye ekle</button></div>}
      </AdminPanelKarti>

      <AdminPanelKarti baslik="Menü yapısı" altBaslik="Sağa bırak: alt menü. Aynı hizada bırak: sıralama.">
        <div className="space-y-2">{duz.length === 0 ? <div className="rounded-lg border border-dashed border-[var(--ap-border)] p-8 text-center ap-muted text-sm">Soldan sayfa, kategori veya özel bağlantı ekleyin.</div> : duz.map(({ oge, derinlik }) => <div key={oge.id} draggable onDragStart={() => setSuruklenenId(oge.id)} onDragEnd={() => setSuruklenenId(null)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => birak(oge.id, e)} className={`rounded-lg border border-[var(--ap-border)] bg-[var(--ap-panel)] p-3 ${suruklenenId === oge.id ? 'opacity-50' : ''}`} style={{ marginLeft: `${Math.min(derinlik, 4) * 22}px` }}><div className="flex items-start gap-2"><span className="cursor-grab select-none pt-1 ap-muted" aria-label="Sürükle">⠿</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><input value={oge.ad} onChange={(e) => guncelle(oge.id, { ad: e.target.value })} className="min-w-32 flex-1 bg-transparent text-sm font-semibold outline-none" aria-label="Menü başlığı" /><AdminDurumEtiketi tur={oge.tip === 'sayfa' ? 'menu' : oge.tip === 'kategori' ? 'aktif' : 'bilgi'}>{oge.tip === 'sayfa' ? 'Sayfa' : oge.tip === 'kategori' ? 'Kategori' : 'Özel link'}</AdminDurumEtiketi></div><input value={oge.link} onChange={(e) => guncelle(oge.id, { link: e.target.value, tip: oge.sayfaId ? 'sayfa' : oge.tip })} className="ap-muted mt-1 w-full bg-transparent text-xs outline-none" aria-label="Bağlantı adresi" /></div><div className="flex flex-wrap items-center justify-end gap-2"><AdminAnahtarDugme etiket="Yeni sekme" acik={oge.yeniSekme} onDegistir={(v) => guncelle(oge.id, { yeniSekme: v })} /><AdminAnahtarDugme etiket="Göster" acik={oge.gorunur !== false} onDegistir={(v) => guncelle(oge.id, { gorunur: v })} /><button type="button" onClick={() => sil(oge.id)} className="text-xs font-medium text-red-600">Sil</button></div></div></div>)}</div>
      </AdminPanelKarti>
    </div>

    <MenuOnizlemeModal acik={onizlemeAcik} mobil={mobilOnizleme} menu={menu} onKapat={() => setOnizlemeAcik(false)} onModDegistir={setMobilOnizleme} />
  </div>;
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
