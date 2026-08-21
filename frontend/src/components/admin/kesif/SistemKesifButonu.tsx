import { useSistemKesif } from '@/contexts/SistemKesifContext';
import { IconSparkles } from '@tabler/icons-react';

export function SistemKesifButonu() {
  const { modalAc, turAktif } = useSistemKesif();

  return (
    <button
      type="button"
      className="ap-kesif-baslat-btn"
      onClick={modalAc}
      disabled={turAktif}
      data-ap-kesif="kesif-buton"
    >
      <span className="ap-kesif-baslat-parilti" aria-hidden="true" />
      <IconSparkles size={16} stroke={1.9} aria-hidden />
      Sistemi Keşfet
    </button>
  );
}
