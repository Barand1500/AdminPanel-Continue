import { z } from 'zod';

export const blogOlusturSchema = z.object({
  baslik: z.string().min(1),
  slug: z.string().optional(),
  ozet: z.string().nullable().optional(),
  icerik: z.string().default(''),
  kapakGorsel: z.string().nullable().optional(),
  yazar: z.string().nullable().optional(),
  kategori: z.string().nullable().optional(),
  yayinda: z.boolean().default(false),
  oneCikan: z.boolean().default(false),
  seoTitle: z.string().nullable().optional(),
  seoDesc: z.string().nullable().optional(),
});

export const blogGuncelleSchema = blogOlusturSchema.partial();

export type BlogOlusturDto = z.infer<typeof blogOlusturSchema>;
export type BlogGuncelleDto = z.infer<typeof blogGuncelleSchema>;
