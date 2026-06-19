import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SeoGenelPanel,
  SeoMetaTablo,
  SeoSekmeCubugu,
  type SeoSekmeId,
} from '@/components/admin/seo/SeoBilesenleri';
import { SeoLinkEkleModal } from '@/components/admin/seo/SeoLinkEkleModal';
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
  seoOzetGetir,
  seoTopluKaydet,
  seoUrlNormalize,
  yeniYonlendirmeId,
  yonlendirmeleriNormalize,
  type SeoGenelForm,
  type SeoKayit,
  type SeoOzet,
  type SeoYonlendirme,
} from '@/features/admin/seoApi';

function sekmeHedefTip(sekme: SeoSekmeId): SeoKayit['tip'] | null {
  if (sekme === 'kategori') return 'kategori';
  if (sekme === 'sabit-sayfa') return 'sayfa';
  return null;
}

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
        id: String(s.id),
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
  const [yonlendirmeler, setYonlendirmeler] = useState<SeoYonlendirme[]>([]);
  const [orijinal, setOrijinal] = useState<Record<string, { seoTitle: string; seoDesc: string }>>({});
  const [orijinalYonl, setOrijinalYonl] = useState<
    Record<string, { kaynakUrl: string; seoTitle: string; seoDesc: string }>
  >({});
  const [genelForm, setGenelForm] = useState<SeoGenelForm>({
    seoBaslik: '',
    seoAciklama: '',
    seoAnahtar: '',
    ogGorselUrl: '',
  });
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [linkModalHedef, setLinkModalHedef] = useState<SeoKayit | null>(null);

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

    const hedefTip = sekmeHedefTip(sekme);
    const yonl = yonlendirmeleriNormalize(ozet.yonlendirmeler).filter(
      (y) => y.hedefTip === hedefTip
    );
    setYonlendirmeler(yonl);

    const harita: Record<string, { seoTitle: string; seoDesc: string }> = {};
    for (const k of liste) {
      harita[k.id] = { seoTitle: k.seoTitle ?? '', seoDesc: k.seoDesc ?? '' };
    }
    setOrijinal(harita);

    const yHarita: Record<string, { kaynakUrl: string; seoTitle: string; seoDesc: string }> = {};
    for (const y of yonl) {
      yHarita[y.id] = {
        kaynakUrl: y.kaynakUrl,
        seoTitle: y.seoTitle ?? '',
        seoDesc: y.seoDesc ?? '',
      };
    }
    setOrijinalYonl(yHarita);
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

  const kirliYonlendirmeIdler = useMemo(() => {
    const ids = new Set<string>();
    for (const y of yonlendirmeler) {
      if (y.silindi) {
        if (!y.yeni) ids.add(y.id);
        continue;
      }
      const o = orijinalYonl[y.id];
      if (y.yeni || !o) {
        ids.add(y.id);
        continue;
      }
      if (
        y.kaynakUrl !== o.kaynakUrl ||
        (y.seoTitle ?? '') !== o.seoTitle ||
        (y.seoDesc ?? '') !== o.seoDesc
      ) {
        ids.add(y.id);
      }
    }
    return ids;
  }, [yonlendirmeler, orijinalYonl]);

  const tabloKirli = kirliIdler.size > 0 || kirliYonlendirmeIdler.size > 0;

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
      throw err;
    } finally {
      setKaydediliyor(false);
    }
  }, [genelForm, yukle]);

  const topluKaydet = useCallback(async () => {
    if (!tabloKirli) return;
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      const kayitPayload = kayitlar
        .filter((k) => kirliIdler.has(k.id))
        .map((k) => ({
          tip: k.tip,
          id: k.id,
          seoTitle: k.seoTitle?.trim() || null,
          seoDesc: k.seoDesc?.trim() || null,
        }));

      const yonlPayload = yonlendirmeler
        .filter((y) => kirliYonlendirmeIdler.has(y.id) || y.silindi)
        .map((y) => ({
          id: y.yeni ? undefined : y.id,
          hedefTip: y.hedefTip,
          hedefId: y.hedefId,
          kaynakUrl: y.kaynakUrl,
          seoTitle: y.seoTitle?.trim() || null,
          seoDesc: y.seoDesc?.trim() || null,
          kod: y.kod,
          sil: y.silindi,
        }));

      const guncel = await seoTopluKaydet({
        kayitlar: kayitPayload,
        yonlendirmeler: yonlPayload,
      });
      setOzet(guncel);
      setBasari('SEO ve 301 yönlendirmeleri kaydedildi.');
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
      throw err;
    } finally {
      setKaydediliyor(false);
    }
  }, [tabloKirli, kayitlar, kirliIdler, yonlendirmeler, kirliYonlendirmeIdler]);

  useModulAksiyonlari(
    { kaydet: sekme === 'genel' ? genelKaydet : topluKaydet },
    {
      kaydet:
        !kaydediliyor && (sekme === 'genel' || tabloKirli),
    }
  );

  function sekmeDegistir(yeni: SeoSekmeId) {
    setSekme(yeni);
    setBasari('');
    setHata('');
  }

  function kayitDegistir(id: string, alan: 'seoTitle' | 'seoDesc', deger: string) {
    setKayitlar((prev) => prev.map((k) => (k.id === id ? { ...k, [alan]: deger } : k)));
  }

  function yonlendirmeDegistir(id: string, alan: 'seoTitle' | 'seoDesc', deger: string) {
    setYonlendirmeler((prev) => prev.map((y) => (y.id === id ? { ...y, [alan]: deger } : y)));
  }

  function yonlendirmeSil(id: string) {
    setYonlendirmeler((prev) =>
      prev.map((y) => (y.id === id ? { ...y, silindi: true } : y))
    );
  }

  function linkEkle(deger: { kaynakUrl: string; seoTitle: string; seoDesc: string }) {
    if (!linkModalHedef) return;
    const url = seoUrlNormalize(deger.kaynakUrl);
    const cakisan = yonlendirmeler.some((y) => !y.silindi && y.kaynakUrl === url);
    if (cakisan) {
      setHata(`Bu URL zaten tanımlı: ${url}`);
      return;
    }
    setYonlendirmeler((prev) => [
      ...prev,
      {
        id: yeniYonlendirmeId(),
        hedefTip: linkModalHedef.tip,
        hedefId: linkModalHedef.id,
        kaynakUrl: url,
        seoTitle: deger.seoTitle,
        seoDesc: deger.seoDesc || null,
        kod: 301,
        yeni: true,
      },
    ]);
    setBasari('');
    setHata('');
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
      aciklama="Title, description ve 301 yönlendirmelerini yönetin. Yeşil + ile 301 ekleyin; kaydetmek için alttaki Kaydet veya üst aksiyon çubuğunu kullanın."
      onizleGoster
    >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="Kaydediliyor..." tur="bilgi" />}

      <SeoSekmeCubugu aktif={sekme} onDegistir={sekmeDegistir} sayilar={sekmeSayilari} />

      <div className="mt-5">
        {sekme === 'genel' && <SeoGenelPanel form={genelForm} onChange={setGenelForm} />}
        {sekme !== 'genel' && (
          <AdminPanelKarti
            baslik={sekme === 'kategori' ? 'Kategori SEO' : 'Sabit Sayfa SEO'}
            altBaslik="301 yönlendirmeleri ana URL altında listelenir"
          >
            <SeoMetaTablo
              kayitlar={kayitlar}
              yonlendirmeler={yonlendirmeler}
              kirliIdler={kirliIdler}
              kirliYonlendirmeIdler={kirliYonlendirmeIdler}
              kaydediliyor={kaydediliyor}
              onDegistir={kayitDegistir}
              onYonlendirmeDegistir={yonlendirmeDegistir}
              onYonlendirmeSil={yonlendirmeSil}
              onLinkEkleTikla={setLinkModalHedef}
              onTopluKaydet={() => void topluKaydet()}
              kaydetAktif={tabloKirli}
            />
          </AdminPanelKarti>
        )}
      </div>

      <SeoLinkEkleModal
        acik={!!linkModalHedef}
        hedefUrl={linkModalHedef?.url ?? '/'}
        onKapat={() => setLinkModalHedef(null)}
        onEkle={linkEkle}
      />
    </AdminModulKabuk>
  );
}
