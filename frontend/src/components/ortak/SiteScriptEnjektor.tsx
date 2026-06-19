import { useEffect } from 'react';
import type { ScriptAyarlari } from '@/types/sistemAyarlari';
import { siteScriptParcalariEnjekteEt } from '@/utils/siteScriptEnjektor';

interface SiteScriptEnjektorProps {
  scriptAyarlari?: ScriptAyarlari;
}

export function SiteScriptEnjektor({ scriptAyarlari }: SiteScriptEnjektorProps) {
  useEffect(() => {
    if (!scriptAyarlari) return;
    return siteScriptParcalariEnjekteEt(scriptAyarlari);
  }, [scriptAyarlari]);

  return null;
}
