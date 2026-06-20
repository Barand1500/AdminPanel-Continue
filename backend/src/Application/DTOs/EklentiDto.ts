import { z } from 'zod';

export const eklentiManifestSchema = z.object({
  kod: z.string().min(2).max(64).regex(/^[a-z0-9-]+$/),
  ad: z.string().min(2).max(120),
  surum: z.string().max(20),
  aciklama: z.string().max(2000).optional(),
  gelistirici: z.string().max(120).optional(),
  publicScripts: z
    .object({
      headerScript: z.string().max(50000).optional(),
      bodyAcilisScript: z.string().max(50000).optional(),
      footerScript: z.string().max(50000).optional(),
    })
    .optional(),
});

export type EklentiManifest = z.infer<typeof eklentiManifestSchema>;

export type EklentiDurum = 'kurulu' | 'aktif' | 'pasif';
export type EklentiKaynak = 'katalog' | 'yukleme';
