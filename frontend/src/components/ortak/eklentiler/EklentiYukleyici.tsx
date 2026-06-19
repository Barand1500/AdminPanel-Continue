import type { AktifEklentiPublic } from '@/types/eklenti';
import { eklentiAktifMi } from '@/hooks/useAktifEklentiler';
import { CerezBannerEklenti } from './CerezBannerEklenti';
import { CanliSohbetEklenti } from './CanliSohbetEklenti';
import { YukariCikEklenti } from './YukariCikEklenti';
import { ZipEklentiScriptleri } from './ZipEklentiScriptleri';

interface EklentiYukleyiciProps {
  aktifEklentiler: AktifEklentiPublic[];
}

export function EklentiYukleyici({ aktifEklentiler }: EklentiYukleyiciProps) {
  return (
    <>
      {eklentiAktifMi(aktifEklentiler, 'cerez-banner') && <CerezBannerEklenti />}
      {eklentiAktifMi(aktifEklentiler, 'yukari-cik') && <YukariCikEklenti />}
      {aktifEklentiler
        .filter((e) => e.kod === 'canli-sohbet')
        .map((e) => (
          <CanliSohbetEklenti key={e.kod} eklenti={e} />
        ))}
      <ZipEklentiScriptleri aktifEklentiler={aktifEklentiler} />
    </>
  );
}
