import { useEffect } from 'react';
import { sayfaWidgetStilleriCikar } from '@/utils/sayfaWidgetKodu';

/** Sayfa HTML'indeki widget stil bloklarını document'e enjekte eder */
export function SayfaWidgetStilleri({ html }: { html: string }) {
  useEffect(() => {
    const stiller = sayfaWidgetStilleriCikar(html);
    if (stiller.length === 0) return;

    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-sayfa-widget-stilleri', '1');
    styleEl.textContent = stiller.map((s) => s.css).join('\n\n');
    document.head.appendChild(styleEl);

    return () => {
      styleEl.remove();
    };
  }, [html]);

  return null;
}
