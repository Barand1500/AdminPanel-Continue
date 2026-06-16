import { WidgetTipi } from '@prisma/client';
import { z } from 'zod';

export const widgetTipleri = Object.values(WidgetTipi);

export const deprecatedWidgetTipleri: WidgetTipi[] = [
  WidgetTipi.HEADER,
  WidgetTipi.NAVBAR,
  WidgetTipi.FOOTER,
];

const baseWidgetSchema = z.object({
  ad: z.string().min(2, 'Widget adi en az 2 karakter olmali'),
  tip: z.nativeEnum(WidgetTipi),
  sayfaId: z.string().optional().nullable(),
  sira: z.number().int().min(0).default(0),
  aktif: z.boolean().default(true),
  baslik: z.string().optional().nullable(),
  altBaslik: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
  gorselUrl: z.string().optional().nullable(),
  butonMetni: z.string().optional().nullable(),
  butonLink: z.string().optional().nullable(),
  arkaPlanRenk: z.string().optional().nullable(),
  yaziRenk: z.string().optional().nullable(),
  mobilGoster: z.boolean().default(true),
  masaustuGoster: z.boolean().default(true),
  configJson: z.record(z.any()).optional().nullable(),
});

export const widgetOlusturSchema = baseWidgetSchema;
export const widgetGuncelleSchema = baseWidgetSchema.partial();

export type WidgetOlusturDto = z.infer<typeof widgetOlusturSchema>;
export type WidgetGuncelleDto = z.infer<typeof widgetGuncelleSchema>;
