import { useSiteTema } from '@/contexts/SiteTemaContext';
import type { TemaIkonlari } from '@/types/header';
import { HeaderIkon } from './HeaderIkon';

interface TemaToggleProps {
  tema?: TemaIkonlari;
}

export function TemaToggle({ tema }: TemaToggleProps) {
  const { koyuMu, temaDegistir } = useSiteTema();

  const gunduz = tema?.gunduz ?? { tip: 'preset', presetId: 'gunduz-gunes' };
  const gece = tema?.gece ?? { tip: 'preset', presetId: 'gece-ay' };

  return (
    <button
      type="button"
      onClick={temaDegistir}
      className="tema-toggle"
      title={koyuMu ? 'Gündüz modu' : 'Gece modu'}
      aria-label={koyuMu ? 'Gündüz moduna geç' : 'Gece moduna geç'}
    >
      <HeaderIkon ikon={koyuMu ? gunduz : gece} grup={koyuMu ? 'gunduz' : 'gece'} />
    </button>
  );
}
