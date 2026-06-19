import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import type { KesifOkYonu, SistemKesifAdim, SistemKesifTur } from '@/types/sistemKesif';

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface KartKonum {
  top: number;
  left: number;
  okYonu: KesifOkYonu;
}

interface SistemKesifTurOverlayProps {
  tur: SistemKesifTur;
  onModulAc: (modulId: string) => void;
  onMenuAc: () => void;
  onMenuKapat: () => void;
  onBitir: () => void;
}

const KART_GENISLIK = 360;
const KART_YUKSEK = 200;
const PAD = 12;

function bekle(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hedefBekle(hedef: string, deneme = 30): Promise<Element | null> {
  for (let i = 0; i < deneme; i += 1) {
    const el = document.querySelector(`[data-ap-kesif="${hedef}"]`);
    if (el) return el;
    await bekle(80);
  }
  return null;
}

function hedefRect(el: Element, padding: number): Rect {
  const r = el.getBoundingClientRect();
  return {
    top: r.top - padding,
    left: r.left - padding,
    width: r.width + padding * 2,
    height: r.height + padding * 2,
  };
}

function kartKonumuHesapla(hedef: Rect | null, tercih: KesifOkYonu = 'alt'): KartKonum {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = 16;

  if (!hedef) {
    return {
      top: vh / 2 - KART_YUKSEK / 2,
      left: vw / 2 - KART_GENISLIK / 2,
      okYonu: 'alt',
    };
  }

  const adaylar: { yon: KesifOkYonu; top: number; left: number; skor: number }[] = [
    {
      yon: 'alt',
      top: hedef.top + hedef.height + margin,
      left: hedef.left + hedef.width / 2 - KART_GENISLIK / 2,
      skor: tercih === 'alt' ? 0 : 1,
    },
    {
      yon: 'ust',
      top: hedef.top - KART_YUKSEK - margin,
      left: hedef.left + hedef.width / 2 - KART_GENISLIK / 2,
      skor: tercih === 'ust' ? 0 : 1,
    },
    {
      yon: 'sag',
      top: hedef.top + hedef.height / 2 - KART_YUKSEK / 2,
      left: hedef.left + hedef.width + margin,
      skor: tercih === 'sag' ? 0 : 1,
    },
    {
      yon: 'sol',
      top: hedef.top + hedef.height / 2 - KART_YUKSEK / 2,
      left: hedef.left - KART_GENISLIK - margin,
      skor: tercih === 'sol' ? 0 : 1,
    },
  ];

  adaylar.sort((a, b) => a.skor - b.skor);

  for (const aday of adaylar) {
    const top = Math.max(margin, Math.min(aday.top, vh - KART_YUKSEK - margin));
    const left = Math.max(margin, Math.min(aday.left, vw - KART_GENISLIK - margin));
    const sigar =
      top >= margin &&
      left >= margin &&
      top + KART_YUKSEK <= vh - margin &&
      left + KART_GENISLIK <= vw - margin;
    if (sigar || aday === adaylar[adaylar.length - 1]) {
      return { top, left, okYonu: aday.yon };
    }
  }

  return {
    top: vh / 2 - KART_YUKSEK / 2,
    left: vw / 2 - KART_GENISLIK / 2,
    okYonu: tercih,
  };
}

export function SistemKesifTurOverlay({
  tur,
  onModulAc,
  onMenuAc,
  onMenuKapat,
  onBitir,
}: SistemKesifTurOverlayProps) {
  const [adimIdx, setAdimIdx] = useState(0);
  const [hazir, setHazir] = useState(false);
  const [spotlight, setSpotlight] = useState<Rect | null>(null);
  const [kart, setKart] = useState<KartKonum | null>(null);

  const adim = tur.adimlar[adimIdx];
  const sonAdim = adimIdx >= tur.adimlar.length - 1;
  const ilkAdim = adimIdx === 0;

  const konumGuncelle = useCallback(async (mevcutAdim: SistemKesifAdim) => {
    setHazir(false);

    if (mevcutAdim.menuKapat) onMenuKapat();
    if (mevcutAdim.modulId) onModulAc(mevcutAdim.modulId);
    if (mevcutAdim.menuAc) onMenuAc();

    if (mevcutAdim.modulId || mevcutAdim.menuAc) {
      await bekle(mevcutAdim.menuAc ? 320 : 420);
    }

    const padding = mevcutAdim.padding ?? PAD;

    if (!mevcutAdim.hedef) {
      setSpotlight(null);
      setKart(kartKonumuHesapla(null));
      setHazir(true);
      return;
    }

    const el = await hedefBekle(mevcutAdim.hedef);
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      await bekle(180);
      const rect = hedefRect(el, padding);
      setSpotlight(rect);
      setKart(kartKonumuHesapla(rect, mevcutAdim.okYonu));
    } else {
      setSpotlight(null);
      setKart(kartKonumuHesapla(null));
    }
    setHazir(true);
  }, [onModulAc, onMenuAc, onMenuKapat]);

  useLayoutEffect(() => {
    void konumGuncelle(adim);
  }, [adim, konumGuncelle]);

  useEffect(() => {
    function yenidenOlc() {
      if (!adim.hedef) return;
      const el = document.querySelector(`[data-ap-kesif="${adim.hedef}"]`);
      if (!el) return;
      const rect = hedefRect(el, adim.padding ?? PAD);
      setSpotlight(rect);
      setKart(kartKonumuHesapla(rect, adim.okYonu));
    }

    window.addEventListener('resize', yenidenOlc);
    window.addEventListener('scroll', yenidenOlc, true);
    return () => {
      window.removeEventListener('resize', yenidenOlc);
      window.removeEventListener('scroll', yenidenOlc, true);
    };
  }, [adim]);

  useEffect(() => {
    function tus(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onBitir();
      }
    }
    window.addEventListener('keydown', tus);
    return () => window.removeEventListener('keydown', tus);
  }, [onBitir]);

  function ileri() {
    if (sonAdim) onBitir();
    else setAdimIdx((i) => i + 1);
  }

  function geri() {
    if (!ilkAdim) setAdimIdx((i) => i - 1);
  }

  return (
    <div className="ap-kesif-tur" role="presentation">
      <div className="ap-kesif-tur-backdrop" />

      {spotlight && hazir && (
        <div
          className="ap-kesif-spotlight"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
          }}
        />
      )}

      {hazir && kart && (
        <div
          className="ap-kesif-kart"
          style={{ top: kart.top, left: kart.left, width: KART_GENISLIK }}
          data-ok={kart.okYonu}
        >
          <div className="ap-kesif-kart-ust">
            <span className="ap-kesif-kart-rozet">{tur.ikon}</span>
            <span className="ap-kesif-kart-sira">
              {adimIdx + 1} / {tur.adimlar.length}
            </span>
          </div>
          <h3 className="ap-kesif-kart-baslik">{adim.baslik}</h3>
          <p className="ap-kesif-kart-metin">{adim.aciklama}</p>

          <div className="ap-kesif-kart-ilerleme">
            {tur.adimlar.map((_, i) => (
              <span key={i} className={`ap-kesif-nokta ${i === adimIdx ? 'ap-kesif-nokta-aktif' : ''}`} />
            ))}
          </div>

          <div className="ap-kesif-kart-alt">
            <button type="button" className="ap-kesif-atla" onClick={onBitir}>
              Atla
            </button>
            <div className="ap-kesif-nav">
              {!ilkAdim && (
                <button type="button" className="ap-kesif-geri" onClick={geri}>
                  ← Geri
                </button>
              )}
              <button type="button" className="ap-kesif-ileri" onClick={ileri}>
                {sonAdim ? 'Bitir ✓' : 'İleri →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {!hazir && (
        <div className="ap-kesif-yukleniyor">
          <span className="ap-kesif-yukleniyor-nokta" />
          Hazırlanıyor…
        </div>
      )}
    </div>
  );
}
