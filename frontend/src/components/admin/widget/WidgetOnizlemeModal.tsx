import { useEffect } from 'react';
import { WidgetRender } from '@/components/widget/WidgetAlani';
import { formToWidgetOnizleme } from '@/types/widget';
import { tipEtiketi } from '@/components/admin/widget/widgetRegistry';
import type { WidgetFormDegeri } from '@/types/admin';

interface WidgetOnizlemeModalProps {
  acik: boolean;
  form: WidgetFormDegeri;
  otomatikDoldur?: boolean;
  onKapat: () => void;
}

export function WidgetOnizlemeModal({ acik, form, otomatikDoldur = false, onKapat }: WidgetOnizlemeModalProps) {
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
        <div className="ap-scroll ap-widget-oniz-govde">
          <WidgetRender widget={widget} onizleme />
        </div>
      </div>
    </div>
  );
}
