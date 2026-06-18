import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { sayfaDetayGetir, type PublicSayfa } from '@/features/site/sayfaApi';
import { SayfaShadowIcerik } from '@/components/ortak/SayfaShadowIcerik';
import { medyaTamUrl } from '@/features/admin/medyaApi';

interface SayfaModalContextDeger {
  acik: boolean;
  yukleniyor: boolean;
  sayfa: PublicSayfa | null;
  modalAc: (slug: string) => void;
  modalKapat: () => void;
}

const SayfaModalContext = createContext<SayfaModalContextDeger | null>(null);

export function SayfaModalProvider({ children }: { children: ReactNode }) {
  const [acik, setAcik] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sayfa, setSayfa] = useState<PublicSayfa | null>(null);

  const modalKapat = useCallback(() => {
    setAcik(false);
    setSayfa(null);
  }, []);

  const modalAc = useCallback((slug: string) => {
    setAcik(true);
    setYukleniyor(true);
    setSayfa(null);
    void sayfaDetayGetir(slug).then((veri) => {
      setSayfa(veri);
      setYukleniyor(false);
      if (!veri) setAcik(false);
    });
  }, []);

  const deger = useMemo(
    () => ({ acik, yukleniyor, sayfa, modalAc, modalKapat }),
    [acik, yukleniyor, sayfa, modalAc, modalKapat]
  );

  return (
    <SayfaModalContext.Provider value={deger}>
      {children}
      {acik && (
        <div className="sayfa-modal-overlay" role="dialog" aria-modal="true">
          <button type="button" className="sayfa-modal-backdrop" aria-label="Kapat" onClick={modalKapat} />
          <div className="sayfa-modal-kart">
            <div className="sayfa-modal-baslik">
              <h2 className="text-lg font-bold text-slate-900">{sayfa?.baslik ?? 'Sayfa'}</h2>
              <button type="button" className="sayfa-modal-kapat" onClick={modalKapat} aria-label="Kapat">
                ✕
              </button>
            </div>
            <div className="sayfa-modal-icerik">
              {yukleniyor ? (
                <p className="text-sm text-slate-500">Yükleniyor...</p>
              ) : sayfa ? (
                <>
                  {sayfa.kapakGorsel && (
                    <img
                      src={medyaTamUrl(sayfa.kapakGorsel)}
                      alt={sayfa.baslik}
                      className="mb-4 w-full rounded-xl object-cover"
                    />
                  )}
                  {sayfa.icerik.trim() && <SayfaShadowIcerik html={sayfa.icerik} />}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </SayfaModalContext.Provider>
  );
}

export function useSayfaModal() {
  const ctx = useContext(SayfaModalContext);
  if (!ctx) {
    return {
      acik: false,
      yukleniyor: false,
      sayfa: null,
      modalAc: () => {},
      modalKapat: () => {},
    };
  }
  return ctx;
}
