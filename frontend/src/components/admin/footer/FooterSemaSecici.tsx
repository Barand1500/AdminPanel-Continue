import {
  FOOTER_SEMA_ETIKET,
  FOOTER_LINK_IKON_ETIKET,
  type FooterAyarlari,
  type FooterLinkIkon,
  type FooterSema,
} from '@/types/footer';
import { formInputSinifi } from '@/components/form/FormAlani';

const SEMALAR: FooterSema[] = ['dort-kolon', 'uc-kolon', 'iki-kolon', 'merkezi'];

function SemaMinyatur({ sema }: { sema: FooterSema }) {
  const blok = 'rounded-sm bg-primary/30';
  if (sema === 'dort-kolon') {
    return (
      <div className="grid h-10 grid-cols-4 gap-0.5 p-1">
        <div className={`${blok} col-span-1`} />
        <div className={blok} />
        <div className={blok} />
        <div className={blok} />
      </div>
    );
  }
  if (sema === 'uc-kolon') {
    return (
      <div className="flex h-10 flex-col gap-0.5 p-1">
        <div className={`${blok} h-3 w-full`} />
        <div className="grid flex-1 grid-cols-3 gap-0.5">
          <div className={blok} />
          <div className={blok} />
          <div className={blok} />
        </div>
      </div>
    );
  }
  if (sema === 'iki-kolon') {
    return (
      <div className="grid h-10 grid-cols-2 gap-0.5 p-1">
        <div className={blok} />
        <div className={blok} />
      </div>
    );
  }
  return (
    <div className="flex h-10 flex-col items-center gap-0.5 p-1">
      <div className={`${blok} h-3 w-1/2`} />
      <div className={`${blok} h-2 w-2/3`} />
      <div className={`${blok} h-2 w-1/2`} />
    </div>
  );
}

interface FooterSemaSeciciProps {
  footer: FooterAyarlari;
  onDegistir: (footer: FooterAyarlari) => void;
}

export function FooterSemaSecici({ footer, onDegistir }: FooterSemaSeciciProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {SEMALAR.map((sema) => {
          const secili = footer.sema === sema;
          const etiket = FOOTER_SEMA_ETIKET[sema];
          return (
            <button
              key={sema}
              type="button"
              onClick={() => onDegistir({ ...footer, sema })}
              className={`rounded-xl border p-3 text-left transition ${
                secili
                  ? 'border-[var(--ap-accent)] bg-[var(--ap-accent)]/5 ring-1 ring-[var(--ap-accent)]'
                  : 'border-[var(--ap-border)] hover:border-[var(--ap-accent)]/50'
              }`}
            >
              <div className="mb-2 overflow-hidden rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)]">
                <SemaMinyatur sema={sema} />
              </div>
              <p className="ap-heading text-sm font-semibold">{etiket.ad}</p>
              <p className="ap-muted text-xs">{etiket.aciklama}</p>
            </button>
          );
        })}
      </div>

      <label className="block">
        <span className="ap-muted mb-1 block text-xs font-medium">Link ikon stili</span>
        <select
          value={footer.linkIkon}
          onChange={(e) => onDegistir({ ...footer, linkIkon: e.target.value as FooterLinkIkon })}
          className={formInputSinifi}
        >
          {(Object.keys(FOOTER_LINK_IKON_ETIKET) as FooterLinkIkon[]).map((k) => (
            <option key={k} value={k}>
              {FOOTER_LINK_IKON_ETIKET[k]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
