import type { AktifEklentiPublic } from '@/types/eklenti';
import { eklentiAktifMi } from '@/hooks/useAktifEklentiler';
import { CerezBannerEklenti } from './CerezBannerEklenti';
import { CanliSohbetEklenti } from './CanliSohbetEklenti';
import { YukariCikEklenti } from './YukariCikEklenti';
import { OkumaCubuguEklenti } from './OkumaCubuguEklenti';
import { DuyuruSeridiEklenti } from './DuyuruSeridiEklenti';
import { SosyalPaylasEklenti } from './SosyalPaylasEklenti';
import { YaziBuyutucuEklenti } from './YaziBuyutucuEklenti';
import { ZipEklentiScriptleri } from './ZipEklentiScriptleri';

interface EklentiYukleyiciProps {
  aktifEklentiler: AktifEklentiPublic[];
}

export function EklentiYukleyici({ aktifEklentiler }: EklentiYukleyiciProps) {
  return (
    <>
      {eklentiAktifMi(aktifEklentiler, 'duyuru-seridi') &&
        aktifEklentiler
          .filter((e) => e.kod === 'duyuru-seridi')
          .map((e) => <DuyuruSeridiEklenti key={e.kod} eklenti={e} />)}
      {eklentiAktifMi(aktifEklentiler, 'okuma-cubugu') && <OkumaCubuguEklenti />}
      {eklentiAktifMi(aktifEklentiler, 'cerez-banner') && <CerezBannerEklenti />}
      {eklentiAktifMi(aktifEklentiler, 'yazi-buyutucu') && <YaziBuyutucuEklenti />}
      {eklentiAktifMi(aktifEklentiler, 'sosyal-paylas') && <SosyalPaylasEklenti />}
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
