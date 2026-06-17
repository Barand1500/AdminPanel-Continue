import { z } from 'zod';

export const ikonSecimiSchema = z.object({
  tip: z.enum(['preset', 'custom']),
  presetId: z.string().optional(),
  customUrl: z.string().optional(),
});

export const paraBirimiKaydiSchema = z.object({
  id: z.string().min(1),
  ad: z.string().min(1).max(80),
  kod: z.string().min(2).max(6),
  sembol: z.string().min(1).max(8),
  kaynak: z.enum(['manuel', 'tcmb']),
  kurTipi: z.enum(['doviz_alis', 'doviz_satis', 'efektif_alis', 'efektif_satis']).optional(),
  manuelKur: z.number().positive().optional(),
  guncelKur: z.number().positive().optional(),
  sira: z.number().int().min(0),
  sabit: z.boolean().optional(),
});

export const ustMenuOgesiSchema = z.object({
  id: z.string().min(1),
  ad: z.string().min(1).max(120),
  link: z.string().min(1).max(500),
  yeniSekme: z.boolean(),
  sira: z.number().int().min(0),
  sayfaId: z.string().optional(),
});

export const headerAyarlariSchema = z.object({
  slogan: z.string().max(300).nullable().optional(),
  logoBoyutu: z.enum(['kucuk', 'orta', 'buyuk']).optional(),
  ustBant: z
    .object({
      telefonGoster: z.boolean(),
      emailGoster: z.boolean(),
      kurlarGoster: z.boolean(),
    })
    .optional(),
  kurlar: z.array(paraBirimiKaydiSchema).optional(),
  ikonlar: z
    .object({
      tema: z.object({
        gunduz: ikonSecimiSchema,
        gece: ikonSecimiSchema,
      }),
      hesap: ikonSecimiSchema,
      favori: ikonSecimiSchema,
      sepet: ikonSecimiSchema.extend({ badgeGoster: z.boolean() }),
    })
    .optional(),
  kategori: z
    .object({
      acilisModu: z.enum(['dropdown', 'sidebar', 'liste']),
      baslikMetni: z.string().max(80),
    })
    .optional(),
  arama: z
    .object({
      placeholder: z.string().max(120),
      stil: z.enum(['yuvarlak', 'kare', 'minimal']),
      ikon: ikonSecimiSchema,
    })
    .optional(),
  sonKurGuncelleme: z.string().nullable().optional(),
  ustMenu: z.array(ustMenuOgesiSchema).optional(),
});

export type HeaderAyarlariDto = z.infer<typeof headerAyarlariSchema>;
export type ParaBirimiKaydiDto = z.infer<typeof paraBirimiKaydiSchema>;
