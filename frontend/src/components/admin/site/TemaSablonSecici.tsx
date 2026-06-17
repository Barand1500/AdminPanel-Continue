import type { GeceSablonId, GunduzSablonId } from '@/types/temaAyarlari';
import { GECE_SABLONLARI, GUNDUZ_SABLONLARI } from '@/types/temaAyarlari';

interface GunduzSablonSeciciProps {
  secili: GunduzSablonId;
  onSec: (id: Exclude<GunduzSablonId, 'ozel'>) => void;
}

export function GunduzSablonSecici({ secili, onSec }: GunduzSablonSeciciProps) {
  return (
    <div>
      <p className="ap-muted mb-2 text-xs font-medium">Gündüz şablonları</p>
      <div className="flex flex-wrap gap-2">
        {GUNDUZ_SABLONLARI.map((sablon) => {
          const aktif = secili === sablon.id;
          return (
            <button
              key={sablon.id}
              type="button"
              onClick={() => onSec(sablon.id)}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition ${
                aktif
                  ? 'border-[var(--ap-accent)] bg-[var(--ap-accent)]/10 ring-1 ring-[var(--ap-accent)]'
                  : 'border-[var(--ap-border)] hover:border-[var(--ap-accent)]/50'
              }`}
              title={sablon.ad}
            >
              <span
                className="h-5 w-8 shrink-0 rounded"
                style={{
                  background: `linear-gradient(135deg, ${sablon.anaRenk}, ${sablon.ikincilRenk})`,
                }}
              />
              <span className="ap-heading font-medium">{sablon.ad}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface GeceSablonSeciciProps {
  secili: GeceSablonId;
  onSec: (id: GeceSablonId) => void;
}

export function GeceSablonSecici({ secili, onSec }: GeceSablonSeciciProps) {
  return (
    <div>
      <p className="ap-muted mb-2 text-xs font-medium">Gece modu şablonları</p>
      <div className="flex flex-wrap gap-2">
        {GECE_SABLONLARI.map((sablon) => {
          const aktif = secili === sablon.id;
          const { palet } = sablon;
          return (
            <button
              key={sablon.id}
              type="button"
              onClick={() => onSec(sablon.id)}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition ${
                aktif
                  ? 'border-[var(--ap-accent)] bg-[var(--ap-accent)]/10 ring-1 ring-[var(--ap-accent)]'
                  : 'border-[var(--ap-border)] hover:border-[var(--ap-accent)]/50'
              }`}
              title={sablon.ad}
            >
              <span
                className="flex h-5 w-8 shrink-0 overflow-hidden rounded border"
                style={{ borderColor: palet.border }}
              >
                <span className="h-full w-1/2" style={{ background: palet.surface }} />
                <span className="h-full w-1/2" style={{ background: palet.primary }} />
              </span>
              <span className="ap-heading font-medium">{sablon.ad}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
