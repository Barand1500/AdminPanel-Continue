import { useEffect, useRef } from 'react';
import { sayfaShadowIcerikHazirla } from '@/utils/sayfaIcerikIsle';

interface SayfaShadowIcerikProps {
  html: string;
  className?: string;
}

function shadowScriptleriCalistir(kok: ShadowRoot | DocumentFragment | HTMLElement) {
  kok.querySelectorAll('script').forEach((eski) => {
    const yeni = document.createElement('script');
    for (const attr of eski.attributes) {
      yeni.setAttribute(attr.name, attr.value);
    }
    yeni.textContent = eski.textContent;
    eski.replaceWith(yeni);
  });
}

/** Kullanıcı HTML/CSS/JS'ini siteden izole ederek gösterir — header/footer bozulmaz */
export function SayfaShadowIcerik({ html, className }: SayfaShadowIcerikProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !html.trim()) return;

    const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: none;
        }
        *, *::before, *::after { box-sizing: border-box; }
        .sayfa-icerik-govde {
          width: 100%;
          max-width: none;
        }
        img, video, iframe {
          max-width: 100%;
          height: auto;
        }
      </style>
      ${sayfaShadowIcerikHazirla(html)}
    `;
    shadowScriptleriCalistir(shadow);
  }, [html]);

  if (!html.trim()) return null;

  return <div ref={hostRef} className={className ?? 'sayfa-icerik-shadow-host'} />;
}
