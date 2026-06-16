import { z } from 'zod';

export const sayfaOlusturSchema = z.object({
  baslik: z.string().min(1),
  slug: z.string().optional(),
  icerik: z.string().default(''),
  kapakGorsel: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDesc: z.string().nullable().optional(),
  yayinda: z.boolean().default(false),
  menudeGoster: z.boolean().default(true),
  sira: z.number().int().default(0),
});

export const sayfaGuncelleSchema = sayfaOlusturSchema.partial();

export const menuGuncelleSchema = z.object({
  ogeler: z.array(
    z.object({
      id: z.string(),
      sira: z.number().int(),
      menudeGoster: z.boolean(),
    })
  ),
});

export type SayfaOlusturDto = z.infer<typeof sayfaOlusturSchema>;
export type SayfaGuncelleDto = z.infer<typeof sayfaGuncelleSchema>;
export type MenuGuncelleDto = z.infer<typeof menuGuncelleSchema>;
