import { useCallback, useEffect, useState } from 'react';
import { AdminRehberModal } from './AdminRehberModal';
import { modulRehberBul } from '@/data/adminModulRehberleri';
import { kisayolAyarlariOku, klavyeOlayiEslesir } from '@/utils/kisayolAyarlari';

interface ModulRehberSistemiProps {
  modulId: string;
  zorlaAcik?: boolean;
  onAcikDegisti?: (acik: boolean) => void;
  gizliButon?: boolean;
}

export function ModulRehberSistemi({ modulId, zorlaAcik, onAcikDegisti, gizliButon }: ModulRehberSistemiProps) {
  const [acik, setAcik] = useState(false);
  const rehber = modulRehberBul(modulId);

  const ac = useCallback(() => {
    setAcik(true);
    onAcikDegisti?.(true);
  }, [onAcikDegisti]);

  const kapat = useCallback(() => {
    setAcik(false);
    onAcikDegisti?.(false);
  }, [onAcikDegisti]);

  const toggle = useCallback(() => {
    setAcik((o) => {
      const yeni = !o;
      onAcikDegisti?.(yeni);
      return yeni;
    });
  }, [onAcikDegisti]);

  useEffect(() => {
    if (zorlaAcik !== undefined) setAcik(zorlaAcik);
  }, [zorlaAcik]);

  useEffect(() => {
    setAcik(false);
    onAcikDegisti?.(false);
  }, [modulId, onAcikDegisti]);

  useEffect(() => {
    function tusHandler(e: KeyboardEvent) {
      const harita = kisayolAyarlariOku();
      if (!klavyeOlayiEslesir(e, harita.rehber) && e.key !== 'F1') return;
      e.preventDefault();
      toggle();
    }

    document.addEventListener('keydown', tusHandler);
    return () => document.removeEventListener('keydown', tusHandler);
  }, [toggle]);

  return (
    <>
      {!gizliButon && (
        <button
          type="button"
          onClick={ac}
          className="ap-rehber-float"
          title="Rehber (F1)"
          aria-label="Sayfa rehberini aç"
        >
          ?
        </button>
      )}

      <AdminRehberModal
        acik={acik}
        onKapat={kapat}
        baslik={rehber.baslik}
        altBaslik={rehber.altBaslik}
        bolumBaslik={rehber.bolumBaslik}
        kartlar={rehber.kartlar}
        ipucu={rehber.ipucu}
      />
    </>
  );
}
