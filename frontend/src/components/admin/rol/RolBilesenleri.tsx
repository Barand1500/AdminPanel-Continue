import { YETKI_ETIKETLERI, type RolTanimi, type YetkiKodu, type YetkiTanimi } from '@/features/admin/rolApi';

const SISTEM_ROL_KODLARI = new Set([
  'SUPER_ADMIN',
  'AJANS_ADMIN',
  'MUSTERI_ADMIN',
  'EDITOR',
  'SEO_EDITOR',
  'GORUNTULEME',
]);

export function rolSilinebilirMi(rol: RolTanimi): boolean {
  if (SISTEM_ROL_KODLARI.has(rol.kod)) return false;
  return rol.sistemRolu !== true;
}

interface RolMatrisiProps {
  roller: RolTanimi[];
  yetkiler: YetkiTanimi[];
  duzenlenebilir?: boolean;
  onYetkiToggle?: (rolKod: string, yetkiKod: YetkiKodu) => void;
}

export function RolMatrisi({ roller, yetkiler, duzenlenebilir, onYetkiToggle }: RolMatrisiProps) {
  return (
    <div className="min-w-[620px] overflow-x-auto bg-[var(--ap-surface)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--ap-border)] bg-[var(--ap-surface-2)]">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--ap-muted)]">Rol</th>
            {yetkiler.map((y) => (
              <th key={y.kod} className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-[var(--ap-muted)]">
                {y.etiket}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roller.map((rol) => {
            const superAdmin = rol.kod === 'SUPER_ADMIN';
            const hucreDuzenlenebilir = duzenlenebilir && !superAdmin;
            return (
              <tr key={rol.kod} className="border-b border-[var(--ap-border)] last:border-b-0 hover:bg-[var(--ap-hover)]">
                <td className="px-4 py-3">
                  <div className="ap-heading font-semibold">{rol.baslik}</div>
                  <div className="ap-muted mt-1 text-[10px] uppercase tracking-wide">{rol.kod}</div>
                  {(rol.sistemRolu || !rolSilinebilirMi(rol)) && (
                    <span className="mt-2 inline-flex rounded-full border border-[color-mix(in_srgb,var(--ap-accent)_38%,var(--ap-border))] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--ap-accent)]">
                      Sistem rolü
                    </span>
                  )}
                </td>
                {yetkiler.map((y) => {
                  const varMi = rol.yetkiler.includes(y.kod);
                  return (
                    <td key={y.kod} className="px-3 py-3 text-center">
                      {hucreDuzenlenebilir ? (
                        <button
                          type="button"
                          onClick={() => onYetkiToggle?.(rol.kod, y.kod)}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
                            varMi
                              ? 'border-[var(--ap-accent)] bg-[var(--ap-accent)] text-white shadow-[0_3px_12px_color-mix(in_srgb,var(--ap-accent)_40%,transparent)]'
                              : 'border-[var(--ap-border)] text-[var(--ap-muted)] hover:bg-[var(--ap-hover)]'
                          }`}
                          title={varMi ? 'Yetkiyi kaldır' : 'Yetki ver'}
                          aria-pressed={varMi}
                        >
                          {varMi ? '✓' : '—'}
                        </button>
                      ) : varMi ? (
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ap-accent)] text-sm font-semibold text-white">
                          ✓
                        </span>
                      ) : (
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--ap-border)] text-[var(--ap-muted)]">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface RolKartlariProps {
  roller: RolTanimi[];
  seciliKod: string | null;
  duzenlenebilir?: boolean;
  onSec?: (rol: RolTanimi) => void;
  onDuzenle?: (rol: RolTanimi) => void;
}

export function RolKartlari({ roller, seciliKod, duzenlenebilir, onSec, onDuzenle }: RolKartlariProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {roller.map((rol) => {
        const secili = seciliKod === rol.kod;
        return (
          <div
            key={rol.kod}
            className={`relative rounded-lg border bg-slate-800 p-4 transition-colors ${
              secili
                ? 'border-violet-500 ring-2 ring-violet-500/35'
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <button
              type="button"
              onClick={() => onSec?.(rol)}
              disabled={!duzenlenebilir}
              className={`w-full text-left ${duzenlenebilir ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <h3 className="pr-8 font-semibold text-white">{rol.baslik}</h3>
              <p className="mt-1 text-xs text-slate-500">{rol.kod}</p>
              <p className="mt-2 text-sm text-slate-400">{rol.aciklama}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {rol.yetkiler.map((y) => (
                  <span
                    key={y}
                    className="rounded bg-slate-700 px-2 py-0.5 text-[10px] text-slate-300"
                  >
                    {YETKI_ETIKETLERI[y] ?? y.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </button>
            {duzenlenebilir && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuzenle?.(rol);
                }}
                className="absolute right-3 top-3 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
                title="Rolü düzenle"
                aria-label={`${rol.baslik} düzenle`}
              >
                ✏️
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
