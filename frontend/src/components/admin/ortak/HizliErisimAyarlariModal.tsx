import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  VARSAYILAN_HIZLI_ERISIM,
  hizliErisimKategoriler,
  hizliErisimModulleri,
} from '@/utils/dashboardTercihleri';

interface HizliErisimAyarlariModalProps {
  acik: boolean;
  onKapat: () => void;
}

export function HizliErisimAyarlariModal({ acik, onKapat }: HizliErisimAyarlariModalProps) {
  const { kullanici, hizliErisimKaydet } = useAuth();
  const [secili, setSecili] = useState<string[]>([]);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');

  const kapat = useCallback(() => onKapat(), [onKapat]);

  useEffect(() => {
    if (!acik) return;
    const mevcut = kullanici?.tercihler?.dashboardHizliErisim;
    const baslangic =
      mevcut && mevcut.length > 0 ? mevcut : hizliErisimModulleri(undefined).map((m) => m.id);
    setSecili(baslangic);
    setHata('');
  }, [acik, kullanici]);

  useEffect(() => {
    if (!acik) return;

    function tusHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        kapat();
      }
    }

    document.addEventListener('keydown', tusHandler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tusHandler);
      document.body.style.overflow = '';
    };
  }, [acik, kapat]);

  function toggle(id: string) {
    setSecili((onceki) => {
      if (onceki.includes(id)) {
        if (onceki.length <= 1) return onceki;
        return onceki.filter((x) => x !== id);
      }
      if (onceki.length >= 16) return onceki;
      return [...onceki, id];
    });
  }

  function yukari(id: string) {
    setSecili((onceki) => {
      const i = onceki.indexOf(id);
      if (i <= 0) return onceki;
      const yeni = [...onceki];
      [yeni[i - 1], yeni[i]] = [yeni[i], yeni[i - 1]];
      return yeni;
    });
  }

  function asagi(id: string) {
    setSecili((onceki) => {
      const i = onceki.indexOf(id);
      if (i < 0 || i >= onceki.length - 1) return onceki;
      const yeni = [...onceki];
      [yeni[i], yeni[i + 1]] = [yeni[i + 1], yeni[i]];
      return yeni;
    });
  }

  async function kaydet() {
    setHata('');
    setKaydediliyor(true);
    try {
      await hizliErisimKaydet(secili);
      kapat();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }

  if (!acik) return null;

  const seciliModuller = hizliErisimModulleri(secili);

  return (
    <div className="ap-admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="hizli-erisim-baslik">
      <div className="ap-admin-modal-backdrop" aria-hidden="true" />
      <div className="ap-admin-modal ap-admin-modal-genis">
        <header className="ap-admin-modal-header">
          <div>
            <h2 id="hizli-erisim-baslik" className="ap-admin-modal-baslik">
              Hızlı Erişim Menüsü
            </h2>
            <p className="ap-admin-modal-alt">Dashboard&apos;da gösterilecek modülleri seçin ve sıralayın</p>
          </div>
          <button type="button" className="ap-admin-modal-kapat" onClick={kapat}>
            ✕ ESC
          </button>
        </header>

        <div className="ap-scroll ap-admin-modal-icerik ap-hizli-erisim-icerik">
          {hata && <p className="ap-admin-modal-hata mb-3">{hata}</p>}

          <div className="ap-hizli-erisim-layout">
            <div>
              <p className="ap-muted mb-3 text-xs font-semibold uppercase tracking-wide">Modüller</p>
              <div className="space-y-4">
                {hizliErisimKategoriler().map((grup) => (
                  <div key={grup.kategori}>
                    <p className="ap-muted mb-2 text-[11px] font-bold uppercase tracking-wide">{grup.kategori}</p>
                    <div className="space-y-1">
                      {grup.moduller.map((modul) => {
                        const aktif = secili.includes(modul.id);
                        return (
                          <label
                            key={modul.id}
                            className={`ap-hizli-erisim-secim ${aktif ? 'ap-hizli-erisim-secim-aktif' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={aktif}
                              onChange={() => toggle(modul.id)}
                              className="sr-only"
                            />
                            <span className="text-base">{modul.ikon}</span>
                            <span className="min-w-0 flex-1 truncate text-sm font-medium">{modul.baslik}</span>
                            <span className="ap-hizli-erisim-tik">{aktif ? '✓' : ''}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ap-hizli-erisim-sira-panel">
              <p className="ap-muted mb-3 text-xs font-semibold uppercase tracking-wide">
                Sıralama ({seciliModuller.length})
              </p>
              {seciliModuller.length === 0 ? (
                <p className="ap-muted text-sm">En az bir modül seçin.</p>
              ) : (
                <ul className="space-y-1.5">
                  {seciliModuller.map((modul, i) => (
                    <li key={modul.id} className="ap-hizli-erisim-sira-satir">
                      <span className="text-sm">{modul.ikon}</span>
                      <span className="min-w-0 flex-1 truncate text-xs font-medium">{modul.baslik}</span>
                      <div className="flex gap-0.5">
                        <button
                          type="button"
                          className="ap-hizli-erisim-sira-btn"
                          disabled={i === 0}
                          onClick={() => yukari(modul.id)}
                          title="Yukarı"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="ap-hizli-erisim-sira-btn"
                          disabled={i === seciliModuller.length - 1}
                          onClick={() => asagi(modul.id)}
                          title="Aşağı"
                        >
                          ↓
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                className="ap-muted mt-4 text-xs hover:text-[var(--ap-heading)]"
                onClick={() => setSecili([...VARSAYILAN_HIZLI_ERISIM])}
              >
                Varsayılana sıfırla
              </button>
            </div>
          </div>
        </div>

        <footer className="ap-admin-modal-footer">
          <p className="ap-muted text-xs">En fazla 16 modül seçebilirsiniz.</p>
          <div className="flex gap-2">
            <button type="button" className="ap-admin-modal-iptal" onClick={kapat}>
              İptal
            </button>
            <button
              type="button"
              className="ap-admin-modal-kaydet"
              disabled={kaydediliyor || secili.length === 0}
              onClick={() => void kaydet()}
            >
              {kaydediliyor ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
