import { useRef, type ReactNode } from 'react';

const VARSAYILAN_ONERILER = ['📍', '✉️', '📞', '💬', '🏦', '🔒', '🛡️', '✓', '⭐', '📦', '🚚', '💳'];

/** Girdiden yalnızca ilk emoji/grafem alır; harf ve rakam kabul etmez */
export function tekEmojiAl(deger: string): string {
  if (!deger) return '';
  try {
    const segmenter = new Intl.Segmenter('tr', { granularity: 'grapheme' });
    for (const { segment } of segmenter.segment(deger)) {
      if (/\p{Extended_Pictographic}/u.test(segment)) return segment;
    }
  } catch {
    // Intl.Segmenter desteklenmiyorsa basit fallback
    const match = deger.match(/\p{Extended_Pictographic}/u);
    if (match) return match[0];
  }
  return '';
}

interface EmojiIkonSeciciProps {
  deger: string;
  onDegistir: (v: string) => void;
  oneriler?: string[];
  etiket?: string;
}

export function EmojiIkonSecici({
  deger,
  onDegistir,
  oneriler = VARSAYILAN_ONERILER,
  etiket,
}: EmojiIkonSeciciProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const emojiGuncelle = (ham: string) => {
    onDegistir(tekEmojiAl(ham));
  };

  return (
    <div className="inline-flex flex-col gap-1">
      {etiket && <span className="ap-muted text-[10px] font-medium">{etiket}</span>}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] text-lg leading-none transition hover:border-[var(--ap-accent)]"
          title="İkon seç"
        >
          {deger || '＋'}
        </button>
        <input
          ref={inputRef}
          type="text"
          value={deger}
          onChange={(e) => emojiGuncelle(e.target.value)}
          onPaste={(e) => {
            e.preventDefault();
            emojiGuncelle(e.clipboardData.getData('text'));
          }}
          className="sr-only"
          aria-label={etiket ?? 'İkon'}
        />
        <div className="flex flex-wrap gap-0.5">
          {oneriler.slice(0, 6).map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onDegistir(emoji)}
              className={`flex h-7 w-7 items-center justify-center rounded border text-sm transition hover:border-[var(--ap-accent)] ${
                deger === emoji
                  ? 'border-[var(--ap-accent)] bg-[var(--ap-accent)]/10'
                  : 'border-transparent bg-[var(--ap-hover)]'
              }`}
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Rozet / satır içi kompakt ikon + metin düzeni */
export function EmojiMetinSatiri({
  ikon,
  metin,
  onIkonDegistir,
  onMetinDegistir,
  oneriler,
  sagAlan,
}: {
  ikon: string;
  metin: string;
  onIkonDegistir: (v: string) => void;
  onMetinDegistir: (v: string) => void;
  oneriler?: string[];
  sagAlan?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--ap-border)] px-2 py-1.5">
      <EmojiIkonSecici deger={ikon} onDegistir={onIkonDegistir} oneriler={oneriler} />
      <input
        type="text"
        value={metin}
        onChange={(e) => onMetinDegistir(e.target.value)}
        className="min-w-0 flex-1 rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--ap-accent)]"
        placeholder="Metin"
      />
      {sagAlan}
    </div>
  );
}
