import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogApi, type AdminLogKayit } from '@/features/admin/adminSistemApi';
import { AltPanel, AltPanelBos, AltPanelOge, AltPanelYukleniyor } from './ortak/AltPanel';

interface LogPaneliProps {
  acik: boolean;
  onKapat: () => void;
}

export function LogPaneli({ acik, onKapat }: LogPaneliProps) {
  const navigate = useNavigate();
  const [loglar, setLoglar] = useState<AdminLogKayit[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      const veri = await adminLogApi.listele();
      setLoglar(veri.slice(0, 15));
    } catch {
      setLoglar([]);
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    if (acik) void yukle();
  }, [acik, yukle]);

  return (
    <AltPanel
      acik={acik}
      onKapat={onKapat}
      baslik="Son Kayıtlar"
      ustAksiyon={
        <button type="button" className="ap-alt-panel-link" onClick={() => { navigate('/gt-admin/loglar'); onKapat(); }}>
          Tümünü gör
        </button>
      }
    >
      {yukleniyor && <AltPanelYukleniyor />}
      {!yukleniyor && loglar.length === 0 && <AltPanelBos mesaj="Henüz log kaydı yok." />}
      {loglar.map((log) => (
        <AltPanelOge
          key={log.id}
          baslik={log.islem}
          alt={`${log.kullaniciAd} · ${log.modulId ?? 'sistem'}`}
          zaman={log.olusturma}
        />
      ))}
    </AltPanel>
  );
}
