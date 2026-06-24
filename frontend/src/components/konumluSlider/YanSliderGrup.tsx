import { useEffect, useRef, type ReactNode } from 'react';

interface YanSliderGrupProps {
  tarafSinif: string;
  zSinif: string;
  yonSinif: string;
  sliderAd: string;
  slider: ReactNode;
  children: ReactNode;
}

export function YanSliderGrup({
  tarafSinif,
  zSinif,
  yonSinif,
  sliderAd,
  slider,
  children,
}: YanSliderGrupProps) {
  const akisRef = useRef<HTMLDivElement>(null);
  const kolonRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const akis = akisRef.current;
    const kolon = kolonRef.current;
    if (!akis || !kolon) return;

    function esitle() {
      const akisEl = akisRef.current;
      const kolonEl = kolonRef.current;
      if (!akisEl || !kolonEl) return;
      const yukseklik = akisEl.offsetHeight;
      if (yukseklik > 0) {
        kolonEl.style.height = `${yukseklik}px`;
      }
    }

    esitle();
    const gozlemci = new ResizeObserver(esitle);
    gozlemci.observe(akis);
    return () => gozlemci.disconnect();
  }, [children]);

  return (
    <div className={`ks-yan-sarmal ${tarafSinif} ${zSinif} ${yonSinif}`}>
      <aside ref={kolonRef} className="ks-yan-kolon" aria-label={sliderAd}>
        {slider}
      </aside>
      <div ref={akisRef} className="ks-yan-akis">
        {children}
      </div>
    </div>
  );
}
