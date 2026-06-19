import { z } from 'zod';

/** schema.prisma WidgetTipi ile senkron tutulmalı */
export const WIDGET_TIPLERI = [
  'HEADER',
  'NAVBAR',
  'SLIDER',
  'HERO_BANNER',
  'HIZMET_KARTLARI',
  'KATEGORI',
  'REFERANSLAR',
  'SSS',
  'GALERI',
  'HARITA',
  'ILETISIM_FORMU',
  'POPUP',
  'FOOTER',
  'BASLIK_METIN',
  'BASLIK_METIN_GORSEL',
  'BLOG_KARUSEL',
  'LINK_KARTLARI',
  'GORSEL_GRID_BLOK',
  'GORSEL_ETIKET_KARTLARI',
  'EKIP_KARUSEL',
  'SAYAC_BLOK',
  'YORUM_KARUSEL',
  'FIYATLANDIRMA',
  'ZAMAN_CIZELGESI',
  'SUREC_ADIMLARI',
  'MARKA_SERIDI',
  'KARSILASTIRMA_TABLOSU',
  'GERI_SAYIM',
  'VIDEO_BANNER',
  'ONCESI_SONRASI',
  'BULTEN_KAYIT',
  'KOSE_YAZARLARI',
  'ILETISIM_BLOK',
  'KATEGORI_HABER_LISTESI',
  'KATEGORI_HABER_OVERLAY',
  'VIDEO_GALERISI',
  'SEKMELI_HABER',
  'HAVA_DURUMU',
  'KRIPTO_LISTESI',
  'GUNCEL_KONULAR',
  'SIRKET_GIRIS_CIKIS',
  'HABER_MAGAZIN',
] as const;

export type WidgetTip = (typeof WIDGET_TIPLERI)[number];

export const widgetTipleri = [...WIDGET_TIPLERI];

export const deprecatedWidgetTipleri: WidgetTip[] = [
  'HEADER',
  'NAVBAR',
  'FOOTER',
];

const bosMetin = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v) => {
    if (v == null) return null;
    const t = v.trim();
    return t.length > 0 ? t : null;
  });

const baseWidgetSchema = z.object({
  ad: z
    .string()
    .trim()
    .min(1, 'Widget adi gerekli')
    .transform((v) => (v.length < 2 ? `${v} Widget` : v)),
  tip: z.enum(WIDGET_TIPLERI, { message: 'Gecersiz widget tipi' }),
  sayfaId: z.string().optional().nullable(),
  sira: z.coerce.number().int().min(0).default(0),
  aktif: z.coerce.boolean().default(true),
  baslik: bosMetin,
  altBaslik: bosMetin,
  aciklama: bosMetin,
  gorselUrl: bosMetin,
  butonMetni: bosMetin,
  butonLink: bosMetin,
  arkaPlanRenk: bosMetin,
  yaziRenk: bosMetin,
  mobilGoster: z.coerce.boolean().default(true),
  masaustuGoster: z.coerce.boolean().default(true),
  configJson: z.record(z.unknown()).optional().nullable(),
});

export const widgetOlusturSchema = baseWidgetSchema;
export const widgetGuncelleSchema = baseWidgetSchema.partial();

export type WidgetOlusturDto = z.infer<typeof widgetOlusturSchema>;
export type WidgetGuncelleDto = z.infer<typeof widgetGuncelleSchema>;
