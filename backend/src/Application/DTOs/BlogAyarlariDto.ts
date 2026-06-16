import { z } from 'zod';

export const blogAyarlariSchema = z.object({
  headerMenu: z.boolean(),
  anaSayfa: z.boolean(),
  anaSayfaKonum: z.enum(['urunler-ustu', 'widgetlar-ustu', 'widgetlar-alti']),
  hizmetlerAlani: z.boolean(),
  listeAdet: z.number().int().min(2).max(12),
});

export type BlogAyarlariDto = z.infer<typeof blogAyarlariSchema>;
