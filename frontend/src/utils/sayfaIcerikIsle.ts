const KOK_SINIF = 'sayfa-icerik-kok';

/** Tam HTML belgesinden gövde + head stillerini çıkarır */
export function sayfaHtmlParcala(html: string): { govde: string; stiller: string[] } {
  let kaynak = html.trim();
  const stiller: string[] = [];

  if (!kaynak) return { govde: '', stiller };

  kaynak = kaynak.replace(/<!DOCTYPE[^>]*>/gi, '');

  const headEslesme = kaynak.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (headEslesme) {
    headEslesme[1].replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_t, css) => {
      stiller.push(String(css).trim());
      return '';
    });
  }

  let govde = kaynak;
  const bodyEslesme = kaynak.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyEslesme) {
    govde = bodyEslesme[1];
  } else {
    govde = govde.replace(/<\/?html[^>]*>/gi, '');
    govde = govde.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
    govde = govde.replace(/<\/?body[^>]*>/gi, '');
  }

  govde = govde.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_t, css) => {
    stiller.push(String(css).trim());
    return '';
  });

  return { govde: govde.trim(), stiller };
}

/** Eski API uyumluluğu */
export function sayfaHtmlGovdeCikar(html: string): string {
  return sayfaHtmlParcala(html).govde;
}

/** CSS kurallarını sayfa köküne kapsüller */
function cssKapsula(css: string, kapsul: string): string {
  const bodyHtmlDegistirilmis = css
    .replace(/\bhtml\b/g, kapsul)
    .replace(/\bbody\b/g, kapsul);

  return bodyHtmlDegistirilmis.replace(/(^|})\s*([^@{}][^{]*)\{/g, (_match, kapanis, seciciler) => {
    const yeni = seciciler
      .split(',')
      .map((s: string) => {
        const t = s.trim();
        if (!t) return t;
        if (t.startsWith(kapsul)) return t;
        if (t === ':host' || t.startsWith(':host')) return t;
        return `${kapsul} ${t}`;
      })
      .join(', ');
    return `${kapanis} ${yeni} {`;
  });
}

export interface HazirlanmisSayfaIcerik {
  html: string;
  onizlemeBelgesi: string;
  govde: string;
  stiller: string[];
}

/** dangerouslySetInnerHTML için kapsüllü HTML (yedek) */
export function sayfaIcerikHazirla(html: string): HazirlanmisSayfaIcerik {
  const { govde, stiller } = sayfaHtmlParcala(html);
  if (!govde && stiller.length === 0) {
    return { html: '', onizlemeBelgesi: '', govde: '', stiller: [] };
  }

  const kapsul = `.${KOK_SINIF}`;
  const kapsulluStiller = stiller.map((s) => cssKapsula(s, kapsul));
  const styleEtiketi =
    kapsulluStiller.length > 0 ? `<style>${kapsulluStiller.join('\n')}</style>` : '';

  return {
    govde,
    stiller,
    html: `${styleEtiketi}<div class="${KOK_SINIF}">${govde}</div>`,
    onizlemeBelgesi: tamHtmlBelgesiOlustur(html),
  };
}

/** Admin önizlemesi — izole iframe belgesi */
export function tamHtmlBelgesiOlustur(icerik: string): string {
  if (/<html[\s>]/i.test(icerik.trim())) {
    return icerik.trim();
  }
  const { govde, stiller } = sayfaHtmlParcala(icerik);
  const styleBlok = stiller.map((s) => `<style>${s}</style>`).join('\n');
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>html,body{margin:0;padding:0;min-height:100%;}</style>
  ${styleBlok}
</head>
<body>${govde || icerik}</body>
</html>`;
}

/** Shadow DOM içine yazılacak içerik */
export function sayfaShadowIcerikHazirla(html: string): string {
  const { govde, stiller } = sayfaHtmlParcala(html);
  const styleBlok = stiller.map((s) => `<style>${s}</style>`).join('\n');
  return `${styleBlok}<div class="sayfa-icerik-govde">${govde}</div>`;
}
