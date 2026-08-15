import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SeoGenelPanel,
  SeoKayitEditorPanel,
  SeoUrlListesiPanel,
  type SeoSekmeId,
} from '@/components/admin/seo/SeoBilesenleri';
import { SeoLinkEkleModal } from '@/components/admin/seo/SeoLinkEkleModal';
import { SeoOnizlemeModal } from '@/components/admin/seo/SeoOnizlemeModal';
import {
  AdminModulKabuk,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { AdminPilSekme } from '@/components/admin/ortak/AdminFormBilesenleri';
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

function GenelIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
    </svg>
  );
}

function ListeIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
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

type Gorunum = 'liste' | 'editor';

export function SeoYonetimiSayfasi() {
  const [sekme, setSekme] = useState<SeoSekmeId>('genel');
  const [gorunum, setGorunum] = useState<Gorunum>('liste');
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
  const [seciliKayitId, setSeciliKayitId] = useState<string | null>(null);
  const [seciliYonlendirmeId, setSeciliYonlendirmeId] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [linkModalHedef, setLinkModalHedef] = useState<SeoKayit | null>(null);
  const [onizlemeAcik, setOnizlemeAcik] = useState(false);

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
    const yonl = yonlendirmeleriNormalize(ozet.yonlendirmeler).filter((y) => y.hedefTip === hedefTip);
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
  const seciliKayit = kayitlar.find((k) => k.id === seciliKayitId) ?? null;
  const urlSekmesi = sekme !== 'genel';
  const editorAcik = urlSekmesi && gorunum === 'editor' && !!seciliKayit;

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
      setSeciliYonlendirmeId(null);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
      throw err;
    } finally {
      setKaydediliyor(false);
    }
  }, [tabloKirli, kayitlar, kirliIdler, yonlendirmeler, kirliYonlendirmeIdler]);

  const kaydet = useCallback(async () => {
    if (sekme === 'genel') await genelKaydet();
    else await topluKaydet();
  }, [sekme, genelKaydet, topluKaydet]);

  const duzenlemeyeGit = useCallback(() => {
    if (!seciliKayitId) return;
    setGorunum('editor');
    setSeciliYonlendirmeId(null);
    setBasari('');
    setHata('');
  }, [seciliKayitId]);

  const ekle = useCallback(() => {
    if (!seciliKayit) return;
    setLinkModalHedef(seciliKayit);
  }, [seciliKayit]);

  const sil = useCallback(() => {
    if (!seciliYonlendirmeId) return;
    setYonlendirmeler((prev) =>
      prev.map((y) => (y.id === seciliYonlendirmeId ? { ...y, silindi: true } : y))
    );
    setSeciliYonlendirmeId(null);
  }, [seciliYonlendirmeId]);

  const onizle = useCallback(() => setOnizlemeAcik(true), []);

  useModulAksiyonlari(
    {
      kaydet,
      ekle,
      sil,
      duzenle: duzenlemeyeGit,
      onizle,
    },
    {
      kaydet: !kaydediliyor && (sekme === 'genel' || tabloKirli),
      ekle: editorAcik && !kaydediliyor,
      sil: editorAcik && !!seciliYonlendirmeId && !kaydediliyor,
      duzenle: urlSekmesi && gorunum === 'liste' && !!seciliKayitId && !kaydediliyor,
      onizle: sekme === 'genel' || !!seciliKayit,
    }
  );

  function sekmeDegistir(yeni: SeoSekmeId) {
    if (yeni === sekme) {
      if (gorunum === 'editor') setGorunum('liste');
      return;
    }
    setSekme(yeni);
    setGorunum('liste');
    setSeciliKayitId(null);
    setSeciliYonlendirmeId(null);
    setBasari('');
    setHata('');
  }

  function kayitSec(kayit: SeoKayit) {
    setSeciliKayitId(kayit.id);
    setSeciliYonlendirmeId(null);
    setBasari('');
    setHata('');
  }

  function kayitDegistir(alan: 'seoTitle' | 'seoDesc', deger: string) {
    if (!seciliKayitId) return;
    setKayitlar((prev) => prev.map((k) => (k.id === seciliKayitId ? { ...k, [alan]: deger } : k)));
  }

  function yonlendirmeDegistir(id: string, alan: 'seoTitle' | 'seoDesc', deger: string) {
    setYonlendirmeler((prev) => prev.map((y) => (y.id === id ? { ...y, [alan]: deger } : y)));
  }

  function yonlendirmeSil(id: string) {
    setYonlendirmeler((prev) => prev.map((y) => (y.id === id ? { ...y, silindi: true } : y)));
    if (seciliYonlendirmeId === id) setSeciliYonlendirmeId(null);
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

  const onizlemeKayit = sekme === 'genel' ? null : seciliKayit;
  const onizlemeBaslik = onizlemeKayit?.seoTitle ?? genelForm.seoBaslik;
  const onizlemeAciklama = onizlemeKayit?.seoDesc ?? genelForm.seoAciklama;
  const onizlemeUrl = onizlemeKayit?.url ?? 'siteniz.com';

  const kategoriEtiket = sekme === 'kategori' && gorunum === 'editor' ? 'Düzenleme' : 'Kategori';
  const sayfaEtiket = sekme === 'sabit-sayfa' && gorunum === 'editor' ? 'Düzenleme' : 'Sabit Sayfa';

  if (yukleniyor) {
    return (
      <AdminModulKabuk onizleGoster={false}>
        <YukleniyorDurumu mesaj="SEO verileri yükleniyor..." />
      </AdminModulKabuk>
    );
  }

  return (
    <AdminModulKabuk
      onizleGoster={false}
      ustIcerik={
        <AdminPilSekme
          sekmeler={[
            { id: 'genel', etiket: 'Genel', ikon: <GenelIkon /> },
            {
              id: 'kategori',
              etiket: kategoriEtiket,
              ikon: sekme === 'kategori' && gorunum === 'editor' ? <DuzenlemeIkon /> : <ListeIkon />,
            },
            {
              id: 'sabit-sayfa',
              etiket: sayfaEtiket,
              ikon: sekme === 'sabit-sayfa' && gorunum === 'editor' ? <DuzenlemeIkon /> : <ListeIkon />,
            },
          ]}
          aktif={sekme}
          onDegistir={sekmeDegistir}
        />
      }
    >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="Kaydediliyor..." tur="bilgi" />}

      {sekme === 'genel' && <SeoGenelPanel form={genelForm} onChange={setGenelForm} />}

      {urlSekmesi && gorunum === 'liste' && (
        <SeoUrlListesiPanel
          kayitlar={kayitlar}
          yonlendirmeler={yonlendirmeler}
          kirliIdler={kirliIdler}
          kirliYonlendirmeIdler={kirliYonlendirmeIdler}
          seciliId={seciliKayitId}
          baslik={sekme === 'kategori' ? 'Kategori SEO' : 'Sayfa SEO'}
          onSec={kayitSec}
        />
      )}

      {editorAcik && seciliKayit && (
        <SeoKayitEditorPanel
          kayit={seciliKayit}
          yonlendirmeler={yonlendirmeler}
          seciliYonlendirmeId={seciliYonlendirmeId}
          onDegistir={kayitDegistir}
          onYonlendirmeDegistir={yonlendirmeDegistir}
          onYonlendirmeSec={setSeciliYonlendirmeId}
          onYonlendirmeSil={yonlendirmeSil}
        />
      )}

      <SeoLinkEkleModal
        acik={!!linkModalHedef}
        hedefUrl={linkModalHedef?.url ?? '/'}
        onKapat={() => setLinkModalHedef(null)}
        onEkle={linkEkle}
      />

      <SeoOnizlemeModal
        acik={onizlemeAcik}
        baslik={onizlemeBaslik ?? ''}
        aciklama={onizlemeAciklama ?? ''}
        url={onizlemeUrl}
        onKapat={() => setOnizlemeAcik(false)}
      />
    </AdminModulKabuk>
  );
}
