import { useCallback, useEffect, useState } from 'react';
import type { SitePublicData } from '@/types/site';
import { bosSiteVerisi } from '@/data/bosSiteVerisi';
import { siteVerisiGetir } from '@/features/site/siteApi';
import { siteVerisiGuncellemeDinle } from '@/utils/siteVerisiOlaylari';

export function useSiteVerisi() {
  const [veri, setVeri] = useState<SitePublicData>(bosSiteVerisi);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [surum, setSurum] = useState(0);

  useEffect(() => siteVerisiGuncellemeDinle(() => setSurum((s) => s + 1)), []);

  const yenile = useCallback(async (signal?: AbortSignal) => {
    const sonuc = await siteVerisiGetir(signal);
    setVeri(sonuc);
    return sonuc;
  }, []);

  useEffect(() => {
    let iptal = false;
    const kontrol = new AbortController();
    const ilkYukleme = surum === 0;
    const zamanAsimi = ilkYukleme ? window.setTimeout(() => kontrol.abort(), 12000) : undefined;

    if (ilkYukleme) setYukleniyor(true);

    yenile(ilkYukleme ? kontrol.signal : undefined)
      .finally(() => {
        if (!iptal && ilkYukleme) setYukleniyor(false);
        if (zamanAsimi) window.clearTimeout(zamanAsimi);
      });

    return () => {
      iptal = true;
      kontrol.abort();
      if (zamanAsimi) window.clearTimeout(zamanAsimi);
    };
  }, [surum, yenile]);

  return { veri, yukleniyor, yenile };
}
