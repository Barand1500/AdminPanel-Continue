import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SeoGenelPanel,
  SeoMetaTablo,
  SeoSekmeCubugu,
  type SeoSekmeId,
} from '@/components/admin/seo/SeoBilesenleri';
import {
  AdminModulKabuk,
  AdminPanelKarti,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import {
  kategoriUrlOlustur,
  seoGenelGuncelle,
  seoKayitGuncelle,
  seoOzetGetir,
  type SeoGenelForm,
  type SeoKayit,
  type SeoOzet,
} from '@/features/admin/seoApi';

function ozettenKayitlar(ozet: SeoOzet, sekme: SeoSekmeId): SeoKayit[] {
  switch (sekme) {
    case 'kategori':
      return ozet.kategoriler.map((k) => ({
        id: k.id,
        etiket: k.ad,
        url: kategoriUrlOlustur(k, ozet.kategoriler),
        seoTitle: k.seoTitle ?? k.ad,
        seoDesc: k.seoDesc,
        tip: 'kategori',
        parentId: k.parentId,
        slug: k.slug,
      }));
    case 'sabit-sayfa':
      return ozet.sayfalar.map((s) => ({
        id: s.id,
        etiket: s.baslik,
        url: s.slug === 'anasayfa' || s.slug === 'home' ? '/' : `/${s.slug}`,
        seoTitle: s.seoTitle ?? s.baslik,
        seoDesc: s.seoDesc,
        tip: 'sayfa',
        slug: s.slug,
      }));
    default:
      return [];
  }
}

export function SeoYonetimiSayfasi() {
  const [sekme, setSekme] = useState<SeoSekmeId>('genel');
  const [ozet, setOzet] = useState<SeoOzet | null>(null);
  const [kayitlar, setKayitlar] = useState<SeoKayit[]>([]);
  const [orijinal, setOrijinal] = useState<Record<string, { seoTitle: string; seoDesc: string }>>({});
  const [genelForm, setGenelForm] = useState<SeoGenelForm>({
    seoBaslik: '',
    seoAciklama: '',
    seoAnahtar: '',
    ogGorselUrl: '',
  });
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [satirKayitId, setSatirKayitId] = useState<string | null>(null);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      const veri = await seoOzetGetir();
      setOzet(veri);
      setGenelForm({
        seoBaslik: veri.genel.seoBaslik ?? '',
        seoAciklama: veri.genel.seoAciklama ?? '',
        seoAnahtar: veri.genel.seoAnahtar ?? '',
        ogGorselUrl: veri.genel.ogGorselUrl ?? '',
      });
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'SEO verisi alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    void yukle();
  }, [yukle]);

  useEffect(() => {
    if (!ozet || sekme === 'genel') return;
    const liste = ozettenKayitlar(ozet, sekme);
    setKayitlar(liste);
    const harita: Record<string, { seoTitle: string; seoDesc: string }> = {};
    for (const k of liste) {
      harita[k.id] = { seoTitle: k.seoTitle ?? '', seoDesc: k.seoDesc ?? '' };
    }
    setOrijinal(harita);
  }, [ozet, sekme]);

  const kirliIdler = useMemo(() => {
    const ids = new Set<string>();
    for (const k of kayitlar) {
      const o = orijinal[k.id];
      if (!o) continue;
      if ((k.seoTitle ?? '') !== o.seoTitle || (k.seoDesc ?? '') !== o.seoDesc) {
        ids.add(k.id);
      }
    }
    return ids;
  }, [kayitlar, orijinal]);

  const sekmeSayilari = useMemo(
  () =>
    ozet
      ? {
          genel: 1,
          kategori: ozet.kategoriler.length,
          'sabit-sayfa': ozet.sayfalar.length,
        }
      : undefined,
    [ozet]
  );

  const genelKaydet = useCallback(async () => {
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      await seoGenelGuncelle(genelForm);
      setBasari('Genel SEO kaydedildi.');
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [genelForm, yukle]);

  useModulAksiyonlari(
    { kaydet: genelKaydet },
    { kaydet: sekme === 'genel' && !kaydediliyor }
  );

  function sekmeDegistir(yeni: SeoSekmeId) {
    setSekme(yeni);
    setBasari('');
    setHata('');
  }

  function kayitDegistir(id: string, alan: 'seoTitle' | 'seoDesc', deger: string) {
    setKayitlar((prev) => prev.map((k) => (k.id === id ? { ...k, [alan]: deger } : k)));
  }

  async function satirKaydet(id: string) {
    const kayit = kayitlar.find((k) => k.id === id);
    if (!kayit) return;
    setSatirKayitId(id);
    setHata('');
    setBasari('');
    try {
      await seoKayitGuncelle(kayit.tip, id, kayit.seoTitle ?? '', kayit.seoDesc ?? '');
      setOrijinal((prev) => ({
        ...prev,
        [id]: { seoTitle: kayit.seoTitle ?? '', seoDesc: kayit.seoDesc ?? '' },
      }));
      setBasari(`"${kayit.etiket}" SEO bilgisi güncellendi.`);
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setSatirKayitId(null);
    }
  }

  if (yukleniyor) {
    return (
      <AdminModulKabuk baslik="SEO Ayarları" onizleGoster={false}>
        <YukleniyorDurumu mesaj="SEO verileri yükleniyor..." />
      </AdminModulKabuk>
    );
  }

  return (
    <AdminModulKabuk
      baslik="SEO Ayarları"
      aciklama="Kategori ve sabit sayfalar için title ve description meta etiketlerini yönetin. Genel SEO için alt bardan Kaydet kullanın; satır bazlı kayıt için tablodaki + butonuna tıklayın."
      onizleGoster
    >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="Genel SEO kaydediliyor..." tur="bilgi" />}

      <SeoSekmeCubugu aktif={sekme} onDegistir={sekmeDegistir} sayilar={sekmeSayilari} />

      <div className="mt-5">
        {sekme === 'genel' && <SeoGenelPanel form={genelForm} onChange={setGenelForm} />}
        {sekme !== 'genel' && (
          <AdminPanelKarti
            baslik={
              sekme === 'kategori'
                ? 'Kategori SEO'
                : 'Sabit Sayfa SEO'
            }
            altBaslik="Her satırı düzenleyip yeşil + ile kaydedin"
          >
            <SeoMetaTablo
              kayitlar={kayitlar}
              kirliIdler={kirliIdler}
              kaydediliyorId={satirKayitId}
              onDegistir={kayitDegistir}
              onKaydet={(id) => void satirKaydet(id)}
            />
          </AdminPanelKarti>
        )}
      </div>
    </AdminModulKabuk>
  );
}
