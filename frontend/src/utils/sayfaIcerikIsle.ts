const KOK_SINIF = 'sayfa-icerik-kok';

/** Tam HTML belgesinden yalnızca gövde içeriğini çıkarır */
export function sayfaHtmlGovdeCikar(html: string): string {
  let icerik = html.trim();
  if (!icerik) return '';

  icerik = icerik.replace(/<!DOCTYPE[^>]*>/gi, '');

  const bodyEslesme = icerik.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyEslesme) return bodyEslesme[1].trim();

  icerik = icerik.replace(/<\/?html[^>]*>/gi, '');
  icerik = icerik.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
  icerik = icerik.replace(/<\/?body[^>]*>/gi, '');

  return icerik.trim();
}

/** CSS kurallarını sayfa köküne kapsüller — body/html siteyi bozmaz */
function cssKapsula(css: string, kapsul: string): string {
  return css.replace(/(^|})\s*([^@{}][^{]*)\{/g, (_match, kapanis, seciciler) => {
    const yeni = seciciler
      .split(',')
      .map((s: string) => {
        const t = s.trim();
        if (!t) return t;
        if (t === 'body' || t === 'html') return kapsul;
        if (/^(body|html)\s+/i.test(t)) return t.replace(/^(body|html)\s+/i, `${kapsul} `);
        if (t.startsWith(kapsul)) return t;
        return `${kapsul} ${t}`;
      })
      .join(', ');
    return `${kapanis} ${yeni} {`;
  });
}

export interface HazirlanmisSayfaIcerik {
  html: string;
  onizlemeBelgesi: string;
}

/** Public sitede güvenli render için içeriği hazırlar */
export function sayfaIcerikHazirla(html: string): HazirlanmisSayfaIcerik {
  const govde = sayfaHtmlGovdeCikar(html);
  if (!govde) {
    return { html: '', onizlemeBelgesi: '' };
  }

  const stiller: string[] = [];
  const kapsul = `.${KOK_SINIF}`;

  const govdeStilsiz = govde.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_tam, css) => {
    stiller.push(cssKapsula(String(css).trim(), kapsul));
    return '';
  });

  const styleEtiketi =
    stiller.length > 0 ? `<style>${stiller.join('\n')}</style>` : '';

  const htmlCikti = `${styleEtiketi}<div class="${KOK_SINIF}">${govdeStilsiz}</div>`;

  const onizlemeBelgesi = tamHtmlBelgesiOlustur(govde);

  return { html: htmlCikti, onizlemeBelgesi };
}

/** Admin önizlemesi — izole iframe belgesi */
export function tamHtmlBelgesiOlustur(icerik: string): string {
  const govde = sayfaHtmlGovdeCikar(icerik);
  if (/<html[\s>]/i.test(icerik.trim())) {
    return icerik.trim();
  }
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>html,body{margin:0;padding:0;min-height:100%;}</style>
</head>
<body>${govde || icerik}</body>
</html>`;
}
