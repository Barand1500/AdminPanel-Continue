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
  headerTipi: z
    .enum([
      'klasik',
      'sade',
      'kompakt',
      'merkez-logo',
      'arama-odakli',
      'modern',
      'kurumsal',
      'mega-menu',
      'seffaf-hero',
      'split',
    ])
    .optional(),
  tipEk: z
    .object({
      aramaGoster: z.boolean().optional(),
      aramaModu: z.enum(['tam', 'ikon']).optional(),
      kullaniciGoster: z.boolean().optional(),
      kompaktYukseklik: z.union([z.literal(40), z.literal(48), z.literal(56)]).optional(),
      ctaMetni: z.string().max(120).optional(),
      ctaLink: z.string().max(500).optional(),
      ikinciLogoUrl: z.string().nullable().optional(),
      ikinciMarkaMetni: z.string().nullable().optional(),
      destekMetni: z.string().max(300).optional(),
      megaMenuKolon: z.union([z.literal(3), z.literal(4), z.literal(5)]).optional(),
      seffafBaslangic: z.boolean().optional(),
      scrollSonrasiStil: z.enum(['beyaz', 'koyu', 'cam']).optional(),
      menuBolmeNoktasi: z.number().int().min(10).max(90).optional(),
    })
    .optional(),
  slogan: z.string().max(300).nullable().optional(),
  logoBoyutu: z.enum(['kucuk', 'orta', 'buyuk']).optional(),
  ustBant: z
    .object({
      telefonGoster: z.boolean(),
      emailGoster: z.boolean(),
      kurlarGoster: z.boolean(),
      sosyalGoster: z.boolean().optional(),
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
  dilDestegi: z
    .object({
      aktif: z.boolean(),
      gorunum: z.enum(['bayrak', 'kod']),
      varsayilanDil: z.string().min(2).max(8),
      diller: z.array(
        z.object({
          kod: z.string().min(2).max(8),
          ad: z.string().max(40),
          bayrak: z.string().max(8),
          aktif: z.boolean(),
          sira: z.number().int().min(0),
        })
      ),
      ceviriler: z.record(z.string(), z.record(z.string(), z.string())).optional(),
    })
    .optional(),
});

export type HeaderAyarlariDto = z.infer<typeof headerAyarlariSchema>;
export type ParaBirimiKaydiDto = z.infer<typeof paraBirimiKaydiSchema>;
