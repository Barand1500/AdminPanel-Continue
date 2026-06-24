import { z } from 'zod';

const konumTipiSchema = z.enum([
  'widget-sol',
  'widget-sag',
  'widget-ustu',
  'widget-alti',
  'header-ustu',
  'header-alti',
  'footer-ustu',
  'footer-alti',
]);

const bolgeSchema = z.enum([
  'sayfa_ustu',
  'sayfa_alti',
  'header',
  'footer',
  'header_alti',
  'slider_alti',
  'icerik_alani',
  'footer_ustu',
]);

export const konumluSliderConfigSchema = z.object({
  yon: z.enum(['yatay', 'dikey']).default('yatay'),
  yerlesim: z.object({
    tip: konumTipiSchema,
    bolge: bolgeSchema,
    hedefWidgetIds: z.array(z.string()).default([]),
  }),
  bosluk: z.enum(['kucuk', 'orta', 'buyuk']).optional(),
  gorunum: z
    .object({
      borderRadius: z.number().int().min(0).max(64).default(12),
      arkaplanTransparan: z.boolean().default(true),
      arkaplanRengi: z.string().max(32).optional(),
      zIndex: z.enum(['ust', 'alt']).default('alt'),
      gorselKirpma: z.enum(['kapla', 'sigdir', 'orijinal']).default('kapla'),
      butonGoster: z.boolean().default(false),
      butonKonumu: z
        .enum(['sol-alt', 'sag-alt', 'orta-alt', 'sol-ust', 'sag-ust', 'orta-ust'])
        .default('orta-alt'),
    })
    .default({}),
  slaytlar: z
    .array(
      z.object({
        id: z.string(),
        gorselUrl: z.string(),
        baslik: z.string().optional(),
        altBaslik: z.string().optional(),
        butonMetni: z.string().optional(),
        butonLink: z.string().optional(),
        sira: z.number().int().min(0).default(0),
        aktif: z.boolean().default(true),
      })
    )
    .default([]),
});

export const konumluSliderOlusturSchema = z.object({
  ad: z.string().min(1).max(120),
  sayfaId: z.union([z.string(), z.number()]).nullable().optional(),
  aktif: z.boolean().default(true),
  sira: z.number().int().min(0).default(0),
  configJson: konumluSliderConfigSchema,
});

export const konumluSliderGuncelleSchema = konumluSliderOlusturSchema.partial();

export type KonumluSliderOlusturDto = z.infer<typeof konumluSliderOlusturSchema>;
export type KonumluSliderGuncelleDto = z.infer<typeof konumluSliderGuncelleSchema>;
