import { useEffect, useRef } from 'react';
import { sayfaShadowIcerikHazirla } from '@/utils/sayfaIcerikIsle';

interface SayfaShadowIcerikProps {
  html: string;
  className?: string;
}

/** Kullanıcı HTML/CSS'ini siteden izole ederek gösterir — header/footer bozulmaz */
export function SayfaShadowIcerik({ html, className }: SayfaShadowIcerikProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !html.trim()) return;

    const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display: block; width: 100%; }
        .sayfa-icerik-govde { width: 100%; }
        img { max-width: 100%; height: auto; }
      </style>
      ${sayfaShadowIcerikHazirla(html)}
    `;
  }, [html]);

  if (!html.trim()) return null;

  return <div ref={hostRef} className={className ?? 'sayfa-icerik-shadow-host'} />;
}
