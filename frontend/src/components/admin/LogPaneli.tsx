import { useCallback, useEffect, useState } from 'react';
import { adminLogApi, type AdminLogKayit } from '@/features/admin/adminSistemApi';
import { AltPanel, AltPanelBos, AltPanelOge, AltPanelYukleniyor } from './ortak/AltPanel';
import {
  logIslemTuruBul,
  logKayitOzet,
  logOzetCumle,
} from '@/utils/logYardimci';

interface LogPaneliProps {
  acik: boolean;
  onKapat: () => void;
  onModulAc?: (modulId: string) => void;
}

export function LogPaneli({ acik, onKapat, onModulAc }: LogPaneliProps) {
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
        <button
          type="button"
          className="ap-alt-panel-link"
          onClick={() => {
            onModulAc?.('loglar');
            onKapat();
          }}
        >
          Tümünü gör
        </button>
      }
    >
      {yukleniyor && <AltPanelYukleniyor />}
      {!yukleniyor && loglar.length === 0 && <AltPanelBos mesaj="Henüz log kaydı yok." />}
      {loglar.map((log) => {
        const ozet = logKayitOzet(log);
        const tur = logIslemTuruBul(ozet);
        return (
          <AltPanelOge
            key={log.id}
            baslik={logOzetCumle(ozet, tur)}
            alt={`${log.kullaniciEmail ?? log.kullaniciAd ?? 'sistem'} · ${log.modulId ?? 'sistem'}`}
            zaman={log.olusturma}
          />
        );
      })}
    </AltPanel>
  );
}
