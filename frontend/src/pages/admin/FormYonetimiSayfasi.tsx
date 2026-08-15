import { useCallback, useEffect, useState } from 'react';
import { FormEditorKabuk } from '@/components/admin/form/FormEditorKabuk';
import { FormGonderimPanel } from '@/components/admin/form/FormGonderimPanel';
import { FormListePanel } from '@/components/admin/form/FormListePanel';
import { FormOnizlemeModal } from '@/components/admin/form/FormOnizlemeSekme';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import {
  AdminModulKabuk,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { AdminPilSekme } from '@/components/admin/ortak/AdminFormBilesenleri';
import {
  adminFormGonderimleriGetir,
  adminFormGuncelle,
  adminFormOlustur,
  adminFormSil,
  adminFormlariGetir,
  adminGonderimOkundu,
  adminGonderimSil,
  bosForm,
  formdanDeger,
  type AdminForm,
  type FormGonderim,
} from '@/features/admin/formApi';

type Gorunum = 'liste' | 'editor' | 'gonderimler';

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

function GonderimIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M4 5h16v12H4z" />
      <path d="M4 9h16M8 17v2M16 17v2M9 13h6" />
    </svg>
  );
}

export function FormYonetimiSayfasi() {
  const [formlar, setFormlar] = useState<AdminForm[]>([]);
  const [form, setForm] = useState(bosForm);
  const [gonderimler, setGonderimler] = useState<FormGonderim[]>([]);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [gorunum, setGorunum] = useState<Gorunum>('liste');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [onizlemeAcik, setOnizlemeAcik] = useState(false);

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      setFormlar(await adminFormlariGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Formlar alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  async function gonderimleriYukle(formId: string) {
    try {
      setGonderimler(await adminFormGonderimleriGetir(formId));
    } catch {
      setGonderimler([]);
    }
  }

  useEffect(() => {
    void yukle();
  }, [yukle]);

  const formuSifirla = useCallback(() => {
    setSeciliId(null);
    setForm(bosForm);
    setGonderimler([]);
    setBasari('');
    setHata('');
  }, []);

  const yeniBaslat = useCallback(() => {
    formuSifirla();
    setGorunum('editor');
  }, [formuSifirla]);

  const kaydet = useCallback(async () => {
    if (!form.ad.trim()) {
      setHata('Form adı zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      if (seciliId) {
        const g = await adminFormGuncelle(seciliId, form);
        setForm(formdanDeger(g));
        setBasari('Form güncellendi.');
      } else {
        const o = await adminFormOlustur(form);
        setForm(formdanDeger(o));
        setSeciliId(o.id);
        setBasari('Form oluşturuldu.');
      }
      setFormlar(await adminFormlariGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId]);

  const sil = useCallback(async () => {
    if (!seciliId || !confirm('Bu formu silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await adminFormSil(seciliId);
      setBasari('Form silindi.');
      formuSifirla();
      setGorunum('liste');
      await yukle();
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
      kaydet: gorunum === 'editor' && !kaydediliyor && Boolean(form.ad.trim()),
      ekle: gorunum !== 'gonderimler',
      sil: gorunum !== 'gonderimler' && !!seciliId && !kaydediliyor,
      duzenle: !!seciliId && gorunum !== 'editor' && !kaydediliyor,
      onizle: true,
    }
  );

  function formYukle(f: AdminForm) {
    setSeciliId(f.id);
    setForm(formdanDeger(f));
    setBasari('');
    setHata('');
    void gonderimleriYukle(f.id);
  }

  function formSec(f: AdminForm) {
    formYukle(f);
    setGorunum('editor');
  }

  function gonderimFormSec(id: string) {
    if (!id) {
      setSeciliId(null);
      setGonderimler([]);
      return;
    }
    const f = formlar.find((x) => x.id === id);
    if (f) formYukle(f);
  }

  async function okunduIsaretle(gonderimId: string) {
    if (!seciliId) return;
    await adminGonderimOkundu(seciliId, gonderimId);
    await gonderimleriYukle(seciliId);
  }

  async function gonderimSilHandler(gonderimId: string) {
    if (!seciliId || !confirm('Gönderimi silmek istiyor musunuz?')) return;
    await adminGonderimSil(seciliId, gonderimId);
    await gonderimleriYukle(seciliId);
  }

  function gorunumDegistir(id: Gorunum) {
    if (id === gorunum) return;
    if (id === 'liste' || id === 'gonderimler') {
      setGorunum(id);
      return;
    }
    if (seciliId) {
      setGorunum('editor');
      return;
    }
    yeniBaslat();
  }

  const editorEtiket = gorunum === 'editor' && seciliId ? 'Düzenleme' : 'Yeni Form';

  if (yukleniyor) {
    return (
      <AdminModulKabuk onizleGoster={false}>
        <YukleniyorDurumu mesaj="Formlar yükleniyor..." />
      </AdminModulKabuk>
    );
  }

  return (
    <AdminModulKabuk
      onizleGoster={false}
      ustIcerik={
        <AdminPilSekme
          sekmeler={[
            { id: 'liste', etiket: 'Form Listesi', ikon: <ListeIkon /> },
            {
              id: 'editor',
              etiket: editorEtiket,
              ikon: gorunum === 'editor' && seciliId ? <DuzenlemeIkon /> : <YeniIkon />,
            },
            { id: 'gonderimler', etiket: 'Gönderimler', ikon: <GonderimIkon /> },
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
        <FormListePanel formlar={formlar} seciliId={seciliId} onSec={formSec} />
      )}
      {gorunum === 'editor' && (
        <FormEditorKabuk form={form} seciliId={seciliId} onChange={setForm} />
      )}
      {gorunum === 'gonderimler' && (
        <FormGonderimPanel
          formlar={formlar}
          gonderimler={gonderimler}
          seciliId={seciliId}
          onFormSec={gonderimFormSec}
          onOkundu={okunduIsaretle}
          onSil={gonderimSilHandler}
        />
      )}

      <FormOnizlemeModal
        acik={onizlemeAcik}
        form={form}
        kayitliSlug={seciliId ? form.slug : null}
        onKapat={() => setOnizlemeAcik(false)}
      />
    </AdminModulKabuk>
  );
}
