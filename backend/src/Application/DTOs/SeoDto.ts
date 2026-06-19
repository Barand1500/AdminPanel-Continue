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

export const seoTopluKayitSchema = z.object({
  tip: z.enum(['sayfa', 'kategori', 'marka', 'firsat', 'urun']),
  id: z.union([z.string(), z.number()]),
  seoTitle: z.string().nullable().optional(),
  seoDesc: z.string().nullable().optional(),
});

export const seoYonlendirmeKayitSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  hedefTip: z.enum(['sayfa', 'kategori', 'marka', 'firsat', 'urun']),
  hedefId: z.union([z.string(), z.number()]),
  kaynakUrl: z.string().min(1).max(500),
  seoTitle: z.string().nullable().optional(),
  seoDesc: z.string().nullable().optional(),
  kod: z.number().int().optional(),
  sil: z.boolean().optional(),
});

export const seoTopluKaydetSchema = z.object({
  kayitlar: z.array(seoTopluKayitSchema).default([]),
  yonlendirmeler: z.array(seoYonlendirmeKayitSchema).default([]),
});

export type SeoGenelGuncelleDto = z.infer<typeof seoGenelGuncelleSchema>;
export type SeoSayfaGuncelleDto = z.infer<typeof seoSayfaGuncelleSchema>;
export type SeoUrunGuncelleDto = z.infer<typeof seoUrunGuncelleSchema>;
export type SeoMetaGuncelleDto = z.infer<typeof seoSayfaGuncelleSchema>;
export type SeoTopluKaydetDto = z.infer<typeof seoTopluKaydetSchema>;
