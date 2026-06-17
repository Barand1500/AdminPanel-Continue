import { z } from 'zod';

export const footerLinkSchema = z.object({
  id: z.string().min(1),
  ad: z.string().min(1).max(120),
  link: z.string().max(500),
  yeniSekme: z.boolean(),
  aktif: z.boolean(),
  sira: z.number().int().min(0),
});

export const footerKolonSchema = z.object({
  id: z.string().min(1),
  baslik: z.string().min(1).max(80),
  aktif: z.boolean(),
  sira: z.number().int().min(0),
  linkler: z.array(footerLinkSchema),
});

export const footerPazaryeriOgesiSchema = z.object({
  id: z.string().min(1),
  ad: z.string().min(1).max(80),
  link: z.string().max(500),
  aktif: z.boolean(),
  sira: z.number().int().min(0),
});

export const footerRozetSchema = z.object({
  id: z.string().min(1),
  ikon: z.string().max(8),
  metin: z.string().min(1).max(120),
  aktif: z.boolean(),
  sira: z.number().int().min(0),
});

export const footerYuzucuButonSchema = z.object({
  id: z.string().min(1),
  tip: z.enum(['telefon', 'whatsapp', 'yukari', 'link']),
  baslik: z.string().max(80),
  link: z.string().max(500),
  ikon: z.string().max(8),
  aktif: z.boolean(),
  sira: z.number().int().min(0),
});

const eskiYuzucuButonlarSchema = z.object({
  aktif: z.boolean(),
  telefon: z.boolean().optional(),
  whatsapp: z.boolean().optional(),
  yukari: z.boolean().optional(),
  ogeler: z.array(footerYuzucuButonSchema).optional(),
});

export const footerAyarlariSchema = z.object({
  sema: z.enum(['dort-kolon', 'uc-kolon', 'iki-kolon', 'merkezi']),
  linkIkon: z.enum(['chevron', 'ok', 'bullet', 'yok']),
  marka: z.object({
    logoGoster: z.boolean(),
    logoBoyutu: z.enum(['kucuk', 'orta', 'buyuk']).optional(),
    sosyalGoster: z.boolean(),
    bankaLinki: z.object({
      aktif: z.boolean(),
      ad: z.string().max(80),
      link: z.string().max(500),
      ikon: z.string().max(8),
    }),
    iletisimIkonlari: z.object({
      adres: z.string().max(8),
      email: z.string().max(8),
      telefon: z.string().max(8),
      whatsapp: z.string().max(8),
    }),
  }),
  kolonlar: z.array(footerKolonSchema),
  pazaryeri: z.object({
    aktif: z.boolean(),
    ogeler: z.array(footerPazaryeriOgesiSchema),
  }),
  guvenBandi: z.object({
    aktif: z.boolean(),
    rozetler: z.array(footerRozetSchema),
    kurlarGoster: z.boolean(),
  }),
  yuzucuButonlar: eskiYuzucuButonlarSchema,
});

export type FooterAyarlariDto = z.infer<typeof footerAyarlariSchema>;
