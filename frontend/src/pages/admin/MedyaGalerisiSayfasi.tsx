import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MedyaGrid, MedyaOnizlemeModal, MedyaYukleyici } from '@/components/admin/medya/MedyaBilesenleri';
import { AdminModulKabuk, YukleniyorDurumu } from '@/components/admin/ortak/AdminBilesenleri';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import {
  adminMedyaOlustur,
  adminMedyaSil,
  adminMedyaTopluSil,
  adminMedyaTopluYukle,
  adminMedyalariGetir,
  type AdminMedya,
} from '@/features/admin/medyaApi';
import { adminIslemBildirimi } from '@/utils/adminBildirimOlaylari';

export function MedyaGalerisiSayfasi() {
  const [medyalar, setMedyalar] = useState<AdminMedya[]>([]);
  const [urlForm, setUrlForm] = useState({ ad: '', url: '' });
  const [seciliIds, setSeciliIds] = useState<string[]>([]);
  const [arama, setArama] = useState('');
  const [onizlenen, setOnizlenen] = useState<AdminMedya | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [islemYapiliyor, setIslemYapiliyor] = useState(false);
  const [yuklemeIlerleme, setYuklemeIlerleme] = useState<{ tamamlanan: number; toplam: number } | null>(null);
  const dosyaInputRef = useRef<HTMLInputElement>(null);

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      setMedyalar(await adminMedyalariGetir());
    } catch (err) {
      adminIslemBildirimi(err instanceof Error ? err.message : 'Medyalar alınamadı', 'hata');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    void yukle();
  }, [yukle]);

  const filtreli = useMemo(() => {
    const q = arama.toLowerCase().trim();
    if (!q) return medyalar;
    return medyalar.filter((m) => m.ad.toLowerCase().includes(q));
  }, [medyalar, arama]);

  const urlEkle = useCallback(async () => {
    if (!urlForm.ad.trim() || !urlForm.url.trim()) {
      adminIslemBildirimi('Medya adı ve adres gerekli', 'hata');
      return;
    }
    setIslemYapiliyor(true);
    try {
      await adminMedyaOlustur(urlForm.ad, urlForm.url);
      setUrlForm({ ad: '', url: '' });
      await yukle();
      adminIslemBildirimi('Görsel eklendi', 'basari');
    } catch (err) {
      adminIslemBildirimi(err instanceof Error ? err.message : 'Medya eklenemedi', 'hata');
    } finally {
      setIslemYapiliyor(false);
    }
  }, [urlForm, yukle]);

  const sil = useCallback(async () => {
    if (seciliIds.length === 0) return;
    const mesaj =
      seciliIds.length === 1
        ? 'Bu görsel silinsin mi?'
        : `${seciliIds.length} görsel silinsin mi?`;
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
      adminIslemBildirimi(err instanceof Error ? err.message : 'Silme başarısız', 'hata');
    } finally {
      setIslemYapiliyor(false);
    }
  }, [seciliIds, yukle]);

  useModulAksiyonlari(
    {
      kaydet: urlEkle,
      ekle: () => dosyaInputRef.current?.click(),
      sil,
    },
    {
      kaydet: !islemYapiliyor && Boolean(urlForm.ad.trim() && urlForm.url.trim()),
      ekle: !islemYapiliyor,
      sil: seciliIds.length > 0 && !islemYapiliyor,
    }
  );

  async function dosyalariYukle(dosyalar: File[]) {
    if (dosyalar.length === 0) {
      adminIslemBildirimi('Yüklenecek geçerli görsel bulunamadı', 'hata');
      return;
    }
    setIslemYapiliyor(true);
    setYuklemeIlerleme({ tamamlanan: 0, toplam: dosyalar.length });
    try {
      const sonuc = await adminMedyaTopluYukle(dosyalar, (tamamlanan, toplam) => {
        setYuklemeIlerleme({ tamamlanan, toplam });
      });
      await yukle();
      if (sonuc.basarili.length > 0) {
        adminIslemBildirimi(`${sonuc.basarili.length} görsel yüklendi`, 'basari');
      }
      if (sonuc.hatalar.length > 0) {
        const detay = sonuc.hatalar.map((h) => `${h.dosyaAdi}: ${h.mesaj}`).join(' · ');
        adminIslemBildirimi(
          sonuc.basarili.length > 0 ? `Bazı dosyalar yüklenemedi: ${detay}` : detay,
          'hata'
        );
      }
    } catch (err) {
      adminIslemBildirimi(err instanceof Error ? err.message : 'Dosyalar yüklenemedi', 'hata');
    } finally {
      setIslemYapiliyor(false);
      setYuklemeIlerleme(null);
    }
  }

  return (
    <AdminModulKabuk onizleGoster={false} baslik="Medya Galerisi" aciklama="Görselleri yükleyin, seçin, kopyalayın.">
      <div className="ap-medya">
        <MedyaYukleyici
          urlForm={urlForm}
          yukleniyor={islemYapiliyor}
          yuklemeIlerleme={yuklemeIlerleme}
          kompakt={medyalar.length > 0}
          dosyaInputRef={dosyaInputRef}
          onUrlFormChange={setUrlForm}
          onUrlEkle={() => void urlEkle()}
          onDosyalarSec={(d) => void dosyalariYukle(d)}
        />

        {yukleniyor ? (
          <YukleniyorDurumu mesaj="Galeri yükleniyor..." />
        ) : (
          <MedyaGrid
            medyalar={filtreli}
            seciliIds={seciliIds}
            arama={arama}
            onArama={setArama}
            onSecToggle={(id) =>
              setSeciliIds((onceki) =>
                onceki.includes(id) ? onceki.filter((x) => x !== id) : [...onceki, id]
              )
            }
            onHepsiniSec={() => setSeciliIds(filtreli.map((m) => m.id))}
            onSecimiTemizle={() => setSeciliIds([])}
            onOnizle={setOnizlenen}
          />
        )}
      </div>

      <MedyaOnizlemeModal medya={onizlenen} onKapat={() => setOnizlenen(null)} />
    </AdminModulKabuk>
  );
}
