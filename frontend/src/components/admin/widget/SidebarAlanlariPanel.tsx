import { useEffect, useState, type ReactNode } from 'react';
import { AdminPanelKarti, BildirimKutusu } from '@/components/admin/ortak/AdminBilesenleri';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { adminFormlariGetir, type AdminForm } from '@/features/admin/formApi';
import { adminSayfalariGetir, type AdminSayfa } from '@/features/admin/sayfaApi';
import type { SidebarAyarlari, SidebarBileseni, SidebarBilesenTipi } from '@/types/header';
import { yeniMenuId } from '@/utils/menuYardimci';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { sayfaDuzenModuOku, sayfaTamGenisDuzenMi } from '@/utils/sayfaIcerikIsle';
import { sayfaIcerikVar } from '@/utils/sayfaAgaci';

const TIPLER: { id: SidebarBilesenTipi; ad: string }[] = [
  { id: 'menu', ad: 'Menü' }, { id: 'arama', ad: 'Arama' }, { id: 'son_yazilar', ad: 'Son Yazılar' }, { id: 'kategoriler', ad: 'Kategoriler' }, { id: 'arsivler', ad: 'Arşivler' }, { id: 'takvim', ad: 'Takvim' }, { id: 'metin', ad: 'Metin' }, { id: 'form', ad: 'Form' },
];
type AlanId = 'blog' | 'sayfa';
const ALANLAR: Record<AlanId, { ad: string; aciklama: string }> = {
  blog: { ad: 'Blog Sidebar', aciklama: 'Blog liste ve detay sayfalarının sağ sütununda görünür; mobilde içeriğin altına iner.' },
  sayfa: { ad: 'Sayfa Sidebar', aciklama: 'Standart içerik sayfalarının sağ sütununda görünür; tam genişlik sayfalar bu alanı kullanmaz.' },
};

export function SidebarAlanlariPanel({ ustAksiyon }: { ustAksiyon?: ReactNode }) {
  const { headerAyarlari, headerGuncelle, kaydet, kaydediliyor } = useSiteAyarlariYonetimi();
  const [formlar, setFormlar] = useState<AdminForm[]>([]);
  const [sayfalar, setSayfalar] = useState<AdminSayfa[]>([]);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [alan, setAlan] = useState<AlanId>('blog');
  const ayar: SidebarAyarlari = {
    blogAktif: headerAyarlari.sidebarAyarlari?.blogAktif ?? false, blogBilesenleri: headerAyarlari.sidebarAyarlari?.blogBilesenleri ?? [],
    sayfaAktif: headerAyarlari.sidebarAyarlari?.sayfaAktif ?? false, sayfaBilesenleri: headerAyarlari.sidebarAyarlari?.sayfaBilesenleri ?? [], sayfaIdleri: headerAyarlari.sidebarAyarlari?.sayfaIdleri ?? [],
    anaSayfaAktif: headerAyarlari.sidebarAyarlari?.anaSayfaAktif ?? false, anaSayfaBilesenleri: headerAyarlari.sidebarAyarlari?.anaSayfaBilesenleri ?? [],
  };
  useEffect(() => { void Promise.all([adminFormlariGetir(), adminSayfalariGetir()]).then(([formListesi, sayfaListesi]) => { setFormlar(formListesi); setSayfalar(sayfaListesi); }).catch(() => setHata('Kaynaklar yüklenemedi.')); }, []);
  const sidebarDestekleyenSayfalar = sayfalar.filter((sayfa) => {
    const baslik = sayfa.baslik.trim().toLocaleLowerCase('tr-TR');
    return sayfa.yayinda
      && !['', '/', 'ana-sayfa', 'hakkimizda', 'iletisim'].includes(sayfa.slug)
      && baslik !== 'ana sayfa'
      && !sayfaTamGenisDuzenMi(sayfaDuzenModuOku(sayfa.icerik))
      && sayfaIcerikVar(sayfa.icerik);
  });
  const seciliDesteklenenSayfaSayisi = sidebarDestekleyenSayfalar.filter((sayfa) => ayar.sayfaIdleri.includes(String(sayfa.id))).length;
  const alanAktif = alan === 'blog' ? ayar.blogAktif : ayar.sayfaAktif;
  const alanBilesenleri = alan === 'blog' ? ayar.blogBilesenleri : ayar.sayfaBilesenleri;
  const alanGuncelle = (aktif: boolean, bilesenler: SidebarBileseni[]) => {
    const sidebarAyarlari = alan === 'blog' ? { ...ayar, blogAktif: aktif, blogBilesenleri: bilesenler } : { ...ayar, sayfaAktif: aktif, sayfaBilesenleri: bilesenler };
    headerGuncelle({ ...headerAyarlari, sidebarAyarlari });
  };
  const ekle = (tip: SidebarBilesenTipi) => alanGuncelle(alanAktif, [...alanBilesenleri, { id: yeniMenuId(), tip, aktif: true, sira: alanBilesenleri.length, adet: tip === 'son_yazilar' ? 5 : undefined }]);
  const sil = (id: string) => alanGuncelle(alanAktif, alanBilesenleri.filter((b) => b.id !== id).map((b, sira) => ({ ...b, sira })));
  const guncelleBilesen = (id: string, parca: Partial<SidebarBileseni>) => alanGuncelle(alanAktif, alanBilesenleri.map((b) => b.id === id ? { ...b, ...parca } : b));
  const siraTasi = (id: string, yon: -1 | 1) => {
    const liste = [...alanBilesenleri].sort((a, b) => a.sira - b.sira); const index = liste.findIndex((b) => b.id === id); const hedef = index + yon;
    if (hedef < 0 || hedef >= liste.length) return;
    [liste[index], liste[hedef]] = [liste[hedef], liste[index]];
    alanGuncelle(alanAktif, liste.map((b, sira) => ({ ...b, sira })));
  };
  const kaydetSidebar = async () => {
    try {
      setHata('');
      const sayfaIdleri = ayar.sayfaIdleri.filter((id) => sidebarDestekleyenSayfalar.some((sayfa) => String(sayfa.id) === id));
      const kaydedilecekAyar = { ...ayar, sayfaIdleri };
      await kaydet({ header: { ...headerAyarlari, sidebarAyarlari: kaydedilecekAyar } });
      headerGuncelle({ ...headerAyarlari, sidebarAyarlari: kaydedilecekAyar });
      setBasari(`${ALANLAR[alan].ad} kaydedildi.`);
    }
    catch (err) { setHata(err instanceof Error ? err.message : 'Sidebar kaydedilemedi.'); }
  };
  useModulAksiyonlari({ kaydet: kaydetSidebar }, { kaydet: !kaydediliyor });
  return <div className="space-y-4">
    {hata && <BildirimKutusu mesaj={hata} tur="hata" />}{basari && <BildirimKutusu mesaj={basari} tur="basari" />}
    <AdminPanelKarti>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Widget yönetim bölümü">{ustAksiyon}</div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Sidebar alanı seçimi">
          {(Object.keys(ALANLAR) as AlanId[]).map((id) => <button key={id} type="button" role="tab" aria-selected={alan === id} onClick={() => setAlan(id)} className={`ap-form-filtre-pil${alan === id ? ' ap-form-filtre-pil--aktif' : ''}`}>{ALANLAR[id].ad}</button>)}
        </div>
      </div>
      <label className="flex items-center justify-between gap-4 rounded-lg border border-[var(--ap-border)] p-3 text-sm font-medium"><span><strong className="mr-2">{ALANLAR[alan].ad} aktif</strong>{ALANLAR[alan].aciklama}</span><input type="checkbox" checked={alanAktif} onChange={(e) => alanGuncelle(e.target.checked, alanBilesenleri)} /></label>
      {alan === 'sayfa' && <details className="mt-3 rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)]"><summary className="cursor-pointer px-3 py-2 text-sm font-medium">Görünecek sayfaları seç ({seciliDesteklenenSayfaSayisi})</summary><div className="space-y-2 border-t border-[var(--ap-border)] p-3"><p className="text-xs text-[var(--ap-muted)]">Yalnızca standart içerik alanı bulunan ve Sidebar’ın düzeni bozmayacağı sayfalar listelenir.</p>{sidebarDestekleyenSayfalar.length === 0 ? <p className="text-sm text-[var(--ap-muted)]">Sidebar için uygun yayınlanmış sayfa yok.</p> : sidebarDestekleyenSayfalar.map((sayfa) => <label key={sayfa.id} className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={ayar.sayfaIdleri.includes(String(sayfa.id))} onChange={(e) => { const id = String(sayfa.id); const sayfaIdleri = e.target.checked ? [...ayar.sayfaIdleri, id] : ayar.sayfaIdleri.filter((seciliId) => seciliId !== id); headerGuncelle({ ...headerAyarlari, sidebarAyarlari: { ...ayar, sayfaIdleri } }); }} />{sayfa.baslik}</label>)}</div></details>}
    </AdminPanelKarti>
    <AdminPanelKarti baslik={`${ALANLAR[alan].ad} bileşenleri`} altBaslik="Bileşenler sağ sütunda bu sırayla görünür.">
      <div className="space-y-3">{[...alanBilesenleri].sort((a, b) => a.sira - b.sira).map((bilesen) => <div key={bilesen.id} className="rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] p-3"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm">{TIPLER.find((tip) => tip.id === bilesen.tip)?.ad}</strong><input value={bilesen.baslik ?? ''} onChange={(e) => guncelleBilesen(bilesen.id, { baslik: e.target.value })} placeholder="Başlık (isteğe bağlı)" className="min-w-40 flex-1 rounded border border-[var(--ap-border)] bg-[var(--ap-panel)] px-2 py-1 text-sm" /><button type="button" onClick={() => siraTasi(bilesen.id, -1)} className="px-2 text-sm">↑</button><button type="button" onClick={() => siraTasi(bilesen.id, 1)} className="px-2 text-sm">↓</button><button type="button" onClick={() => sil(bilesen.id)} className="text-xs text-red-500">Sil</button></div>
        {bilesen.tip === 'menu' && <select value={bilesen.menuId ?? ''} onChange={(e) => guncelleBilesen(bilesen.id, { menuId: e.target.value })} className="mt-3 w-full rounded border border-[var(--ap-border)] bg-[var(--ap-panel)] px-2 py-2 text-sm"><option value="">Menü seçin</option>{headerAyarlari.menuler?.map((menu) => <option key={menu.id} value={menu.id}>{menu.ad}</option>)}</select>}
        {bilesen.tip === 'son_yazilar' && <label className="mt-3 block text-xs">Gösterilecek yazı adedi<input type="number" min="1" max="12" value={bilesen.adet ?? 5} onChange={(e) => guncelleBilesen(bilesen.id, { adet: Number(e.target.value) })} className="mt-1 block w-24 rounded border border-[var(--ap-border)] bg-[var(--ap-panel)] px-2 py-1" /></label>}
        {bilesen.tip === 'metin' && <label className="mt-3 block text-xs">Metin<input value={bilesen.icerik ?? ''} onChange={(e) => guncelleBilesen(bilesen.id, { icerik: e.target.value })} placeholder="Kısa açıklama veya duyuru" className="mt-1 block w-full rounded border border-[var(--ap-border)] bg-[var(--ap-panel)] px-2 py-2 text-sm" /></label>}
        {bilesen.tip === 'form' && <select value={bilesen.formId ?? ''} onChange={(e) => guncelleBilesen(bilesen.id, { formId: e.target.value })} className="mt-3 w-full rounded border border-[var(--ap-border)] bg-[var(--ap-panel)] px-2 py-2 text-sm"><option value="">Form seçin</option>{formlar.filter((form) => form.aktif).map((form) => <option key={form.id} value={form.id}>{form.ad}</option>)}</select>}
      </div>)}</div>
      <div className="mt-4 flex flex-wrap gap-2">{TIPLER.map((tip) => <button key={tip.id} type="button" onClick={() => ekle(tip.id)} className="rounded-lg border border-[var(--ap-border)] px-3 py-2 text-sm">+ {tip.ad}</button>)}</div>
    </AdminPanelKarti>
  </div>;
}
