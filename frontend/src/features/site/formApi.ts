const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const SITE_SLUG = import.meta.env.VITE_SITE_SLUG ?? 'demo';

export async function publicFormGonder(formSlug: string, veri: Record<string, unknown>): Promise<void> {
  const yanit = await fetch(`${API_URL}/formlar/${encodeURIComponent(formSlug)}/gonder?site=${SITE_SLUG}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ veri }),
  });
  const json = await yanit.json();
  if (!yanit.ok) throw new Error(json.mesaj ?? 'Form gonderilemedi');
}
