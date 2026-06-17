import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminBildirimleriGetir,
  adminBildirimleriTumunuOkundu,
  type AdminBildirim,
} from '@/features/admin/bildirimApi';
import { AltPanel, AltPanelBos, AltPanelOge, AltPanelYukleniyor } from './ortak/AltPanel';

interface BildirimPaneliProps {
  acik: boolean;
  onKapat: () => void;
  onGuncelle?: () => void;
}

export function BildirimPaneli({ acik, onKapat, onGuncelle }: BildirimPaneliProps) {
  const navigate = useNavigate();
  const [bildirimler, setBildirimler] = useState<AdminBildirim[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [islemMesaji, setIslemMesaji] = useState<string | null>(null);

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      const veri = await adminBildirimleriGetir();
      setBildirimler(veri.bildirimler);
    } catch {
      setBildirimler([]);
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    if (acik) {
      setIslemMesaji(null);
      void yukle();
    }
  }, [acik, yukle]);

  async function tumunuOkundu() {
    try {
      await adminBildirimleriTumunuOkundu();
      setBildirimler([]);
      onGuncelle?.();
    } catch {
      setIslemMesaji('İşlem başarısız oldu.');
    }
  }

  function tikla(b: AdminBildirim) {
    if (b.link) navigate(b.link);
    onKapat();
  }

  return (
    <AltPanel
      acik={acik}
      onKapat={onKapat}
      baslik="Bildirimler"
      ustAksiyon={
        <button type="button" className="ap-alt-panel-link" onClick={() => void tumunuOkundu()}>
          Tümünü okundu işaretle
        </button>
      }
    >
      {islemMesaji && <p className="ap-alt-panel-hata px-1 pb-2">{islemMesaji}</p>}
      {yukleniyor && <AltPanelYukleniyor />}
      {!yukleniyor && bildirimler.length === 0 && <AltPanelBos mesaj="Henüz bildirim yok." />}
      {bildirimler.map((b) => (
        <AltPanelOge
          key={b.id}
          baslik={b.baslik}
          alt={b.mesaj}
          zaman={b.olusturma}
          okunmamis={!b.okundu}
          onClick={() => tikla(b)}
        />
      ))}
    </AltPanel>
  );
}

export function useBildirimSayaci(pollingMs = 60_000) {
  const [okunmamisSayi, setOkunmamisSayi] = useState(0);

  const yenile = useCallback(async () => {
    try {
      const veri = await adminBildirimleriGetir();
      setOkunmamisSayi(veri.okunmamisSayi);
    } catch {
      setOkunmamisSayi(0);
    }
  }, []);

  useEffect(() => {
    void yenile();
    const timer = setInterval(() => void yenile(), pollingMs);
    return () => clearInterval(timer);
  }, [yenile, pollingMs]);

  return { okunmamisSayi, yenile };
}
