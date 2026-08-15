import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { formInputSinifi } from '@/components/form/FormAlani';
import { tekEmojiAl } from '@/components/admin/footer/EmojiIkonSecici';
import { SAYFA_IKON_KATEGORILERI } from '@/data/sayfaIkonlari';

interface SayfaIkonSeciciProps {
  ikon: string;
  onChange: (ikon: string) => void;
}

export function SayfaIkonSecici({ ikon, onChange }: SayfaIkonSeciciProps) {
  const [acik, setAcik] = useState(false);
  const [kategori, setKategori] = useState(SAYFA_IKON_KATEGORILERI[0]?.id ?? 'kurumsal');
  const [ozelGirdi, setOzelGirdi] = useState(ikon);
  const [konum, setKonum] = useState({ top: 0, left: 0 });
  const tetikRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const aktifKategori = useMemo(
    () => SAYFA_IKON_KATEGORILERI.find((k) => k.id === kategori) ?? SAYFA_IKON_KATEGORILERI[0],
    [kategori]
  );

  useEffect(() => {
    setOzelGirdi(ikon);
  }, [ikon]);

  useLayoutEffect(() => {
    if (!acik || !tetikRef.current) return;

    function yerlestir() {
      const tetik = tetikRef.current?.getBoundingClientRect();
      if (!tetik) return;
      const panelGenislik = panelRef.current?.offsetWidth ?? 320;
      const panelYukseklik = panelRef.current?.offsetHeight ?? 280;
      const bosluk = 8;
      let left = tetik.right + bosluk;
      let top = tetik.top;

      if (left + panelGenislik > window.innerWidth - 12) {
        left = Math.max(12, tetik.left);
        top = tetik.bottom + bosluk;
      }
      if (top + panelYukseklik > window.innerHeight - 12) {
        top = Math.max(12, window.innerHeight - panelYukseklik - 12);
      }

      setKonum({ top, left });
    }

    yerlestir();
    window.addEventListener('resize', yerlestir);
    window.addEventListener('scroll', yerlestir, true);
    return () => {
      window.removeEventListener('resize', yerlestir);
      window.removeEventListener('scroll', yerlestir, true);
    };
  }, [acik, kategori]);

  useEffect(() => {
    if (!acik) return;

    function disariTikla(e: MouseEvent) {
      const hedef = e.target as Node;
      if (tetikRef.current?.contains(hedef) || panelRef.current?.contains(hedef)) return;
      setAcik(false);
    }
    function esc(e: KeyboardEvent) {
      if (e.key === 'Escape') setAcik(false);
    }

    document.addEventListener('mousedown', disariTikla);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', disariTikla);
      document.removeEventListener('keydown', esc);
    };
  }, [acik]);

  function ikonSec(deger: string) {
    onChange(deger);
    setOzelGirdi(deger);
    setAcik(false);
  }

  return (
    <div className="ap-sayfa-ikon-kompakt">
      <button
        ref={tetikRef}
        type="button"
        className="ap-sayfa-ikon-tetik"
        aria-expanded={acik}
        aria-haspopup="dialog"
        aria-label="Sayfa ikonu"
        title={ikon ? 'İkonu değiştir' : 'İkon seç'}
        onClick={() => setAcik((v) => !v)}
      >
        <span aria-hidden>{ikon || '+'}</span>
      </button>

      {acik &&
        createPortal(
          <div
            ref={panelRef}
            className="ap-sayfa-ikon-panel"
            role="dialog"
            aria-label="Sayfa ikonu seç"
            style={{ top: konum.top, left: konum.left }}
          >
            <div className="ap-sayfa-ikon-kategori-sekmeler">
              {SAYFA_IKON_KATEGORILERI.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  className={kategori === k.id ? 'ap-sayfa-ikon-kategori-aktif' : ''}
                  onClick={() => setKategori(k.id)}
                >
                  {k.ad}
                </button>
              ))}
            </div>
            <div className="ap-sayfa-ikon-grid ap-sayfa-ikon-grid--kompakt">
              {aktifKategori.ikonlar.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  title={emoji}
                  className={ikon === emoji ? 'ap-sayfa-ikon-oge-secili' : 'ap-sayfa-ikon-oge'}
                  onClick={() => ikonSec(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="ap-sayfa-ikon-ozel">
              <input
                type="text"
                className={formInputSinifi}
                value={ozelGirdi}
                placeholder="Kendin yaz veya yapıştır"
                onChange={(e) => {
                  setOzelGirdi(e.target.value);
                  const secilen = tekEmojiAl(e.target.value);
                  if (secilen) onChange(secilen);
                }}
                onPaste={(e) => {
                  const secilen = tekEmojiAl(e.clipboardData.getData('text'));
                  if (secilen) {
                    e.preventDefault();
                    ikonSec(secilen);
                  }
                }}
              />
              {ikon && (
                <button type="button" className="ap-sayfa-ikon-temizle" onClick={() => ikonSec('')}>
                  Kaldır
                </button>
              )}
            </div>
          </div>,
          document.querySelector('.admin-panel') ?? document.body
        )}
    </div>
  );
}
