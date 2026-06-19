import { useEffect } from 'react';
import {
  useAdminAksiyon,
  type AksiyonDurumlari,
  type AksiyonHandlerlar,
} from '@/contexts/AdminAksiyonContext';
import { useAktifModulId } from '@/contexts/ModulKabukContext';

export function useModulAksiyonlari(
  handlers: AksiyonHandlerlar,
  durumlar?: AksiyonDurumlari
) {
  const modulId = useAktifModulId();
  const { registerHandlers, clearHandlers, setAksiyonDurumlari } = useAdminAksiyon();

  useEffect(() => {
    registerHandlers(modulId, handlers);
    return () => clearHandlers(modulId);
  }, [
    modulId,
    registerHandlers,
    clearHandlers,
    handlers.kaydet,
    handlers.hizliKaydet,
    handlers.guncelle,
    handlers.ekle,
    handlers.altEkle,
    handlers.sil,
    handlers.onizle,
    handlers.yayinla,
  ]);

  useEffect(() => {
    setAksiyonDurumlari(modulId, durumlar ?? {});
    return () => setAksiyonDurumlari(modulId, {});
  }, [
    modulId,
    setAksiyonDurumlari,
    durumlar?.kaydet,
    durumlar?.hizliKaydet,
    durumlar?.guncelle,
    durumlar?.ekle,
    durumlar?.altEkle,
    durumlar?.sil,
    durumlar?.onizle,
    durumlar?.yayinla,
  ]);
}
