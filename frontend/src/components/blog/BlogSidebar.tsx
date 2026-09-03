import { Link } from 'react-router-dom';
import type { SitePublicData } from '@/types/site';
import { headerAyarlariBirlestir } from '@/types/header';
import { blogOnizlemeListesi } from '@/types/blog';

export type SidebarAlani = 'blog' | 'sayfa' | 'ana-sayfa';

export function BlogSidebar({ veri, alan = 'blog', sayfaId }: { veri: SitePublicData; alan?: SidebarAlani; sayfaId?: string }) {
  const header = headerAyarlariBirlestir(veri.site.ayarlar);
  const ayar = header.sidebarAyarlari;
  const aktif = alan === 'blog' ? ayar?.blogAktif : alan === 'sayfa' ? ayar?.sayfaAktif : ayar?.anaSayfaAktif;
  const alanBilesenleri = alan === 'blog' ? ayar?.blogBilesenleri : alan === 'sayfa' ? ayar?.sayfaBilesenleri : ayar?.anaSayfaBilesenleri;
  if (!aktif || (alan === 'sayfa' && (!sayfaId || !ayar?.sayfaIdleri?.includes(sayfaId)))) return null;
  const bilesenler = [...(alanBilesenleri ?? [])].filter((b) => b.aktif).sort((a, b) => a.sira - b.sira);
  if (!bilesenler.length) return null;
  const kategoriler = [...new Set(veri.bloglar.map((blog) => blog.kategori).filter(Boolean))] as string[];
  const arsivler = [...new Set(veri.bloglar.map((blog) => blog.olusturma.slice(0, 7)).filter(Boolean))].sort().reverse();

  return <aside className="space-y-5" aria-label="Blog kenar çubuğu">
    {bilesenler.map((bilesen) => {
      const baslik = bilesen.baslik?.trim();
      if (bilesen.tip === 'menu') {
        const menu = header.menuler?.find((kayit) => kayit.id === bilesen.menuId);
        const ogeler = menu?.ogeler.filter((oge) => !oge.ustOgeId && oge.gorunur !== false).sort((a, b) => a.sira - b.sira) ?? [];
        if (!ogeler.length) return null;
        return <SidebarKarti key={bilesen.id} baslik={baslik || menu?.ad || 'Menü'}><nav className="space-y-2">{ogeler.map((oge) => <Link key={oge.id} to={oge.link} target={oge.yeniSekme ? '_blank' : undefined} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-primary/5 hover:text-primary">{oge.ad}</Link>)}</nav></SidebarKarti>;
      }
      if (bilesen.tip === 'arama') return <SidebarKarti key={bilesen.id} baslik={baslik || 'Ara'}><form action="/blog"><input name="ara" placeholder="Blogda ara..." className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></form></SidebarKarti>;
      if (bilesen.tip === 'son_yazilar') return <SidebarKarti key={bilesen.id} baslik={baslik || 'Son Yazılar'}><ul className="space-y-3">{blogOnizlemeListesi(veri.bloglar, bilesen.adet ?? 5).map((blog) => <li key={blog.id}><Link to={`/blog/${blog.slug}`} className="text-sm font-medium text-slate-700 hover:text-primary">{blog.baslik}</Link></li>)}</ul></SidebarKarti>;
      if (bilesen.tip === 'kategoriler') return <SidebarKarti key={bilesen.id} baslik={baslik || 'Kategoriler'}><ul className="space-y-2">{kategoriler.map((kategori) => <li key={kategori}><Link to={`/blog?kategori=${encodeURIComponent(kategori)}`} className="text-sm text-slate-600 hover:text-primary">{kategori}</Link></li>)}</ul></SidebarKarti>;
      if (bilesen.tip === 'arsivler') return <SidebarKarti key={bilesen.id} baslik={baslik || 'Arşivler'}><ul className="space-y-2">{arsivler.map((ay) => <li key={ay}><Link to={`/blog?ay=${ay}`} className="text-sm text-slate-600 hover:text-primary">{new Date(`${ay}-01T12:00:00`).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</Link></li>)}</ul></SidebarKarti>;
      if (bilesen.tip === 'takvim') return <SidebarKarti key={bilesen.id} baslik={baslik || 'Takvim'}><SidebarTakvim /></SidebarKarti>;
      if (bilesen.tip === 'metin') return <SidebarKarti key={bilesen.id} baslik={baslik || 'Bilgi'}><p className="whitespace-pre-line text-sm leading-6 text-slate-600">{bilesen.icerik || 'Metninizi buradan yazabilirsiniz.'}</p></SidebarKarti>;
      const form = veri.formlar?.find((kayit) => kayit.id === bilesen.formId);
      return form ? <SidebarKarti key={bilesen.id} baslik={baslik || form.ad}><Link to={`/form/${form.slug}`} className="inline-flex rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">Forma git</Link></SidebarKarti> : null;
    })}
  </aside>;
}

function SidebarTakvim() {
  const bugun = new Date();
  const ilkGun = new Date(bugun.getFullYear(), bugun.getMonth(), 1).getDay();
  const gunSayisi = new Date(bugun.getFullYear(), bugun.getMonth() + 1, 0).getDate();
  return <div className="text-center text-xs text-slate-600"><p className="mb-3 font-semibold capitalize">{bugun.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</p><div className="grid grid-cols-7 gap-1 text-[11px]">{['P', 'P', 'S', 'Ç', 'P', 'C', 'C'].map((gun, i) => <span key={`${gun}-${i}`} className="font-semibold">{gun}</span>)}{Array.from({ length: ilkGun }, (_, i) => <span key={`bos-${i}`} />)}{Array.from({ length: gunSayisi }, (_, i) => <span key={i + 1} className={i + 1 === bugun.getDate() ? 'rounded bg-primary py-1 text-white' : 'py-1'}>{i + 1}</span>)}</div></div>;
}

function SidebarKarti({ baslik, children }: { baslik: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 text-base font-bold text-slate-900">{baslik}</h2>{children}</section>;
}
