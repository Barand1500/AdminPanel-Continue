import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
    emojiler: ['🏥', '💊', '🩺', '❤️', '💚', '🧘', '🏃', '🚴', '⚕️', '🩹', '🧴', '🫀', '🧠', '👁️', '🦷', '🌡️'],
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
  /** true ise yalnızca ikon butonu; metin yazılamaz */
  sadeceSecim?: boolean;
}

function EmojiPanelIcerik({
  deger,
  aktifKategori,
  onKategori,
  onSec,
}: {
  deger: string;
  aktifKategori: number;
  onKategori: (i: number) => void;
  onSec: (emoji: string) => void;
}) {
  return (
    <>
      <div className="emoji-secici-kategoriler">
        {EMOJI_KATEGORILERI.map((kat, i) => (
          <button
            key={kat.ad}
            type="button"
            className={`emoji-secici-kategori-tus ${i === aktifKategori ? 'emoji-secici-kategori-tus-aktif' : ''}`}
            onClick={() => onKategori(i)}
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
            onClick={() => onSec(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
}

export function EmojiSecici({
  deger,
  onChange,
  placeholder = 'Emoji seçin',
  sadeceSecim = false,
}: EmojiSeciciProps) {
  const [acik, setAcik] = useState(false);
  const [aktifKategori, setAktifKategori] = useState(0);
  const [panelKonum, setPanelKonum] = useState({ top: 0, left: 0, width: 320 });
  const kapsayiciRef = useRef<HTMLDivElement>(null);
  const tetikRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const panelKonumGuncelle = () => {
    const el = tetikRef.current ?? kapsayiciRef.current?.querySelector('button');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const genislik = 320;
    let left = rect.left;
    if (left + genislik > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - genislik - 12);
    }
    setPanelKonum({ top: rect.bottom + 6, left, width: genislik });
  };

  useLayoutEffect(() => {
    if (!acik) return;
    panelKonumGuncelle();
    window.addEventListener('resize', panelKonumGuncelle);
    window.addEventListener('scroll', panelKonumGuncelle, true);
    return () => {
      window.removeEventListener('resize', panelKonumGuncelle);
      window.removeEventListener('scroll', panelKonumGuncelle, true);
    };
  }, [acik, aktifKategori]);

  useEffect(() => {
    if (!acik) return;
    function disariTikla(e: MouseEvent) {
      const hedef = e.target as Node;
      if (kapsayiciRef.current?.contains(hedef)) return;
      if (panelRef.current?.contains(hedef)) return;
      setAcik(false);
    }
    document.addEventListener('mousedown', disariTikla);
    return () => document.removeEventListener('mousedown', disariTikla);
  }, [acik]);

  function emojiSec(emoji: string) {
    onChange(emoji);
    setAcik(false);
  }

  const panel =
    acik &&
    createPortal(
      <div
        ref={panelRef}
        className="emoji-secici-panel emoji-secici-panel-portal"
        style={{ top: panelKonum.top, left: panelKonum.left, width: panelKonum.width }}
        role="dialog"
        aria-label="Emoji seç"
      >
        <EmojiPanelIcerik
          deger={deger}
          aktifKategori={aktifKategori}
          onKategori={setAktifKategori}
          onSec={emojiSec}
        />
      </div>,
      document.body
    );

  if (sadeceSecim) {
    return (
      <div ref={kapsayiciRef} className="emoji-secici emoji-secici-sadece">
        <button
          ref={tetikRef}
          type="button"
          className={`emoji-secici-tus-buyuk ${acik ? 'emoji-secici-tus-buyuk-acik' : ''}`}
          onClick={() => setAcik((o) => !o)}
          title="İkon seç"
          aria-label="İkon seç"
          aria-expanded={acik}
        >
          <span className="emoji-secici-tus-emoji">{deger.trim() || '👤'}</span>
          <span className="emoji-secici-tus-etiket">İkon seç</span>
        </button>
        {panel}
      </div>
    );
  }

  return (
    <div ref={kapsayiciRef} className="emoji-secici">
      <div className="emoji-secici-girdi">
        <input
          className={formInputSinifi}
          value={deger}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={8}
        />
        <button
          ref={tetikRef}
          type="button"
          className="emoji-secici-tus"
          onClick={() => setAcik((o) => !o)}
          title="Emoji seç"
          aria-label="Emoji seç"
          aria-expanded={acik}
        >
          {deger.trim() || '😀'}
        </button>
      </div>
      {panel}
    </div>
  );
}
