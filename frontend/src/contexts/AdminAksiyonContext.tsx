import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { adminIslemBildirimi } from '@/utils/adminBildirimOlaylari';

export type AksiyonId = 'kaydet' | 'guncelle' | 'ekle' | 'altEkle' | 'sil' | 'onizle' | 'yayinla';

export interface AksiyonHandlerlar {
  kaydet?: () => Promise<void> | void;
  guncelle?: () => Promise<void> | void;
  ekle?: () => void;
  altEkle?: () => void;
  sil?: () => Promise<void> | void;
  onizle?: () => void;
  yayinla?: () => Promise<void> | void;
}

export type AksiyonDurumlari = Partial<Record<AksiyonId, boolean>>;

export interface AksiyonGeriBildirim {
  aksiyonId: AksiyonId;
  mesaj: string;
  tur: 'basari' | 'hata';
}

const AKSİYON_BASARI: Partial<Record<AksiyonId, string>> = {
  kaydet: 'Kaydedildi',
  guncelle: 'Güncellendi',
  ekle: 'Eklendi',
  sil: 'Silindi',
  yayinla: 'Yayınlandı',
  onizle: 'Önizleme açıldı',
};

interface ModulAksiyonKaydi {
  handlers: AksiyonHandlerlar;
  durumlar: AksiyonDurumlari;
}

interface AdminAksiyonContextType {
  focusModulId: string;
  setFocusModulId: (id: string) => void;
  registerHandlers: (modulId: string, handlers: AksiyonHandlerlar) => void;
  clearHandlers: (modulId: string) => void;
  setAksiyonDurumlari: (modulId: string, durumlar: AksiyonDurumlari) => void;
  aksiyonDurumlari: AksiyonDurumlari;
  aksiyonGeriBildirim: AksiyonGeriBildirim | null;
  aksiyonGeriBildirimiGoster: (
    aksiyonId: AksiyonId,
    mesaj?: string,
    tur?: 'basari' | 'hata'
  ) => void;
  aksiyonCalistir: (id: string) => Promise<void>;
}

const AdminAksiyonContext = createContext<AdminAksiyonContextType | null>(null);

export function AdminAksiyonProvider({ children }: { children: ReactNode }) {
  const kayitlarRef = useRef<Map<string, ModulAksiyonKaydi>>(new Map());
  const [focusModulId, setFocusModulId] = useState('dashboard');
  const [aksiyonDurumlari, setAksiyonDurumlariState] = useState<AksiyonDurumlari>({});
  const [aksiyonGeriBildirim, setAksiyonGeriBildirim] = useState<AksiyonGeriBildirim | null>(null);
  const geriBildirimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const kayit = kayitlarRef.current.get(focusModulId);
    setAksiyonDurumlariState(kayit?.durumlar ?? {});
  }, [focusModulId]);

  const aksiyonGeriBildirimiGoster = useCallback(
    (aksiyonId: AksiyonId, mesaj?: string, tur: 'basari' | 'hata' = 'basari') => {
      if (geriBildirimTimerRef.current) {
        clearTimeout(geriBildirimTimerRef.current);
        geriBildirimTimerRef.current = null;
      }

      const varsayilan =
        tur === 'basari' ? AKSİYON_BASARI[aksiyonId] : 'İşlem başarısız';
      setAksiyonGeriBildirim({
        aksiyonId,
        mesaj: mesaj ?? varsayilan ?? 'Tamamlandı',
        tur,
      });
      geriBildirimTimerRef.current = setTimeout(
        () => setAksiyonGeriBildirim(null),
        tur === 'basari' ? 1500 : 2500
      );
    },
    []
  );

  const registerHandlers = useCallback((modulId: string, handlers: AksiyonHandlerlar) => {
    const mevcut = kayitlarRef.current.get(modulId) ?? { handlers: {}, durumlar: {} };
    kayitlarRef.current.set(modulId, { ...mevcut, handlers });
  }, []);

  const clearHandlers = useCallback((modulId: string) => {
    const mevcut = kayitlarRef.current.get(modulId);
    if (mevcut) {
      kayitlarRef.current.set(modulId, { handlers: {}, durumlar: mevcut.durumlar });
    }
  }, []);

  const setAksiyonDurumlari = useCallback(
    (modulId: string, durumlar: AksiyonDurumlari) => {
      const mevcut = kayitlarRef.current.get(modulId) ?? { handlers: {}, durumlar: {} };
      kayitlarRef.current.set(modulId, { ...mevcut, durumlar });
      setAksiyonDurumlariState((onceki) => {
        if (modulId !== focusModulId) return onceki;
        return durumlar;
      });
    },
    [focusModulId]
  );

  const aksiyonCalistir = useCallback(
    async (id: string) => {
      const handlers = kayitlarRef.current.get(focusModulId)?.handlers ?? {};
      const aksiyonId = id as AksiyonId;

      try {
        if (id === 'kaydet' && handlers.kaydet) await handlers.kaydet();
        else if (id === 'guncelle' && handlers.guncelle) await handlers.guncelle();
        else if (id === 'ekle' && handlers.ekle) handlers.ekle();
        else if (id === 'altEkle' && handlers.altEkle) handlers.altEkle();
        else if (id === 'sil' && handlers.sil) await handlers.sil();
        else if (id === 'onizle' && handlers.onizle) handlers.onizle();
        else if (id === 'yayinla' && handlers.yayinla) await handlers.yayinla();
        else return;

        if (AKSİYON_BASARI[aksiyonId]) {
          aksiyonGeriBildirimiGoster(aksiyonId);
        }
      } catch {
        aksiyonGeriBildirimiGoster(aksiyonId, 'İşlem başarısız', 'hata');
        adminIslemBildirimi('İşlem başarısız', 'hata');
      }
    },
    [focusModulId, aksiyonGeriBildirimiGoster]
  );

  return (
    <AdminAksiyonContext.Provider
      value={{
        focusModulId,
        setFocusModulId,
        registerHandlers,
        clearHandlers,
        setAksiyonDurumlari,
        aksiyonDurumlari,
        aksiyonGeriBildirim,
        aksiyonGeriBildirimiGoster,
        aksiyonCalistir,
      }}
    >
      {children}
    </AdminAksiyonContext.Provider>
  );
}

export function useAdminAksiyon() {
  const ctx = useContext(AdminAksiyonContext);
  if (!ctx) throw new Error('useAdminAksiyon AdminAksiyonProvider icinde kullanilmali');
  return ctx;
}
