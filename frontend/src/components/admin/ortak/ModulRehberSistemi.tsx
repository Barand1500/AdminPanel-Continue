import { useCallback, useEffect, useState } from 'react';
import { AdminRehberModal } from './AdminRehberModal';
import { modulRehberBul } from '@/data/adminModulRehberleri';
import { kisayolAyarlariOku } from '@/utils/kisayolAyarlari';

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

  useEffect(() => {
    if (zorlaAcik !== undefined) setAcik(zorlaAcik);
  }, [zorlaAcik]);

  useEffect(() => {
    setAcik(false);
    onAcikDegisti?.(false);
  }, [modulId, onAcikDegisti]);

  return (
    <>
      {!gizliButon && (
        <button
          type="button"
          onClick={ac}
          className="ap-rehber-float"
          title={`Rehber (${kisayolAyarlariOku().rehber})`}
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
