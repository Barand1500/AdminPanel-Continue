import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { tamHtmlBelgesiOlustur } from '@/utils/sayfaIcerikIsle';

const HTML_ETIKETLER = [
  'div',
  'span',
  'p',
  'section',
  'article',
  'header',
  'footer',
  'main',
  'h1',
  'h2',
  'h3',
  'h4',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'button',
  'style',
  'strong',
  'em',
  'br',
  'table',
  'tr',
  'td',
  'th',
];

const KAPANIS_ETIKETLER = new Set([
  'div',
  'span',
  'p',
  'section',
  'article',
  'header',
  'footer',
  'main',
  'h1',
  'h2',
  'h3',
  'h4',
  'ul',
  'ol',
  'li',
  'a',
  'button',
  'style',
  'strong',
  'em',
  'table',
  'tr',
  'td',
  'th',
]);

interface HtmlKodEditoruProps {
  deger: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function HtmlKodEditoru({ deger, onChange, placeholder }: HtmlKodEditoruProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [oneriler, setOneriler] = useState<string[]>([]);
  const [oneriIndeks, setOneriIndeks] = useState(0);
  const [aktifEtiket, setAktifEtiket] = useState('');

  const onizlemeBelgesi = useMemo(
    () => (deger.trim() ? tamHtmlBelgesiOlustur(deger) : ''),
    [deger]
  );

  const oneriGuncelle = useCallback((metin: string, imlec: number) => {
    const once = metin.slice(0, imlec);
    const eslesme = once.match(/<([a-zA-Z][\w-]*)$/);
    if (!eslesme) {
      setOneriler([]);
      setAktifEtiket('');
      return;
    }
    const parca = eslesme[1].toLowerCase();
    const liste = HTML_ETIKETLER.filter((e) => e.startsWith(parca)).slice(0, 8);
    setAktifEtiket(parca);
    setOneriler(liste);
    setOneriIndeks(0);
  }, []);

  function etiketEkle(etiket: string) {
    const el = textareaRef.current;
    if (!el) return;

    const metin = el.value;
    const imlec = el.selectionStart;
    const once = metin.slice(0, imlec);
    const sonra = metin.slice(imlec);
    const baslangic = once.lastIndexOf('<');
    if (baslangic < 0) return;

    const onEk = metin.slice(0, baslangic);
    const kapanisli = KAPANIS_ETIKETLER.has(etiket);
    const ekleme = kapanisli ? `<${etiket}></${etiket}>` : `<${etiket}>`;
    const yeni = onEk + ekleme + sonra;
    onChange(yeni);
    setOneriler([]);

    requestAnimationFrame(() => {
      const yeniImlec = kapanisli ? onEk.length + etiket.length + 2 : onEk.length + ekleme.length;
      el.focus();
      el.setSelectionRange(yeniImlec, yeniImlec);
    });
  }

  function tusBas(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (oneriler.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOneriIndeks((i) => (i + 1) % oneriler.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOneriIndeks((i) => (i - 1 + oneriler.length) % oneriler.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      etiketEkle(oneriler[oneriIndeks]);
    } else if (e.key === 'Escape') {
      setOneriler([]);
    }
  }

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    oneriGuncelle(el.value, el.selectionStart);
  }, [deger, oneriGuncelle]);

  return (
    <div className="ap-icerik-html-grid">
      <div className="ap-icerik-html-editor-wrap">
        <p className="ap-muted mb-2 text-xs">
          HTML yazın; <code>&lt;</code> sonrası etiket önerileri çıkar (Tab/Enter ile tamamlayın).
          CSS yalnızca bu sayfaya uygulanır.
        </p>
        <div className="ap-icerik-html-editor-kutu">
          <textarea
            ref={textareaRef}
            className="ap-icerik-html-textarea"
            value={deger}
            onChange={(e) => {
              onChange(e.target.value);
              oneriGuncelle(e.target.value, e.target.selectionStart);
            }}
            onKeyDown={tusBas}
            onClick={(e) => oneriGuncelle(e.currentTarget.value, e.currentTarget.selectionStart)}
            onKeyUp={(e) => oneriGuncelle(e.currentTarget.value, e.currentTarget.selectionStart)}
            placeholder={placeholder ?? '<section>\n  <h2>Başlık</h2>\n</section>'}
            spellCheck={false}
          />
          {oneriler.length > 0 && (
            <ul className="ap-html-oneri-listesi" role="listbox">
              {oneriler.map((etiket, i) => (
                <li key={etiket}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === oneriIndeks}
                    className={i === oneriIndeks ? 'ap-html-oneri-aktif' : ''}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      etiketEkle(etiket);
                    }}
                  >
                    &lt;{aktifEtiket}
                    <strong>{etiket.slice(aktifEtiket.length)}</strong>&gt;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div>
        <p className="ap-muted mb-2 text-xs font-medium uppercase tracking-wide">Önizleme</p>
        <div className="ap-icerik-html-onizleme">
          {onizlemeBelgesi ? (
            <iframe
              title="HTML önizleme"
              className="ap-icerik-html-iframe"
              sandbox="allow-same-origin"
              srcDoc={onizlemeBelgesi}
            />
          ) : (
            <p className="ap-muted p-4 text-sm">HTML önizlemesi burada görünür.</p>
          )}
        </div>
      </div>
    </div>
  );
}
