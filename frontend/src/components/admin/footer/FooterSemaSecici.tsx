import {
  FOOTER_GORSEL_KONUM_ETIKET,
  FOOTER_SEMA_ETIKET,
  FOOTER_LINK_IKON_ETIKET,
  type FooterAyarlari,
  type FooterGorselKonum,
  type FooterLinkIkon,
  type FooterSema,
} from '@/types/footer';
import { formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';

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

const GORSEL_KONUMLAR: FooterGorselKonum[] = ['sag', 'sol', 'ust', 'alt'];

export function FooterSemaSecici({ footer, onDegistir }: FooterSemaSeciciProps) {
  const dekor = footer.gorselDekor ?? { aktif: false, gorselUrl: '', konum: 'sag' as FooterGorselKonum };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

      <div className="rounded-xl border border-[var(--ap-border)] p-4">
        <label className={`ap-toggle-kart mb-3 flex cursor-pointer items-center justify-between ${dekor.aktif ? 'ap-toggle-aktif ap-toggle-yesil' : ''}`}>
          <div>
            <p className="ap-heading text-sm font-semibold">Footer görseli</p>
            <p className="ap-muted text-xs">Sağ/sol/üst/alt konuma dekoratif görsel</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={dekor.aktif}
            onClick={() =>
              onDegistir({
                ...footer,
                gorselDekor: { ...dekor, aktif: !dekor.aktif },
              })
            }
            className={`ap-toggle ${dekor.aktif ? 'ap-toggle-on' : ''}`}
          >
            <span className="ap-toggle-thumb" />
          </button>
        </label>

        {dekor.aktif && (
          <div className="space-y-4">
            <GorselAlan
              etiket="Görsel"
              deger={dekor.gorselUrl}
              onChange={(gorselUrl) =>
                onDegistir({ ...footer, gorselDekor: { ...dekor, gorselUrl } })
              }
            />
            <div>
              <span className="ap-muted mb-2 block text-xs font-medium">Konum</span>
              <div className="flex flex-wrap gap-2">
                {GORSEL_KONUMLAR.map((konum) => (
                  <button
                    key={konum}
                    type="button"
                    onClick={() =>
                      onDegistir({ ...footer, gorselDekor: { ...dekor, konum } })
                    }
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      dekor.konum === konum
                        ? 'border-[var(--ap-accent)] bg-[var(--ap-accent)] text-white'
                        : 'border-[var(--ap-border)] ap-muted hover:bg-[var(--ap-hover)]'
                    }`}
                  >
                    {FOOTER_GORSEL_KONUM_ETIKET[konum]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
