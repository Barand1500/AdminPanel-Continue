import { useEffect } from 'react';
import type { AktifEklentiPublic } from '@/types/eklenti';
import { siteScriptParcalariEnjekteEt } from '@/utils/siteScriptEnjektor';

interface ZipEklentiScriptleriProps {
  aktifEklentiler: AktifEklentiPublic[];
}

export function ZipEklentiScriptleri({ aktifEklentiler }: ZipEklentiScriptleriProps) {
  const zipEklentiler = aktifEklentiler.filter((e) => e.kaynak === 'yukleme');

  useEffect(() => {
    const scriptParcalari = zipEklentiler.map((e) => {
      const ps = (e.manifestJson as { publicScripts?: Record<string, string> }).publicScripts ?? {};
      return {
        googleAnalytics: '',
        headerScript: ps.headerScript ?? '',
        bodyAcilisScript: ps.bodyAcilisScript ?? '',
        footerScript: ps.footerScript ?? '',
      };
    });

    const birlestir = {
      googleAnalytics: '',
      headerScript: scriptParcalari.map((s) => s.headerScript).filter(Boolean).join('\n'),
      bodyAcilisScript: scriptParcalari.map((s) => s.bodyAcilisScript).filter(Boolean).join('\n'),
      footerScript: scriptParcalari.map((s) => s.footerScript).filter(Boolean).join('\n'),
    };

    if (!birlestir.headerScript && !birlestir.bodyAcilisScript && !birlestir.footerScript) return;
    return siteScriptParcalariEnjekteEt(birlestir);
  }, [zipEklentiler]);

  return null;
}
