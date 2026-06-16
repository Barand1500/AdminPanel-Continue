import { z } from 'zod';

export const kisayolOlusturSchema = z.object({
  ad: z.string().min(1).max(120),
  kod: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-_.]+$/i)
    .optional(),
  tusKombinasyonu: z.string().min(1).max(60),
  deger: z.union([z.string().max(500), z.literal(''), z.null()]).optional(),
  aciklama: z.union([z.string().max(2000), z.literal(''), z.null()]).optional(),
  kategori: z.union([z.string().max(80), z.literal(''), z.null()]).optional(),
  sira: z.number().int().min(0).max(9999).optional(),
  aktif: z.boolean().optional(),
  ekAyarlarJson: z.record(z.string(), z.unknown()).optional(),
});

export const kisayolGuncelleSchema = kisayolOlusturSchema.partial();

export type KisayolOlusturDto = z.infer<typeof kisayolOlusturSchema>;
export type KisayolGuncelleDto = z.infer<typeof kisayolGuncelleSchema>;
