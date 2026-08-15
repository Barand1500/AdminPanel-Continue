import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  varsayilanSayfaForm,
  SayfaEditorPanel,
  SayfaListesiPanel,
  sayfadanForm,
} from '@/components/admin/sayfa/SayfaBilesenleri';
import {
  AdminModulKabuk,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { AdminPilSekme } from '@/components/admin/ortak/AdminFormBilesenleri';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import {
  adminSayfaGuncelle,
  adminSayfaOlustur,
  adminSayfaSil,
  adminSayfaSirala,
  adminSayfalariGetir,
  type AdminSayfa,
  type SayfaFormDegeri,
} from '@/features/admin/sayfaApi';
import { widgetlariGetir } from '@/features/admin/widgetApi';
import type { AdminWidget } from '@/types/admin';
import { idString } from '@/utils/idKarsilastir';
import { sayfaSiraCakismasiBul, sonrakiSayfaSira } from '@/utils/sayfaSiraYardimci';

type SayfaGorunum = 'liste' | 'editor';

function ListeIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

function YeniSayfaIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M12 18v-6M9 15h6" />
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

export function SayfaYonetimiSayfasi() {
  const [sayfalar, setSayfalar] = useState<AdminSayfa[]>([]);
  const [widgetlar, setWidgetlar] = useState<AdminWidget[]>([]);
  const [form, setForm] = useState<SayfaFormDegeri>(() => varsayilanSayfaForm([]));
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [slugManuel, setSlugManuel] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [gorunum, setGorunum] = useState<SayfaGorunum>('liste');

  async function yukle() {
    setYukleniyor(true);
    try {
      const [sayfaListesi, widgetListesi] = await Promise.all([
        adminSayfalariGetir(),
        widgetlariGetir(),
      ]);
      setSayfalar(sayfaListesi);
      setWidgetlar(widgetListesi);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Sayfalar alinamadi');
    } finally {
      setYukleniyor(false);
    }
  }

  useEffect(() => {
    void yukle();
  }, []);

  useEffect(() => {
    if (seciliId != null) return;
    setForm((onceki) => {
      const sonraki = sonrakiSayfaSira(sayfalar, onceki.ustSayfaId);
      const cakisma = sayfaSiraCakismasiBul(sayfalar, onceki.sira, onceki.ustSayfaId);
      const varsayilanCakisma =
        sayfalar.length > 0 && onceki.sira === 1 && sonraki > 1;
      if (!cakisma && !varsayilanCakisma) return onceki;
      return onceki.sira === sonraki ? onceki : { ...onceki, sira: sonraki };
    });
  }, [sayfalar, seciliId]);

  const formuSifirla = useCallback(() => {
    setSeciliId(null);
    setForm(varsayilanSayfaForm(sayfalar));
    setSlugManuel(false);
    setBasari('');
    setHata('');
  }, [sayfalar]);

  const yeniBaslat = useCallback(() => {
    formuSifirla();
    setGorunum('editor');
  }, [formuSifirla]);

  const altSayfaBaslat = useCallback(
    (ustSayfa: AdminSayfa) => {
      setSeciliId(null);
      setForm(varsayilanSayfaForm(sayfalar, ustSayfa));
      setSlugManuel(false);
      setBasari('');
      setHata('');
      setGorunum('editor');
    },
    [sayfalar]
  );

  const kaydet = useCallback(async () => {
    if (!form.baslik.trim()) {
      setHata('Başlık zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      if (seciliId) {
        const guncellenen = await adminSayfaGuncelle(seciliId, form);
        setForm(sayfadanForm(guncellenen));
        setSeciliId(guncellenen.id);
        setBasari('Sayfa güncellendi.');
      } else {
        const olusturulan = await adminSayfaOlustur(form);
        setForm(sayfadanForm(olusturulan));
        setSeciliId(olusturulan.id);
        setSlugManuel(true);
        setBasari('Yeni sayfa oluşturuldu.');
      }
      setSayfalar(await adminSayfalariGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId]);

  const sil = useCallback(async () => {
    if (!seciliId || !confirm('Bu sayfayı silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    setHata('');
    try {
      await adminSayfaSil(seciliId);
      setBasari('Sayfa silindi.');
      formuSifirla();
      setGorunum('liste');
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliId, formuSifirla]);

  const sayfaSirala = useCallback(
    async (sayfaId: string, yon: 'yukari' | 'asagi') => {
      setKaydediliyor(true);
      setHata('');
      setBasari('');
      try {
        const liste = await adminSayfaSirala(sayfaId, yon, sayfalar);
        setSayfalar(liste);
        if (seciliId === sayfaId) {
          const guncel = liste.find((s) => s.id === sayfaId);
          if (guncel) setForm(sayfadanForm(guncel));
        }
        setBasari('Sıralama güncellendi.');
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Sıralama başarısız');
      } finally {
        setKaydediliyor(false);
      }
    },
    [seciliId, sayfalar]
  );

  const seciliSayfaWidgetlari = useMemo(() => {
    if (!seciliId) return [];
    return widgetlar.filter((w) => w.sayfaId && idString(w.sayfaId) === seciliId);
  }, [widgetlar, seciliId]);

  const duzenlemeyeGit = useCallback(() => {
    if (!seciliId) return;
    setGorunum('editor');
  }, [seciliId]);

  useModulAksiyonlari(
    {
      kaydet,
      ekle: yeniBaslat,
      altEkle: () => {
        const secili = sayfalar.find((s) => s.id === seciliId);
        if (secili) altSayfaBaslat(secili);
      },
      sil,
      duzenle: duzenlemeyeGit,
    },
    {
      kaydet: gorunum === 'editor' && !kaydediliyor && (!!seciliId || Boolean(form.baslik.trim())),
      ekle: true,
      altEkle: !!seciliId && gorunum === 'liste' && !kaydediliyor,
      sil: !!seciliId && !kaydediliyor,
      duzenle: !!seciliId && gorunum === 'liste' && !kaydediliyor,
    }
  );

  function sayfaSec(s: AdminSayfa) {
    setSeciliId(s.id);
    setForm(sayfadanForm(s));
    setSlugManuel(true);
    setBasari('');
    setHata('');
  }

  function sayfaDuzenleAc(s: AdminSayfa) {
    sayfaSec(s);
    setGorunum('editor');
  }

  function gorunumDegistir(id: SayfaGorunum) {
    if (id === gorunum) return;
    if (id === 'liste') {
      setGorunum('liste');
      return;
    }
    yeniBaslat();
  }

  useEffect(() => {
    function sayfaSecHandler(e: Event) {
      const id = (e as CustomEvent<{ sayfaId?: string }>).detail?.sayfaId;
      if (!id) return;
      const s = sayfalar.find((x) => x.id === id);
      if (s) sayfaDuzenleAc(s);
    }
    function yeniSayfaHandler() {
      yeniBaslat();
    }
    window.addEventListener('ap-admin-sayfa-sec', sayfaSecHandler);
    window.addEventListener('ap-admin-yeni-sayfa', yeniSayfaHandler);
    return () => {
      window.removeEventListener('ap-admin-sayfa-sec', sayfaSecHandler);
      window.removeEventListener('ap-admin-yeni-sayfa', yeniSayfaHandler);
    };
  }, [sayfalar, yeniBaslat]);

  return (
    <AdminModulKabuk
      onizleGoster={false}
      ustIcerik={
        <AdminPilSekme
          sekmeler={[
            { id: 'liste', etiket: 'Sayfa Listesi', ikon: <ListeIkon /> },
            {
              id: 'editor',
              etiket: gorunum === 'editor' && seciliId ? 'Düzenleme' : 'Yeni Sayfa',
              ikon: gorunum === 'editor' && seciliId ? <DuzenlemeIkon /> : <YeniSayfaIkon />,
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

      {yukleniyor ? (
        <YukleniyorDurumu mesaj="Sayfalar yükleniyor..." />
      ) : gorunum === 'liste' ? (
        <SayfaListesiPanel
          sayfalar={sayfalar}
          seciliId={seciliId}
          onSec={sayfaSec}
          onSirala={sayfaSirala}
          islemde={kaydediliyor}
          tamGenislik
        />
      ) : (
        <SayfaEditorPanel
          form={form}
          seciliId={seciliId}
          slugManuel={slugManuel}
          sayfalar={sayfalar}
          sayfaWidgetlari={seciliSayfaWidgetlari}
          onChange={setForm}
          onSlugManuelChange={setSlugManuel}
          onAltSayfaEkle={altSayfaBaslat}
          onSayfaSec={sayfaSec}
          onSirala={sayfaSirala}
          islemde={kaydediliyor}
        />
      )}
    </AdminModulKabuk>
  );
}
