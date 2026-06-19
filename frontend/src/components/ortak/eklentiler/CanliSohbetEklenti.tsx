import { useEffect } from 'react';
import type { AktifEklentiPublic } from '@/types/eklenti';
import { siteScriptParcalariEnjekteEt } from '@/utils/siteScriptEnjektor';

interface CanliSohbetEklentiProps {
  eklenti: AktifEklentiPublic;
}

export function CanliSohbetEklenti({ eklenti }: CanliSohbetEklentiProps) {
  useEffect(() => {
    const manifest = eklenti.manifestJson as { publicScripts?: Record<string, string> };
    const ayarlar = eklenti.ayarlarJson as { chatScript?: string };
    const footerScript = ayarlar.chatScript || manifest.publicScripts?.footerScript || '';
    if (!footerScript.trim()) return;
    return siteScriptParcalariEnjekteEt({
      googleAnalytics: '',
      headerScript: manifest.publicScripts?.headerScript ?? '',
      bodyAcilisScript: manifest.publicScripts?.bodyAcilisScript ?? '',
      footerScript,
    });
  }, [eklenti]);

  return null;
}
