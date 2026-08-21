import { useEffect, useRef, useState } from 'react';
import { WidgetRender } from '@/components/widget/WidgetAlani';
import { formToWidgetOnizleme } from '@/types/widget';
import { tipEtiketi } from '@/components/admin/widget/widgetRegistry';
import type { WidgetFormDegeri } from '@/types/admin';

const ONIZLEME_TUVAL_GENISLIK = 1180;

interface WidgetOnizlemeModalProps {
  acik: boolean;
  form: WidgetFormDegeri;
  otomatikDoldur?: boolean;
  onKapat: () => void;
}

export function WidgetOnizlemeModal({ acik, form, otomatikDoldur = false, onKapat }: WidgetOnizlemeModalProps) {
  const govdeRef = useRef<HTMLDivElement>(null);
  const tuvalRef = useRef<HTMLDivElement>(null);
  const [olcek, setOlcek] = useState(1);

  useEffect(() => {
    if (!acik) return;
    function tus(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onKapat();
      }
    }
    document.addEventListener('keydown', tus);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tus);
      document.body.style.overflow = '';
    };
  }, [acik, onKapat]);

  useEffect(() => {
    if (!acik) return;
    const govde = govdeRef.current;
    if (!govde) return;

    function olc() {
      const kutu = govdeRef.current;
      if (!kutu) return;
      const kutuGenislik = kutu.clientWidth;
      setOlcek(kutuGenislik > 0 ? Math.min(1, kutuGenislik / ONIZLEME_TUVAL_GENISLIK) : 1);
    }

    olc();
    const ro = new ResizeObserver(olc);
    ro.observe(govde);
    return () => ro.disconnect();
  }, [acik, form.tip, form.configJsonMetin, form.baslik, otomatikDoldur]);

  if (!acik) return null;

  const widget = formToWidgetOnizleme(form, 'onizleme', otomatikDoldur);

  return (
    <div className="ap-admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="widget-onizleme-baslik">
      <button type="button" className="ap-admin-modal-backdrop" aria-label="Kapat" onClick={onKapat} />
      <div className="ap-admin-modal ap-admin-modal-genis ap-widget-oniz-modal">
        <header className="ap-admin-modal-header">
          <div>
            <h2 id="widget-onizleme-baslik" className="ap-admin-modal-baslik">
              Widget önizleme
            </h2>
            <p className="ap-admin-modal-alt">
              {form.ad.trim() || 'Taslak'} · {tipEtiketi(form.tip)}
            </p>
          </div>
          <button type="button" className="ap-admin-modal-kapat" onClick={onKapat}>
            ✕ ESC
          </button>
        </header>
        <div ref={govdeRef} className="ap-scroll ap-widget-oniz-govde">
          <div className="ap-widget-oniz-olcek-sarici">
            <div
              ref={tuvalRef}
              className="ap-widget-oniz-olcek"
              style={{
                width: ONIZLEME_TUVAL_GENISLIK,
                zoom: olcek,
              }}
            >
              <WidgetRender widget={widget} onizleme />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
