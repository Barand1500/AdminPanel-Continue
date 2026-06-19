import { adminHeaders, adminJsonFetch } from './adminFetch';
import type { KriptoPiyasaVeri } from '@/features/site/kriptoApi';

export async function kriptoOnizleGetir(limit = 10, symbols?: string[]): Promise<KriptoPiyasaVeri[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (symbols?.length) params.set('symbols', symbols.join(','));
  const json = await adminJsonFetch<{ liste: KriptoPiyasaVeri[] }>(`/kripto-onizle?${params}`, {
    headers: adminHeaders(),
  });
  return json.liste;
}
