import { useCallback, useEffect, useState } from 'react';
import { MedyaGrid, MedyaYukleyici } from '@/components/admin/medya/MedyaBilesenleri';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import {
  adminMedyaOlustur,
  adminMedyaSil,
  adminMedyaTopluSil,
  adminMedyaTopluYukle,
  adminMedyalariGetir,
  type AdminMedya,
} from '@/features/admin/medyaApi';

export function MedyaGalerisiSayfasi() {
  const [medyalar, setMedyalar] = useState<AdminMedya[]>([]);
  const [urlForm, setUrlForm] = useState({ ad: '', url: '' });
  const [seciliIds, setSeciliIds] = useState<string[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [islemYapiliyor, setIslemYapiliyor] = useState(false);
  const [yuklemeIlerleme, setYuklemeIlerleme] = useState<{ tamamlanan: number; toplam: number } | null>(null);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  async function yukle() {
    setYukleniyor(true);
    try {
      setMedyalar(await adminMedyalariGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Medyalar alinamadi');
    } finally {
      setYukleniyor(false);
    }
  }

  useEffect(() => {
    void yukle();
  }, []);

  const urlEkle = useCallback(async () => {
    if (!urlForm.ad.trim() || !urlForm.url.trim()) {
      setHata('Medya adı ve URL zorunludur');
      return;
    }
    setIslemYapiliyor(true);
    setHata('');
    try {
      await adminMedyaOlustur(urlForm.ad, urlForm.url);
      setUrlForm({ ad: '', url: '' });
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Medya eklenemedi');
    } finally {
      setIslemYapiliyor(false);
    }
  }, [urlForm, yukle]);

  const sil = useCallback(async () => {
    if (seciliIds.length === 0) return;
    const mesaj =
      seciliIds.length === 1
        ? 'Bu medyayı silmek istediğinize emin misiniz?'
        : `${seciliIds.length} medyayı silmek istediğinize emin misiniz?`;
    if (!confirm(mesaj)) return;
    setIslemYapiliyor(true);
    try {
      if (seciliIds.length === 1) {
        await adminMedyaSil(seciliIds[0]);
      } else {
        await adminMedyaTopluSil(seciliIds);
      }
      setSeciliIds([]);
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setIslemYapiliyor(false);
    }
  }, [seciliIds, yukle]);

  useModulAksiyonlari(
    { kaydet: urlEkle, sil },
    {
      kaydet: !islemYapiliyor && Boolean(urlForm.ad.trim() && urlForm.url.trim()),
      sil: seciliIds.length > 0 && !islemYapiliyor,
    }
  );

  async function dosyalariYukle(dosyalar: File[]) {
    if (dosyalar.length === 0) {
      setHata('Yüklenecek geçerli görsel dosyası bulunamadı');
      return;
    }
    setIslemYapiliyor(true);
    setHata('');
    setBasari('');
    setYuklemeIlerleme({ tamamlanan: 0, toplam: dosyalar.length });
    try {
      const sonuc = await adminMedyaTopluYukle(dosyalar, (tamamlanan, toplam) => {
        setYuklemeIlerleme({ tamamlanan, toplam });
      });
      await yukle();
      if (sonuc.basarili.length > 0) {
        setBasari(`${sonuc.basarili.length} görsel başarıyla yüklendi.`);
      }
      if (sonuc.hatalar.length > 0) {
        const detay = sonuc.hatalar.map((h) => `${h.dosyaAdi}: ${h.mesaj}`).join(' · ');
        setHata(sonuc.basarili.length > 0 ? `Bazı dosyalar yüklenemedi: ${detay}` : detay);
      }
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Dosyalar yüklenemedi');
    } finally {
      setIslemYapiliyor(false);
      setYuklemeIlerleme(null);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-white">Medya Galerisi</h1>
      <p className="mt-1 text-sm text-slate-400">
        Görselleri toplu sürükleyip bırakın veya seçin. URL ile tek tek de ekleyebilirsiniz. Silmek için medya seçip alt bardan Sil kullanın.
      </p>
      {basari && <p className="mt-4 text-sm text-green-400">{basari}</p>}
      {hata && <p className="mt-4 text-sm text-red-400">{hata}</p>}
      {islemYapiliyor && !yuklemeIlerleme && <p className="mt-4 text-sm text-slate-400">İşlem yapılıyor...</p>}

      <div className="mt-6">
        <MedyaYukleyici
          urlForm={urlForm}
          yukleniyor={islemYapiliyor}
          yuklemeIlerleme={yuklemeIlerleme}
          onUrlFormChange={setUrlForm}
          onDosyalarSec={dosyalariYukle}
        />
      </div>

      <div className="mt-8">
        {yukleniyor ? (
          <p className="text-sm text-slate-400">Yükleniyor...</p>
        ) : (
          <MedyaGrid
            medyalar={medyalar}
            seciliIds={seciliIds}
            onSecToggle={(id) =>
              setSeciliIds((onceki) =>
                onceki.includes(id) ? onceki.filter((x) => x !== id) : [...onceki, id]
              )
            }
            onHepsiniSec={() => setSeciliIds(medyalar.map((m) => m.id))}
            onSecimiTemizle={() => setSeciliIds([])}
          />
        )}
      </div>
    </div>
  );
}
