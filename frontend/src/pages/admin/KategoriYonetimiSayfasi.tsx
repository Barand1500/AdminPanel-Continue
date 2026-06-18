import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AdminModulKabuk,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import {
  AdminAnahtarDugme,
  AdminAramaKutusu,
  AdminBosDurum,
  AdminDurumEtiketi,
  AdminFormBolumu,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import { FormAlani, formInputSinifi, formSelectSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { KategoriMenuOnizleme } from '@/components/admin/kategori/KategoriMenuOnizleme';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import {
  navKategoriGuncelle,
  navKategoriOlustur,
  navKategoriSil,
  navKategorileriGetir,
} from '@/features/admin/navKategoriApi';
import type { NavKategoriFormDegeri, NavKategoriKayit } from '@/types/navKategori';
import { navKategoriAgaciOlustur, navKategoriDerinlik, navKategoriUstSecenekleri } from '@/utils/navKategoriAgaci';
import { kategoriAcilisModuNormalize } from '@/types/header';
import { headerAyarlariBirlestir } from '@/types/header';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';

const bosForm: NavKategoriFormDegeri = {
  baslik: '',
  slug: '',
  yol: '',
  gorselUrl: '',
  ikon: '',
  aktif: true,
  sira: 0,
  ustKategoriId: null,
};

function kategoridenForm(k: NavKategoriKayit): NavKategoriFormDegeri {
  return {
    baslik: k.baslik,
    slug: k.slug,
    yol: k.yol ?? '',
    gorselUrl: k.gorselUrl ?? '',
    ikon: k.ikon ?? '',
    aktif: k.aktif,
    sira: k.sira,
    ustKategoriId: k.ustKategoriId,
  };
}

function KategoriAgacSatiri({
  kategori,
  seciliId,
  girinti,
  onSec,
}: {
  kategori: NavKategoriKayit;
  seciliId: string | null;
  girinti: number;
  onSec: (k: NavKategoriKayit) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSec(kategori)}
      className={`ap-liste-oge mb-1 w-full text-left ${seciliId === kategori.id ? 'ap-liste-oge-secili' : ''}`}
      style={girinti > 0 ? { marginLeft: `${girinti * 14}px` } : undefined}
    >
      <p className="ap-liste-oge-baslik">{kategori.baslik}</p>
      <p className="ap-liste-oge-alt">/{kategori.slug}</p>
      <div className="ap-liste-oge-etiketler">
        {kategori.aktif ? (
          <AdminDurumEtiketi tur="yayinda">Aktif</AdminDurumEtiketi>
        ) : (
          <AdminDurumEtiketi tur="taslak">Pasif</AdminDurumEtiketi>
        )}
        {girinti > 0 && <AdminDurumEtiketi tur="bilgi">Alt</AdminDurumEtiketi>}
      </div>
    </button>
  );
}

function KategoriAgacListesi({
  kayitlar,
  ustId,
  seciliId,
  girinti,
  onSec,
}: {
  kayitlar: NavKategoriKayit[];
  ustId: string | null;
  seciliId: string | null;
  girinti: number;
  onSec: (k: NavKategoriKayit) => void;
}) {
  const cocuklar = kayitlar
    .filter((k) => (ustId ? k.ustKategoriId === ustId : !k.ustKategoriId))
    .sort((a, b) => a.sira - b.sira || a.baslik.localeCompare(b.baslik, 'tr'));

  return (
    <>
      {cocuklar.map((k) => (
        <div key={k.id}>
          <KategoriAgacSatiri kategori={k} seciliId={seciliId} girinti={girinti} onSec={onSec} />
          <KategoriAgacListesi
            kayitlar={kayitlar}
            ustId={k.id}
            seciliId={seciliId}
            girinti={girinti + 1}
            onSec={onSec}
          />
        </div>
      ))}
    </>
  );
}

export function KategoriYonetimiSayfasi() {
  const { headerAyarlari, headerGuncelle, kaydet: siteAyarlariKaydet, kaydediliyor: siteKaydediliyor } = useSiteAyarlariYonetimi();
  const header = headerAyarlariBirlestir(headerAyarlari ? { headerAyarlariJson: headerAyarlari } : null);
  const kategoriMenuAcik = header.kategori?.menuGoster !== false;

  const [kategoriler, setKategoriler] = useState<NavKategoriKayit[]>([]);
  const [form, setForm] = useState<NavKategoriFormDegeri>(bosForm);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [arama, setArama] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      setKategoriler(await navKategorileriGetir());
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kategoriler alınamadı';
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

  const filtreli = useMemo(() => {
    const q = arama.trim().toLowerCase();
    if (!q) return kategoriler;
    return kategoriler.filter(
      (k) => k.baslik.toLowerCase().includes(q) || k.slug.toLowerCase().includes(q)
    );
  }, [kategoriler, arama]);

  const onizlemeAgaci = useMemo(() => navKategoriAgaciOlustur(kategoriler, true), [kategoriler]);

  const yeniBaslat = useCallback(() => {
    setSeciliId(null);
    setForm(bosForm);
    setHata('');
    setBasari('');
  }, []);

  const altEkle = useCallback(
    (ust: NavKategoriKayit) => {
      if (navKategoriDerinlik(kategoriler, ust.id) >= 3) {
        setHata('En fazla 3 seviye kategori oluşturulabilir');
        return;
      }
      setSeciliId(null);
      const altSayi = kategoriler.filter((k) => k.ustKategoriId === ust.id).length;
      setForm({ ...bosForm, ustKategoriId: ust.id, sira: altSayi });
      setHata('');
      setBasari('');
    },
    [kategoriler]
  );

  const kaydet = useCallback(async () => {
    if (!form.baslik.trim()) {
      setHata('Kategori adı zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      if (seciliId) {
        const g = await navKategoriGuncelle(seciliId, form);
        setForm(kategoridenForm(g));
        setBasari('Kategori güncellendi.');
      } else {
        const o = await navKategoriOlustur(form);
        setForm(kategoridenForm(o));
        setSeciliId(o.id);
        setBasari('Kategori eklendi.');
      }
      setKategoriler(await navKategorileriGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId]);

  const sil = useCallback(async () => {
    if (!seciliId || !confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await navKategoriSil(seciliId);
      setBasari('Kategori silindi.');
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliId, yeniBaslat, yukle]);

  useModulAksiyonlari(
    {
      kaydet,
      ekle: yeniBaslat,
      altEkle: () => {
        const secili = kategoriler.find((k) => k.id === seciliId);
        if (secili) altEkle(secili);
      },
      sil,
    },
    {
      kaydet: !kaydediliyor,
      ekle: true,
      altEkle: !!seciliId && !kaydediliyor,
      sil: !!seciliId && !kaydediliyor,
    }
  );

  function kategoriSec(k: NavKategoriKayit) {
    setSeciliId(k.id);
    setForm(kategoridenForm(k));
    setHata('');
    setBasari('');
  }

  const ustSecenekleri = navKategoriUstSecenekleri(kategoriler, seciliId ?? undefined);

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
        setBasari(acik ? 'Tüm Kategoriler menüsü açıldı.' : 'Tüm Kategoriler menüsü kapatıldı.');
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Menü ayarı kaydedilemedi');
      }
    },
    [headerAyarlari, headerGuncelle, siteAyarlariKaydet]
  );

  if (yukleniyor) return <YukleniyorDurumu mesaj="Kategoriler yükleniyor..." />;

  return (
    <AdminModulKabuk
      baslik="Kategori Yönetimi"
      aciklama="Header’daki Tüm Kategoriler menüsünü buradan yönetin. En fazla 3 seviye (ana → alt → alt-alt)."
    >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      <div className="ap-split-layout ap-kategori-yonetim-layout">
        <aside className="ap-sidebar-panel">
          <div className="ap-sidebar-baslik">
            <div>
              <h2 className="ap-heading text-sm font-semibold">Kategori Listesi</h2>
              <p className="ap-muted text-xs">{kategoriler.length} kategori</p>
            </div>
          </div>
          <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Kategori ara..." />
          <div className="ap-scroll ap-sidebar-icerik">
            {filtreli.length === 0 ? (
              <AdminBosDurum ikon="📂" baslik="Henüz kategori yok" aciklama="Alttaki Yeni Ekle ile başlayın" />
            ) : (
              <KategoriAgacListesi
                kayitlar={filtreli}
                ustId={null}
                seciliId={seciliId}
                girinti={0}
                onSec={kategoriSec}
              />
            )}
          </div>
        </aside>

        <div className="ap-editor-panel ap-kategori-editor">
          <AdminFormBolumu
            baslik="Tüm Kategoriler Menüsü"
            aciklama="Kapalıyken header'da kategori butonu görünmez. Açıkken yalnızca aktif kategoriler listelenir."
          >
            <AdminAnahtarDugme
              etiket="Tüm Kategoriler menüsünü göster"
              acik={kategoriMenuAcik}
              onDegistir={(v) => void kategoriMenuToggle(v)}
            />
            {siteKaydediliyor && <p className="ap-muted text-xs">Menü ayarı kaydediliyor…</p>}
          </AdminFormBolumu>

          <AdminFormBolumu
            baslik={seciliId ? 'Kategori Düzenle' : form.ustKategoriId ? 'Yeni Alt Kategori' : 'Yeni Kategori'}
            aciklama="Kaydet ile veritabanına yazılır. Pasif kategoriler sitede görünmez."
          >
            <div className="ap-kategori-form-grid">
              <FormAlani etiket="Kategori Adı">
                <input
                  className={formInputSinifi}
                  value={form.baslik}
                  onChange={(e) => setForm({ ...form, baslik: e.target.value })}
                  placeholder="Örn: Bilgisayar"
                />
              </FormAlani>
              <FormAlani etiket="Slug" aciklama="Boş bırakılırsa otomatik oluşur">
                <input
                  className={formInputSinifi}
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="bilgisayar"
                />
              </FormAlani>
              <FormAlani etiket="Link (yol)" aciklama="Boşsa /kategori-slug yolu kullanılır">
                <input
                  className={formInputSinifi}
                  value={form.yol}
                  onChange={(e) => setForm({ ...form, yol: e.target.value })}
                  placeholder="/hizmetler"
                />
              </FormAlani>
              <FormAlani etiket="Üst kategori">
                <select
                  className={formSelectSinifi}
                  value={form.ustKategoriId ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, ustKategoriId: e.target.value || null })
                  }
                >
                  <option value="">— Ana kategori (üst yok) —</option>
                  {ustSecenekleri.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.baslik}
                    </option>
                  ))}
                </select>
              </FormAlani>
              <FormAlani etiket="Sıra">
                <input
                  type="number"
                  min={0}
                  className={formInputSinifi}
                  value={form.sira}
                  onChange={(e) => setForm({ ...form, sira: Number(e.target.value) || 0 })}
                />
              </FormAlani>
              <FormAlani etiket="İkon (emoji)" aciklama="Opsiyonel">
                <input
                  className={formInputSinifi}
                  value={form.ikon}
                  onChange={(e) => setForm({ ...form, ikon: e.target.value })}
                  placeholder="💻"
                />
              </FormAlani>
            </div>
            <div className="ap-kategori-form-tam">
              <GorselAlan
                etiket="Kategori Görseli"
                deger={form.gorselUrl}
                onChange={(v) => setForm({ ...form, gorselUrl: v })}
              />
            </div>
            <AdminAnahtarDugme
              etiket="Aktif (sitede göster)"
              acik={form.aktif}
              onDegistir={(aktif: boolean) => setForm({ ...form, aktif })}
            />
          </AdminFormBolumu>

          <AdminFormBolumu
            baslik="Menü Önizleme"
            aciklama={
              !kategoriMenuAcik
                ? 'Menü kapalı — sitede Tüm Kategoriler butonu görünmez.'
                : `Header’daki “${header.kategori?.baslikMetni ?? 'Tüm Kategoriler'}” menüsü böyle görünür. Açılış modu Header Yönetimi’nden değişir.`
            }
          >
            {!kategoriMenuAcik ? (
              <div className="ap-kategori-onizleme-bos rounded-xl border border-dashed border-[var(--ap-border)] p-6 text-center">
                <p className="ap-muted text-sm">Kategori menüsü kapalı.</p>
              </div>
            ) : (
              <KategoriMenuOnizleme
                kategoriler={onizlemeAgaci}
                baslikMetni={header.kategori?.baslikMetni}
                acilisModu={kategoriAcilisModuNormalize(header.kategori?.acilisModu)}
              />
            )}
          </AdminFormBolumu>
        </div>
      </div>
    </AdminModulKabuk>
  );
}
