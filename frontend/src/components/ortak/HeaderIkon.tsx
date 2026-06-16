import type { IkonSecimi } from '@/types/header';
import { HeaderPresetSvg, ozelIkonMu, varsayilanPresetId, type HeaderIkonGrubu } from '@/data/headerIkonPresets';

interface HeaderIkonProps {
  ikon: IkonSecimi;
  grup: HeaderIkonGrubu;
  className?: string;
}

export function HeaderIkon({ ikon, grup, className = 'h-5 w-5' }: HeaderIkonProps) {
  if (ozelIkonMu(ikon) && ikon.customUrl) {
    return <img src={ikon.customUrl} alt="" className={className} />;
  }

  const presetId = ikon.presetId ?? varsayilanPresetId(grup);
  return <HeaderPresetSvg presetId={presetId} className={className} />;
}
