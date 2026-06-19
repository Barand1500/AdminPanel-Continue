import type { ScriptAyarlari } from '@/types/sistemAyarlari';

const ISARET = 'data-site-script';

function htmlParcalariniEnjekteEt(
  html: string,
  hedef: HTMLElement,
  konum: 'append' | 'prepend' = 'append'
) {
  if (!html.trim()) return () => {};

  const sarmalayici = document.createElement('div');
  sarmalayici.innerHTML = html.trim();
  const eklenenler: Node[] = [];

  sarmalayici.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'SCRIPT') {
      const kaynak = node as HTMLScriptElement;
      const script = document.createElement('script');
      script.setAttribute(ISARET, '1');
      Array.from(kaynak.attributes).forEach((attr) => script.setAttribute(attr.name, attr.value));
      if (kaynak.textContent) script.textContent = kaynak.textContent;
      eklenenler.push(script);
    } else if (node.nodeType === Node.COMMENT_NODE) {
      eklenenler.push(document.createComment(node.textContent ?? ''));
    } else if (node.nodeType === Node.TEXT_NODE) {
      const metin = node.textContent?.trim();
      if (!metin) return;
      const script = document.createElement('script');
      script.setAttribute(ISARET, '1');
      script.textContent = metin;
      eklenenler.push(script);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const klon = node.cloneNode(true) as HTMLElement;
      klon.setAttribute(ISARET, '1');
      eklenenler.push(klon);
    }
  });

  if (konum === 'prepend') {
    for (let i = eklenenler.length - 1; i >= 0; i -= 1) {
      hedef.insertBefore(eklenenler[i], hedef.firstChild);
    }
  } else {
    eklenenler.forEach((el) => hedef.appendChild(el));
  }

  return () => {
    eklenenler.forEach((el) => el.parentNode?.removeChild(el));
  };
}

export function siteScriptParcalariEnjekteEt(script: ScriptAyarlari) {
  const headHtml = [script.googleAnalytics, script.headerScript].filter(Boolean).join('\n');
  const headTemizle = htmlParcalariniEnjekteEt(headHtml, document.head);
  const bodyAcilisTemizle = htmlParcalariniEnjekteEt(script.bodyAcilisScript, document.body, 'prepend');
  const footerTemizle = htmlParcalariniEnjekteEt(script.footerScript, document.body);

  return () => {
    headTemizle();
    bodyAcilisTemizle();
    footerTemizle();
  };
}
