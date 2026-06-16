import type { SiteAyarlari } from '@/types/site';
import type { SistemAyarlariJson } from '@/types/sistemAyarlari';
import { bosSistemForm } from '@/types/sistemAyarlari';

export function sistemAyarlariCoz(ayarlar: SiteAyarlari | null | undefined): SistemAyarlariJson {
  const json = (ayarlar as { sistemAyarlariJson?: unknown } | null | undefined)?.sistemAyarlariJson;
  if (!json || typeof json !== 'object') {
    return {
      bakimModu: false,
      bakimBaslik: bosSistemForm.bakimBaslik,
      bakimMesaji: bosSistemForm.bakimMesaji,
      bakimGorselUrl: '',
      bakimTahminiSure: '',
    };
  }
  const kayit = json as Record<string, unknown>;
  return {
    bakimModu: typeof kayit.bakimModu === 'boolean' ? kayit.bakimModu : false,
    bakimBaslik: typeof kayit.bakimBaslik === 'string' ? kayit.bakimBaslik : bosSistemForm.bakimBaslik,
    bakimMesaji: typeof kayit.bakimMesaji === 'string' ? kayit.bakimMesaji : bosSistemForm.bakimMesaji,
    bakimGorselUrl: typeof kayit.bakimGorselUrl === 'string' ? kayit.bakimGorselUrl : '',
    bakimTahminiSure: typeof kayit.bakimTahminiSure === 'string' ? kayit.bakimTahminiSure : '',
    sayfa404:
      kayit.sayfa404 && typeof kayit.sayfa404 === 'object'
        ? (kayit.sayfa404 as SistemAyarlariJson['sayfa404'])
        : undefined,
  };
}

export function bakimModuAktifMi(ayarlar: SiteAyarlari | null | undefined) {
  return sistemAyarlariCoz(ayarlar).bakimModu === true;
}
