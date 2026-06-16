import { z } from 'zod';

export const seoGenelGuncelleSchema = z.object({
  seoBaslik: z.string().nullable().optional(),
  seoAciklama: z.string().nullable().optional(),
  seoAnahtar: z.string().nullable().optional(),
  ogGorselUrl: z.string().nullable().optional(),
});

export const seoSayfaGuncelleSchema = z.object({
  seoTitle: z.string().nullable().optional(),
  seoDesc: z.string().nullable().optional(),
});

export const seoUrunGuncelleSchema = z.object({
  seoTitle: z.string().nullable().optional(),
  seoDesc: z.string().nullable().optional(),
});

export const seoKategoriGuncelleSchema = seoSayfaGuncelleSchema;
export const seoMarkaGuncelleSchema = seoSayfaGuncelleSchema;
export const seoFirsatGuncelleSchema = seoSayfaGuncelleSchema;

export type SeoGenelGuncelleDto = z.infer<typeof seoGenelGuncelleSchema>;
export type SeoSayfaGuncelleDto = z.infer<typeof seoSayfaGuncelleSchema>;
export type SeoUrunGuncelleDto = z.infer<typeof seoUrunGuncelleSchema>;
export type SeoMetaGuncelleDto = z.infer<typeof seoSayfaGuncelleSchema>;
