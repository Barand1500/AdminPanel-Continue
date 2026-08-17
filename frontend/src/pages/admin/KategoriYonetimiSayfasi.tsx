import { useCallback, useEffect, useState } from 'react';
import {
  bosKategoriForm,
  KategoriEditorPanel,
  KategoriListesiPanel,
  kategoridenForm,
} from '@/components/admin/kategori/KategoriBilesenleri';
import {
  AdminModulKabuk,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { AdminPilSekme } from '@/components/admin/ortak/AdminFormBilesenleri';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import {
  navKategoriGuncelle,
  navKategoriOlustur,
  navKategoriSil,
  navKategorileriGetir,
} from '@/features/admin/navKategoriApi';
import type { NavKategoriFormDegeri, NavKategoriKayit } from '@/types/navKategori';
import { navKategoriDerinlik } from '@/utils/navKategoriAgaci';
import { headerAyarlariBirlestir } from '@/types/header';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';

type Gorunum = 'liste' | 'editor';

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

export function KategoriYonetimiSayfasi() {
  const { headerAyarlari, headerGuncelle, kaydet: siteAyarlariKaydet, kaydediliyor: siteKaydediliyor } =
    useSiteAyarlariYonetimi();
  const header = headerAyarlariBirlestir(headerAyarlari ? { headerAyarlariJson: headerAyarlari } : null);
  const kategoriMenuAcik = header.kategori?.menuGoster !== false;

  const [kategoriler, setKategoriler] = useState<NavKategoriKayit[]>([]);
  const [form, setForm] = useState<NavKategoriFormDegeri>(bosKategoriForm);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [gorunum, setGorunum] = useState<Gorunum>('liste');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      setKategoriler(await navKategorileriGetir());
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Menü öğeleri alınamadı';
      setHata(
        mesaj === 'Endpoint bulunamadi'
          ? 'Sunucudaki backend henüz güncellenmemiş. nav-kategoriler API’si deploy edilmeden bu modül çalışmaz — backend’i yeniden build edip sunucuya yükleyin, ardından PM2’yi yeniden başlatın.'
          : mesaj
      );
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    void yukle();
  }, [yukle]);

  const formuSifirla = useCallback(() => {
    setSeciliId(null);
    setForm(bosKategoriForm);
    setHata('');
    setBasari('');
  }, []);

  const yeniBaslat = useCallback(() => {
    formuSifirla();
    setGorunum('editor');
  }, [formuSifirla]);

  const altEkle = useCallback(
    (ust: NavKategoriKayit) => {
      if (navKategoriDerinlik(kategoriler, ust.id) >= 3) {
        setHata('En fazla 3 seviye menü oluşturulabilir');
        return;
      }
      setSeciliId(null);
      const altSayi = kategoriler.filter((k) => k.ustKategoriId === ust.id).length;
      setForm({ ...bosKategoriForm, ustKategoriId: ust.id, sira: altSayi });
      setHata('');
      setBasari('');
      setGorunum('editor');
    },
    [kategoriler]
  );

  const kaydet = useCallback(async () => {
    if (!form.baslik.trim()) {
      setHata('Menü adı zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      if (seciliId) {
        const g = await navKategoriGuncelle(seciliId, form);
        setForm(kategoridenForm(g));
        setBasari('Menü güncellendi.');
      } else {
        const o = await navKategoriOlustur(form);
        setForm(kategoridenForm(o));
        setSeciliId(o.id);
        setBasari('Menü eklendi.');
      }
      setKategoriler(await navKategorileriGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
      throw err;
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId]);

  const sil = useCallback(async () => {
    if (!seciliId || !confirm('Bu menü öğesini silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await navKategoriSil(seciliId);
      setBasari('Menü silindi.');
      formuSifirla();
      setGorunum('liste');
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
      throw err;
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
      altEkle: () => {
        const secili = kategoriler.find((k) => k.id === seciliId);
        if (secili) altEkle(secili);
      },
      sil,
      duzenle: duzenlemeyeGit,
    },
    {
      kaydet: gorunum === 'editor' && !kaydediliyor && Boolean(form.baslik.trim()),
      ekle: true,
      altEkle: !!seciliId && gorunum === 'liste' && !kaydediliyor,
      sil: !!seciliId && !kaydediliyor,
      duzenle: !!seciliId && gorunum === 'liste' && !kaydediliyor,
    }
  );

  function kategoriSec(k: NavKategoriKayit) {
    setSeciliId(k.id);
    setForm(kategoridenForm(k));
    setHata('');
    setBasari('');
  }

  function gorunumDegistir(id: Gorunum) {
    if (id === gorunum) return;
    if (id === 'liste') {
      setGorunum('liste');
      return;
    }
    yeniBaslat();
  }

  const kategoriMenuToggle = useCallback(
    async (acik: boolean) => {
      const yeniHeader = {
        ...headerAyarlari,
        kategori: {
          ...headerAyarlari.kategori!,
          menuGoster: acik,
        },
      };
      headerGuncelle(yeniHeader);
      setHata('');
      try {
        await siteAyarlariKaydet({ header: yeniHeader });
        setBasari(acik ? 'Menü sitede gösterilecek.' : 'Menü sitede gizlendi.');
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Menü ayarı kaydedilemedi');
      }
    },
    [headerAyarlari, headerGuncelle, siteAyarlariKaydet]
  );

  const editorEtiket =
    gorunum === 'editor' && seciliId
      ? 'Düzenleme'
      : gorunum === 'editor' && form.ustKategoriId
        ? 'Yeni Alt'
        : 'Yeni Menü';

  if (yukleniyor) {
    return (
      <AdminModulKabuk onizleGoster={false}>
        <YukleniyorDurumu mesaj="Menü yükleniyor..." />
      </AdminModulKabuk>
    );
  }

  return (
    <AdminModulKabuk
      onizleGoster={false}
      ustIcerik={
        <AdminPilSekme
          sekmeler={[
            { id: 'liste', etiket: 'Menü Listesi', ikon: <ListeIkon /> },
            {
              id: 'editor',
              etiket: editorEtiket,
              ikon: gorunum === 'editor' && seciliId ? <DuzenlemeIkon /> : <YeniIkon />,
            },
          ]}
          aktif={gorunum}
          onDegistir={gorunumDegistir}
        />
      }
    >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      {gorunum === 'liste' ? (
        <KategoriListesiPanel
          kategoriler={kategoriler}
          seciliId={seciliId}
          menuAcik={kategoriMenuAcik}
          menuKaydediliyor={siteKaydediliyor}
          onSec={kategoriSec}
          onMenuToggle={(v) => void kategoriMenuToggle(v)}
        />
      ) : (
        <KategoriEditorPanel
          form={form}
          seciliId={seciliId}
          kategoriler={kategoriler}
          onChange={setForm}
        />
      )}
    </AdminModulKabuk>
  );
}
