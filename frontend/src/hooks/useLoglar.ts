import { useCallback, useEffect, useState } from 'react';
import { adminLogApi, type AdminLogKayit } from '@/features/admin/adminSistemApi';

export function useLoglar() {
  const [loglar, setLoglar] = useState<AdminLogKayit[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  const yenile = useCallback(async () => {
    setYukleniyor(true);
    setHata(null);
    try {
      const veri = await adminLogApi.listele();
      setLoglar(veri);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Loglar yuklenemedi');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    yenile();
  }, [yenile]);

  const temizle = useCallback(async () => {
    await adminLogApi.temizle();
    await yenile();
  }, [yenile]);

  return { loglar, yukleniyor, hata, yenile, temizle };
}
