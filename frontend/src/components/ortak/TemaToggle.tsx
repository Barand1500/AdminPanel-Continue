import { useSiteTema } from '@/contexts/SiteTemaContext';
import type { HeaderTipEkAyarlari, TemaIkonlari } from '@/types/header';
import { HeaderIkon } from './HeaderIkon';

interface TemaToggleProps {
  tema?: TemaIkonlari;
  tipEk?: HeaderTipEkAyarlari | null;
}

export function TemaToggle({ tema, tipEk }: TemaToggleProps) {
  const { koyuMu, temaDegistir } = useSiteTema();

  if (tipEk?.temaGosterPc === false && tipEk?.temaGosterMobil === false) {
    return null;
  }

  const gunduz = tema?.gunduz ?? { tip: 'preset', presetId: 'gunduz-gunes' };
  const gece = tema?.gece ?? { tip: 'preset', presetId: 'gece-ay' };
  const sinif = [
    'tema-toggle',
    tipEk?.temaGosterPc === false ? 'tema-gizle-pc' : '',
    tipEk?.temaGosterMobil === false ? 'tema-gizle-mobil' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      onClick={temaDegistir}
      className={sinif}
      title={koyuMu ? 'Gündüz modu' : 'Gece modu'}
      aria-label={koyuMu ? 'Gündüz moduna geç' : 'Gece moduna geç'}
    >
      <HeaderIkon ikon={koyuMu ? gunduz : gece} grup={koyuMu ? 'gunduz' : 'gece'} />
    </button>
  );
}
