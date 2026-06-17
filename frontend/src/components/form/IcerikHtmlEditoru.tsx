import { useState } from 'react';
import { ZenginMetinEditoru } from '@/components/form/ZenginMetinEditoru';

type EditorModu = 'gorsel' | 'html';

interface IcerikHtmlEditoruProps {
  deger: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function IcerikHtmlEditoru({ deger, onChange, placeholder }: IcerikHtmlEditoruProps) {
  const [mod, setMod] = useState<EditorModu>('gorsel');

  return (
    <div className="ap-icerik-editor">
      <div className="ap-icerik-editor-modlar">
        <button
          type="button"
          className={mod === 'gorsel' ? 'ap-icerik-editor-mod-aktif' : ''}
          onClick={() => setMod('gorsel')}
        >
          Görsel Editör
        </button>
        <button
          type="button"
          className={mod === 'html' ? 'ap-icerik-editor-mod-aktif' : ''}
          onClick={() => setMod('html')}
        >
          HTML Kodu
        </button>
      </div>

      {mod === 'gorsel' ? (
        <ZenginMetinEditoru deger={deger} onChange={onChange} placeholder={placeholder} />
      ) : (
        <div className="ap-icerik-html-grid">
          <div>
            <p className="ap-muted mb-2 text-xs">
              HTML kodunuzu doğrudan yazın. Kaydettiğinizde sayfa bu kodu olduğu gibi gösterir.
            </p>
            <textarea
              className="ap-icerik-html-textarea"
              value={deger}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder ?? '<section>\n  <h2>Başlık</h2>\n  <p>Paragraf...</p>\n</section>'}
              spellCheck={false}
            />
          </div>
          <div>
            <p className="ap-muted mb-2 text-xs font-medium uppercase tracking-wide">Önizleme</p>
            <div className="ap-icerik-html-onizleme site-public">
              {deger.trim() ? (
                <div className="sayfa-icerik-html" dangerouslySetInnerHTML={{ __html: deger }} />
              ) : (
                <p className="ap-muted text-sm">HTML önizlemesi burada görünür.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
