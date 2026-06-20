import { useState } from 'react';
import type { AdminWidget } from '@/types/admin';
import { ZenginMetinEditoru } from '@/components/form/ZenginMetinEditoru';
import { HtmlKodEditoru } from '@/components/form/HtmlKodEditoru';

type EditorModu = 'gorsel' | 'html';

interface IcerikHtmlEditoruProps {
  deger: string;
  onChange: (html: string) => void;
  placeholder?: string;
  sayfaWidgetlari?: AdminWidget[];
}

export function IcerikHtmlEditoru({ deger, onChange, placeholder, sayfaWidgetlari }: IcerikHtmlEditoruProps) {
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
        <HtmlKodEditoru
          deger={deger}
          onChange={onChange}
          placeholder={placeholder}
          sayfaWidgetlari={sayfaWidgetlari}
        />
      )}
    </div>
  );
}
