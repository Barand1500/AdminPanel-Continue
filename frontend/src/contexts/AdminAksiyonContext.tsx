import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type AksiyonId = 'kaydet' | 'guncelle' | 'ekle' | 'sil' | 'onizle' | 'yayinla';

export interface AksiyonHandlerlar {
  kaydet?: () => Promise<void> | void;
  guncelle?: () => Promise<void> | void;
  ekle?: () => void;
  sil?: () => Promise<void> | void;
  onizle?: () => void;
  yayinla?: () => Promise<void> | void;
}

export type AksiyonDurumlari = Partial<Record<AksiyonId, boolean>>;

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
  aksiyonCalistir: (id: string) => Promise<void>;
}

const AdminAksiyonContext = createContext<AdminAksiyonContextType | null>(null);

export function AdminAksiyonProvider({ children }: { children: ReactNode }) {
  const kayitlarRef = useRef<Map<string, ModulAksiyonKaydi>>(new Map());
  const [focusModulId, setFocusModulId] = useState('dashboard');
  const [aksiyonDurumlari, setAksiyonDurumlariState] = useState<AksiyonDurumlari>({});

  useEffect(() => {
    const kayit = kayitlarRef.current.get(focusModulId);
    setAksiyonDurumlariState(kayit?.durumlar ?? {});
  }, [focusModulId]);

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

  const aksiyonCalistir = useCallback(async (id: string) => {
    const handlers = kayitlarRef.current.get(focusModulId)?.handlers ?? {};
    try {
      if (id === 'kaydet' && handlers.kaydet) await handlers.kaydet();
      if (id === 'guncelle' && handlers.guncelle) await handlers.guncelle();
      if (id === 'ekle' && handlers.ekle) handlers.ekle();
      if (id === 'sil' && handlers.sil) await handlers.sil();
      if (id === 'onizle' && handlers.onizle) handlers.onizle();
      if (id === 'yayinla' && handlers.yayinla) await handlers.yayinla();
    } catch {
      /* Modul kendi hata mesajini gosterir */
    }
  }, [focusModulId]);

  return (
    <AdminAksiyonContext.Provider
      value={{
        focusModulId,
        setFocusModulId,
        registerHandlers,
        clearHandlers,
        setAksiyonDurumlari,
        aksiyonDurumlari,
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
