import { useCallback, useEffect, useMemo, useState } from 'react';
import { BlogDuzenleFormu, BlogListesi } from '@/components/admin/blog/BlogBilesenleri';
import { BlogGorunumPanel } from '@/components/admin/blog/BlogGorunumPanel';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { useKaydedilmemisBildirim } from '@/contexts/AdminUyariBildirimContext';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import {
  AdminModulKabuk,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { AdminIstatistikKarti } from '@/components/admin/ortak/AdminFormBilesenleri';
import {
  adminBlogGuncelle,
  adminBlogOlustur,
  adminBlogSil,
  adminBloglariGetir,
  type AdminBlog,
  type BlogFormDegeri,
} from '@/features/admin/blogApi';
import { blogAyarlariBirlestir, type BlogAyarlari } from '@/types/blog';
import { siteVerisiGuncellendiYayinla } from '@/utils/siteVerisiOlaylari';

const bosForm: BlogFormDegeri = {
  baslik: '',
  slug: '',
  ozet: '',
  icerik: '',
  kapakGorsel: '',
  yazar: '',
  kategori: '',
  yayinda: false,
  oneCikan: false,
  seoTitle: '',
  seoDesc: '',
};

function blogdanForm(b: AdminBlog): BlogFormDegeri {
  return {
    baslik: b.baslik,
    slug: b.slug,
    ozet: b.ozet ?? '',
    icerik: b.icerik,
    kapakGorsel: b.kapakGorsel ?? '',
    yazar: b.yazar ?? '',
    kategori: b.kategori ?? '',
    yayinda: b.yayinda,
    oneCikan: b.oneCikan,
    seoTitle: b.seoTitle ?? '',
    seoDesc: b.seoDesc ?? '',
  };
}

export function BlogYonetimiSayfasi() {
  const { ayarlar, kirli, alanGuncelle, kaydet: siteKaydet } = useSiteAyarlariYonetimi();
  const blogAyarlari = useMemo(() => blogAyarlariBirlestir(ayarlar), [ayarlar]);

  const [bloglar, setBloglar] = useState<AdminBlog[]>([]);
  const [form, setForm] = useState<BlogFormDegeri>(bosForm);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  useKaydedilmemisBildirim(
    kirli && !kaydediliyor,
    'Görünüm ayarlarında kaydedilmemiş değişiklik var.',
    'Blog / Haberler',
    'blog-gorunum'
  );

  const istatistik = useMemo(
    () => ({
      toplam: bloglar.length,
      yayinda: bloglar.filter((b) => b.yayinda).length,
      taslak: bloglar.filter((b) => !b.yayinda).length,
      oneCikan: bloglar.filter((b) => b.oneCikan).length,
    }),
    [bloglar]
  );

  async function yukle() {
    setYukleniyor(true);
    try {
      setBloglar(await adminBloglariGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Bloglar alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }

  useEffect(() => {
    void yukle();
  }, []);

  const yeniBaslat = useCallback(() => {
    setSeciliId(null);
    setForm(bosForm);
    setBasari('');
    setHata('');
  }, []);

  const blogAyarlariGuncelle = (guncel: BlogAyarlari) => {
    alanGuncelle('blogAyarlariJson', guncel);
  };

  const siteAyarlariKaydet = useCallback(async () => {
    if (!kirli) return;
    await siteKaydet();
    siteVerisiGuncellendiYayinla();
  }, [kirli, siteKaydet]);

  const kaydet = useCallback(async () => {
    if (!kirli && !form.baslik.trim()) {
      setHata('Kaydedilecek içerik yok');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      let mesaj = '';
      if (form.baslik.trim()) {
        if (seciliId) await adminBlogGuncelle(seciliId, form);
        else await adminBlogOlustur(form);
        mesaj = seciliId ? 'Yazı güncellendi.' : 'Yeni yazı oluşturuldu.';
        yeniBaslat();
        await yukle();
      }
      if (kirli) {
        await siteAyarlariKaydet();
        mesaj = mesaj ? `${mesaj} Görünüm ayarları kaydedildi.` : 'Görünüm ayarları kaydedildi.';
      }
      setBasari(mesaj || 'Kaydedildi.');
      siteVerisiGuncellendiYayinla();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniBaslat, kirli, siteAyarlariKaydet]);

  const yayinla = useCallback(async () => {
    const guncel = { ...form, yayinda: true };
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      if (seciliId) await adminBlogGuncelle(seciliId, guncel);
      else await adminBlogOlustur(guncel);
      if (kirli) await siteAyarlariKaydet();
      setBasari('Yazı yayınlandı.');
      yeniBaslat();
      await yukle();
      siteVerisiGuncellendiYayinla();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Yayınlama başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniBaslat, kirli, siteAyarlariKaydet]);

  const sil = useCallback(async () => {
    if (!seciliId || !confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await adminBlogSil(seciliId);
      setBasari('Yazı silindi.');
      yeniBaslat();
      await yukle();
      siteVerisiGuncellendiYayinla();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliId, yeniBaslat]);

  const onizle = useCallback(() => {
    const slug = form.slug.trim();
    if (form.yayinda && slug) {
      window.open(`/blog/${slug}`, '_blank');
    } else {
      window.open('/blog', '_blank');
    }
  }, [form.slug, form.yayinda]);

  useModulAksiyonlari(
    {
      kaydet,
      ekle: yeniBaslat,
      sil,
      yayinla,
      onizle,
    },
    {
      kaydet: !kaydediliyor && (kirli || !!form.baslik.trim()),
      ekle: true,
      sil: !!seciliId && !kaydediliyor,
      yayinla: !kaydediliyor && !!form.baslik.trim(),
      onizle: true,
    }
  );

  return (
    <AdminModulKabuk
      baslik="Blog / Haberler"
      aciklama="Haber ve blog yazılarını oluşturun, görünüm yerlerini seçin ve yayınlayın."
    >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      {yukleniyor ? (
        <YukleniyorDurumu mesaj="Blog yazıları yükleniyor..." />
      ) : (
        <div className="ap-blog-yonetim">
          <div className="ap-stat-grid ap-blog-stat-grid">
            <AdminIstatistikKarti etiket="Toplam" deger={istatistik.toplam} ikon="📰" vurgu="mavi" />
            <AdminIstatistikKarti etiket="Yayında" deger={istatistik.yayinda} ikon="✅" vurgu="yesil" />
            <AdminIstatistikKarti etiket="Taslak" deger={istatistik.taslak} ikon="📝" vurgu="amber" />
            <AdminIstatistikKarti etiket="Öne Çıkan" deger={istatistik.oneCikan} ikon="⭐" vurgu="gri" />
          </div>

          <BlogGorunumPanel ayarlar={blogAyarlari} onDegistir={blogAyarlariGuncelle} />

          <div className="ap-split-layout ap-blog-split">
            <BlogListesi
              bloglar={bloglar}
              seciliId={seciliId}
              onSec={(b) => {
                setSeciliId(b.id);
                setForm(blogdanForm(b));
                setBasari('');
                setHata('');
              }}
            />
            <BlogDuzenleFormu form={form} seciliId={seciliId} onChange={setForm} />
          </div>
        </div>
      )}
    </AdminModulKabuk>
  );
}
