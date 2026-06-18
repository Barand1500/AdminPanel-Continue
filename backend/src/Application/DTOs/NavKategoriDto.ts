import { z } from 'zod';

export const navKategoriOlusturSchema = z.object({
  baslik: z.string().min(1).max(120),
  slug: z.string().max(120).optional(),
  yol: z.string().max(500).nullable().optional(),
  gorselUrl: z.string().max(500).nullable().optional(),
  ikon: z.string().max(80).nullable().optional(),
  aktif: z.boolean().default(true),
  sira: z.number().int().min(0).default(0),
  ustKategoriId: z.number().int().positive().nullable().optional(),
});

export const navKategoriGuncelleSchema = navKategoriOlusturSchema.partial();

export type NavKategoriOlusturDto = z.infer<typeof navKategoriOlusturSchema>;
export type NavKategoriGuncelleDto = z.infer<typeof navKategoriGuncelleSchema>;
