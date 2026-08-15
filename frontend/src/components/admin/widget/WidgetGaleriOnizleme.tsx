import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { WidgetRender } from '@/components/widget/WidgetAlani';
import { varsayilanWidgetForm } from '@/components/admin/widget/widgetRegistry';
import { formToWidgetOnizleme } from '@/types/widget';
import type { Widget } from '@/types/site';

const ONIZLEME_GENISLIK = 720;
const ONIZLEME_GORSEL = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop';

const CANLI_OLMASIN = new Set([
  'VIDEO_BANNER',
  'HARITA',
  'POPUP',
  'BLOK_OLUSTURUCU',
  'HAVA_DURUMU',
  'KRIPTO_LISTESI',
]);

const onizlemeOnbellegi = new Map<string, Widget>();

function galeriWidgetAl(tip: string): Widget {
  const mevcut = onizlemeOnbellegi.get(tip);
  if (mevcut) return mevcut;
  const widget = formToWidgetOnizleme(varsayilanWidgetForm(tip), `galeri-${tip}`, true);
  onizlemeOnbellegi.set(tip, widget);
  return widget;
}

class OnizlemeSiniri extends Component<{ children: ReactNode }, { hata: boolean }> {
  state = { hata: false };

  static getDerivedStateFromError() {
    return { hata: true };
  }

  render() {
    if (this.state.hata) return <StatikOnizleme etiket="Önizleme" />;
    return this.props.children;
  }
}

function StatikOnizleme({ etiket }: { etiket: string }) {
  return (
    <div className="ap-widget-galeri-statik">
      <img src={ONIZLEME_GORSEL} alt="" loading="lazy" />
      <span>{etiket}</span>
    </div>
  );
}

export function WidgetGaleriOnizleme({ tip, etiket }: { tip: string; etiket: string }) {
  const kutuRef = useRef<HTMLDivElement>(null);
  const [gorunur, setGorunur] = useState(false);
  const [olcek, setOlcek] = useState(0.3);
  const canli = !CANLI_OLMASIN.has(tip);

  useEffect(() => {
    const el = kutuRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([kayit]) => setGorunur(kayit.isIntersecting),
      { rootMargin: '240px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = kutuRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([kayit]) => {
      const genislik = kayit.contentRect.width;
      if (genislik > 0) setOlcek(genislik / ONIZLEME_GENISLIK);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const widget = useMemo(() => (gorunur && canli ? galeriWidgetAl(tip) : null), [gorunur, canli, tip]);

  return (
    <div ref={kutuRef} className="ap-widget-galeri-oniz" aria-hidden>
      {!gorunur ? (
        <div className="ap-widget-galeri-oniz-bos" />
      ) : widget ? (
        <OnizlemeSiniri>
          <div
            className="ap-widget-galeri-oniz-olcek"
            style={{ width: ONIZLEME_GENISLIK, transform: `scale(${olcek})` }}
          >
            <WidgetRender widget={widget} onizleme />
          </div>
        </OnizlemeSiniri>
      ) : (
        <StatikOnizleme etiket={etiket} />
      )}
    </div>
  );
}
