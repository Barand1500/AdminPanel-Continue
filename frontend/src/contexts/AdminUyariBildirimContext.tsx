import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface AdminUyariBildirim {
  id: string;
  baslik: string;
  mesaj: string;
  olusturma: string;
}

interface AdminUyariBildirimContextType {
  uyariBildirimleri: AdminUyariBildirim[];
  uyariSayisi: number;
  uyariAyarla: (anahtar: string, bildirim: { baslik: string; mesaj: string } | null) => void;
  tumUyarilariTemizle: () => void;
}

const AdminUyariBildirimContext = createContext<AdminUyariBildirimContextType | null>(null);

export function AdminUyariBildirimProvider({ children }: { children: ReactNode }) {
  const [uyarilar, setUyarilar] = useState<Record<string, AdminUyariBildirim>>({});

  const uyariAyarla = useCallback(
    (anahtar: string, bildirim: { baslik: string; mesaj: string } | null) => {
      setUyarilar((onceki) => {
        if (!bildirim) {
          if (!(anahtar in onceki)) return onceki;
          const { [anahtar]: _, ...kalan } = onceki;
          return kalan;
        }
        const mevcut = onceki[anahtar];
        if (mevcut && mevcut.baslik === bildirim.baslik && mevcut.mesaj === bildirim.mesaj) {
          return onceki;
        }
        return {
          ...onceki,
          [anahtar]: {
            id: anahtar,
            baslik: bildirim.baslik,
            mesaj: bildirim.mesaj,
            olusturma: new Date().toISOString(),
          },
        };
      });
    },
    []
  );

  const tumUyarilariTemizle = useCallback(() => setUyarilar({}), []);

  const uyariBildirimleri = useMemo(
    () =>
      Object.values(uyarilar).sort(
        (a, b) => new Date(b.olusturma).getTime() - new Date(a.olusturma).getTime()
      ),
    [uyarilar]
  );

  const deger = useMemo(
    () => ({
      uyariBildirimleri,
      uyariSayisi: uyariBildirimleri.length,
      uyariAyarla,
      tumUyarilariTemizle,
    }),
    [uyariBildirimleri, uyariAyarla, tumUyarilariTemizle]
  );

  return (
    <AdminUyariBildirimContext.Provider value={deger}>{children}</AdminUyariBildirimContext.Provider>
  );
}

export function useAdminUyariBildirim() {
  const ctx = useContext(AdminUyariBildirimContext);
  if (!ctx) {
    return {
      uyariBildirimleri: [] as AdminUyariBildirim[],
      uyariSayisi: 0,
      uyariAyarla: () => {},
      tumUyarilariTemizle: () => {},
    };
  }
  return ctx;
}

/** Kaydedilmemiş değişiklik uyarısını sayfa içi banner yerine bildirim paneline yazar */
export function useKaydedilmemisBildirim(
  aktif: boolean,
  mesaj: string,
  baslik: string,
  anahtar: string
) {
  const { uyariAyarla } = useAdminUyariBildirim();

  useEffect(() => {
    if (aktif) {
      uyariAyarla(anahtar, { baslik, mesaj });
    } else {
      uyariAyarla(anahtar, null);
    }
    return () => uyariAyarla(anahtar, null);
  }, [aktif, mesaj, baslik, anahtar, uyariAyarla]);
}
