import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BlogEditorPanel,
  BlogGorunumPaneli,
  BlogListesiPanel,
  BlogOnizlemeModal,
  blogdanForm,
  bosBlogForm,
} from '@/components/admin/blog/BlogBilesenleri';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { useKaydedilmemisBildirim } from '@/contexts/AdminUyariBildirimContext';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import {
  AdminModulKabuk,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { AdminPilSekme } from '@/components/admin/ortak/AdminFormBilesenleri';
import {
  adminBlogGuncelle,
  adminBlogOlustur,
  adminBlogSil,
  adminBloglariGetir,
  type AdminBlog,
} from '@/features/admin/blogApi';
import { blogAyarlariBirlestir, type BlogAyarlari } from '@/types/blog';
import { siteVerisiGuncellendiYayinla } from '@/utils/siteVerisiOlaylari';

type Gorunum = 'liste' | 'editor' | 'gorunum';

function ListeIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

function YeniIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function DuzenlemeIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function GorunumIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 4v5" />
    </svg>
  );
}

export function BlogYonetimiSayfasi() {
  const { ayarlar, kirli, alanGuncelle, kaydet: siteKaydet } = useSiteAyarlariYonetimi();
  const blogAyarlari = useMemo(() => blogAyarlariBirlestir(ayarlar), [ayarlar]);

  const [bloglar, setBloglar] = useState<AdminBlog[]>([]);
  const [form, setForm] = useState(bosBlogForm);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [gorunum, setGorunum] = useState<Gorunum>('liste');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [onizlemeAcik, setOnizlemeAcik] = useState(false);

  useKaydedilmemisBildirim(
    kirli && !kaydediliyor,
    'Görünüm ayarlarında kaydedilmemiş değişiklik var.',
    'Blog / Haberler',
    'blog-gorunum'
  );

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      setBloglar(await adminBloglariGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Bloglar alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    void yukle();
  }, [yukle]);

  const formuSifirla = useCallback(() => {
    setSeciliId(null);
    setForm(bosBlogForm);
    setBasari('');
    setHata('');
  }, []);

  const yeniBaslat = useCallback(() => {
    formuSifirla();
    setGorunum('editor');
  }, [formuSifirla]);

  const blogAyarlariGuncelle = (guncel: BlogAyarlari) => {
    alanGuncelle('blogAyarlariJson', guncel);
  };

  const kaydet = useCallback(async () => {
    if (gorunum === 'gorunum') {
      if (!kirli) return;
      setKaydediliyor(true);
      setHata('');
      setBasari('');
      try {
        await siteKaydet();
        siteVerisiGuncellendiYayinla();
        setBasari('Görünüm ayarları kaydedildi.');
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
      } finally {
        setKaydediliyor(false);
      }
      return;
    }

    if (!form.baslik.trim()) {
      setHata('Başlık zorunludur');
      return;
    }

    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      if (seciliId) {
        const g = await adminBlogGuncelle(seciliId, form);
        setForm(blogdanForm(g));
        setBasari('Yazı güncellendi.');
      } else {
        const o = await adminBlogOlustur(form);
        setForm(blogdanForm(o));
        setSeciliId(o.id);
        setBasari('Yazı oluşturuldu.');
      }
      setBloglar(await adminBloglariGetir());
      siteVerisiGuncellendiYayinla();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, gorunum, kirli, siteKaydet]);

  const sil = useCallback(async () => {
    if (!seciliId || !confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await adminBlogSil(seciliId);
      setBasari('Yazı silindi.');
      formuSifirla();
      setGorunum('liste');
      await yukle();
      siteVerisiGuncellendiYayinla();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliId, formuSifirla, yukle]);

  const duzenlemeyeGit = useCallback(() => {
    if (!seciliId) return;
    setGorunum('editor');
  }, [seciliId]);

  useModulAksiyonlari(
    {
      kaydet,
      ekle: yeniBaslat,
      sil,
      duzenle: duzenlemeyeGit,
      onizle: () => setOnizlemeAcik(true),
    },
    {
      kaydet:
        !kaydediliyor &&
        (gorunum === 'gorunum' ? kirli : gorunum === 'editor' && Boolean(form.baslik.trim())),
      ekle: gorunum !== 'gorunum',
      sil: gorunum !== 'gorunum' && !!seciliId && !kaydediliyor,
      duzenle: gorunum === 'liste' && !!seciliId && !kaydediliyor,
      onizle: true,
    }
  );

  function yaziSec(b: AdminBlog) {
    setSeciliId(b.id);
    setForm(blogdanForm(b));
    setHata('');
    setBasari('');
  }

  function gorunumDegistir(id: Gorunum) {
    if (id === gorunum) return;
    if (id === 'liste' || id === 'gorunum') {
      setGorunum(id);
      return;
    }
    yeniBaslat();
  }

  const editorEtiket = gorunum === 'editor' && seciliId ? 'Düzenleme' : 'Yeni Yazı';
  const seciliBlog = bloglar.find((b) => b.id === seciliId) ?? null;

  if (yukleniyor) {
    return (
      <AdminModulKabuk onizleGoster={false}>
        <YukleniyorDurumu mesaj="Blog yazıları yükleniyor..." />
      </AdminModulKabuk>
    );
  }

  return (
    <AdminModulKabuk
      onizleGoster={false}
      ustIcerik={
        <AdminPilSekme
          sekmeler={[
            { id: 'liste', etiket: 'Yazı Listesi', ikon: <ListeIkon /> },
            {
              id: 'editor',
              etiket: editorEtiket,
              ikon: gorunum === 'editor' && seciliId ? <DuzenlemeIkon /> : <YeniIkon />,
            },
            { id: 'gorunum', etiket: 'Görünüm', ikon: <GorunumIkon /> },
          ]}
          aktif={gorunum}
          onDegistir={gorunumDegistir}
        />
      }
    >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      {gorunum === 'liste' && (
        <BlogListesiPanel bloglar={bloglar} seciliId={seciliId} onSec={yaziSec} />
      )}
      {gorunum === 'editor' && (
        <BlogEditorPanel form={form} seciliId={seciliId} onChange={setForm} />
      )}
      {gorunum === 'gorunum' && (
        <BlogGorunumPaneli ayarlar={blogAyarlari} onDegistir={blogAyarlariGuncelle} />
      )}

      <BlogOnizlemeModal
        acik={onizlemeAcik}
        form={form}
        tarih={seciliBlog?.olusturma}
        onKapat={() => setOnizlemeAcik(false)}
      />
    </AdminModulKabuk>
  );
}
