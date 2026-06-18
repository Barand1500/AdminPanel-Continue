import { useEffect, useRef, useState } from 'react';
import { formInputSinifi } from '@/components/form/FormAlani';

const EMOJI_KATEGORILERI = [
  {
    ad: 'Genel',
    emojiler: ['⭐', '✅', '❌', '🔥', '🚀', '💡', '🎯', '🏆', '🎉', '💎', '🔔', '📌', '🛡️', '⚡', '✨', '🌟'],
  },
  {
    ad: 'İş',
    emojiler: ['💼', '📊', '📈', '💰', '🏢', '📋', '📝', '🤝', '📦', '🛒', '💳', '🏦', '📑', '🗂️', '📎', '🔖'],
  },
  {
    ad: 'Teknoloji',
    emojiler: ['💻', '🖥️', '📱', '⌨️', '🖱️', '💾', '🔧', '⚙️', '🔌', '🌐', '📡', '🛰️', '🤖', '🔬', '🧪', '🔋'],
  },
  {
    ad: 'İletişim',
    emojiler: ['📞', '📧', '✉️', '💬', '📨', '📩', '📬', '📭', '🗨️', '☎️', '📠', '📣', '📢', '🔊', '🔔', '📲'],
  },
  {
    ad: 'Hizmet',
    emojiler: ['🎧', '🛠️', '🔧', '🔨', '🪛', '🧰', '👷', '👨‍💻', '👩‍💻', '🧑‍💼', '👨‍🔧', '🔍', '📐', '📏', '🗺️', '🧭'],
  },
  {
    ad: 'Eğitim',
    emojiler: ['📚', '📖', '🎓', '✏️', '📕', '📗', '📘', '📙', '🏫', '🧑‍🏫', '📝', '🖊️', '📒', '📓', '🔖', '🎒'],
  },
  {
    ad: 'Sağlık',
    emojiler: ['🏥', '💊', '🩺', '🏥', '❤️', '💚', '🧘', '🏃', '🚴', '⚕️', '🩹', '🧴', '🫀', '🧠', '👁️', '🦷'],
  },
  {
    ad: 'Doğa',
    emojiler: ['🌿', '🌱', '🌳', '🌸', '🌺', '🌻', '🍀', '🌍', '🌎', '🌏', '☀️', '🌙', '⛅', '🌈', '💧', '🔥'],
  },
  {
    ad: 'Yemek',
    emojiler: ['🍕', '🍔', '🍎', '☕', '🍰', '🥗', '🍜', '🧁', '🍩', '🥤', '🍳', '🥐', '🧃', '🍪', '🫕', '🍱'],
  },
  {
    ad: 'Ulaşım',
    emojiler: ['🚗', '🚕', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '✈️', '🚀', '🛸', '🚢', '⛵', '🚁', '🛵', '🚲'],
  },
  {
    ad: 'Sembol',
    emojiler: ['❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '👍', '👎', '👋', '🙏', '💪', '🤝', '✌️', '👏'],
  },
  {
    ad: 'Ev',
    emojiler: ['🏠', '🏡', '🏘️', '🏗️', '🛋️', '🪑', '🛏️', '🚪', '🪟', '🔑', '🧹', '🧺', '🛁', '🚿', '🧯', '🔒'],
  },
] as const;

interface EmojiSeciciProps {
  deger: string;
  onChange: (emoji: string) => void;
  placeholder?: string;
  /** true ise yalnızca panelden seçim; metin yazılamaz */
  sadeceSecim?: boolean;
}

export function EmojiSecici({ deger, onChange, placeholder = 'Emoji seçin', sadeceSecim = false }: EmojiSeciciProps) {
  const [acik, setAcik] = useState(false);
  const [aktifKategori, setAktifKategori] = useState(0);
  const kapsayiciRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!acik) return;
    function disariTikla(e: MouseEvent) {
      if (kapsayiciRef.current && !kapsayiciRef.current.contains(e.target as Node)) {
        setAcik(false);
      }
    }
    document.addEventListener('mousedown', disariTikla);
    return () => document.removeEventListener('mousedown', disariTikla);
  }, [acik]);

  return (
    <div ref={kapsayiciRef} className="emoji-secici">
      <div className="emoji-secici-girdi">
        <input
          className={formInputSinifi}
          value={deger}
          onChange={(e) => !sadeceSecim && onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={sadeceSecim ? 4 : 8}
          readOnly={sadeceSecim}
        />
        <button
          type="button"
          className="emoji-secici-tus"
          onClick={() => setAcik((o) => !o)}
          title="Emoji seç"
          aria-label="Emoji seç"
        >
          {deger.trim() || '😀'}
        </button>
      </div>

      {acik && (
        <div className="emoji-secici-panel">
          <div className="emoji-secici-kategoriler">
            {EMOJI_KATEGORILERI.map((kat, i) => (
              <button
                key={kat.ad}
                type="button"
                className={`emoji-secici-kategori-tus ${i === aktifKategori ? 'emoji-secici-kategori-tus-aktif' : ''}`}
                onClick={() => setAktifKategori(i)}
              >
                {kat.ad}
              </button>
            ))}
          </div>
          <div className="emoji-secici-grid">
            {EMOJI_KATEGORILERI[aktifKategori].emojiler.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`emoji-secici-oge ${deger === emoji ? 'emoji-secici-oge-secili' : ''}`}
                onClick={() => {
                  onChange(emoji);
                  setAcik(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
