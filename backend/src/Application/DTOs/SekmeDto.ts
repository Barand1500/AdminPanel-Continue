import { z } from 'zod';

export const sekmeOlusturSchema = z.object({
  ad: z.string().min(1).max(120),
  kod: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-_.]+$/i)
    .optional(),
  tip: z.string().min(1).max(50).optional(),
  yol: z.string().min(1).max(300),
  ikon: z.union([z.string().max(120), z.literal(''), z.null()]).optional(),
  aciklama: z.union([z.string().max(2000), z.literal(''), z.null()]).optional(),
  kategori: z.union([z.string().max(80), z.literal(''), z.null()]).optional(),
  hedef: z.union([z.literal('_self'), z.literal('_blank'), z.literal(''), z.null()]).optional(),
  sira: z.number().int().min(0).max(9999).optional(),
  aktif: z.boolean().optional(),
  sabit: z.boolean().optional(),
  kisayolId: z.union([z.string(), z.literal(''), z.null()]).optional(),
  ekAyarlarJson: z.record(z.string(), z.unknown()).optional(),
});

export const sekmeGuncelleSchema = sekmeOlusturSchema.partial();

export type SekmeOlusturDto = z.infer<typeof sekmeOlusturSchema>;
export type SekmeGuncelleDto = z.infer<typeof sekmeGuncelleSchema>;
