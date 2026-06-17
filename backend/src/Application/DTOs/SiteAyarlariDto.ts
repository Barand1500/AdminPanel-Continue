import { z } from 'zod';
import { bosVeyaEmail, bosVeyaMedyaUrl, esnekJson } from './ortakZod.js';

export const siteAyarlariGuncelleSchema = z.object({
  siteAd: z.string().min(1, 'Site adi zorunlu').max(120).optional(),
  logoUrl: bosVeyaMedyaUrl,
  faviconUrl: bosVeyaMedyaUrl,
  anaRenk: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Gecerli hex renk girin').optional(),
  ikincilRenk: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Gecerli hex renk girin').optional(),
  slogan: z.string().max(300).nullable().optional(),
  font: z.string().min(1).max(80).optional(),
  telefon: z.string().max(30).nullable().optional(),
  email: bosVeyaEmail,
  adres: z.string().max(500).nullable().optional(),
  whatsapp: z.string().max(30).nullable().optional(),
  telifYazisi: z.string().max(300).nullable().optional(),
  sosyalMedyaJson: z.record(z.string()).nullable().optional(),
  seoBaslik: z.string().max(120).nullable().optional(),
  seoAciklama: z.string().max(300).nullable().optional(),
  seoAnahtar: z.string().max(300).nullable().optional(),
  ogGorselUrl: bosVeyaMedyaUrl,
  headerAyarlariJson: esnekJson,
  heroJson: esnekJson,
  footerAyarlariJson: esnekJson,
  blogAyarlariJson: esnekJson,
  temaAyarlariJson: z
    .object({
      gunduzSablon: z.enum(['mor', 'mavi', 'yesil', 'ozel']).optional(),
      geceSablon: z.enum(['midnight', 'slate', 'carbon']).optional(),
    })
    .nullable()
    .optional(),
});

export type SiteAyarlariGuncelleDto = z.infer<typeof siteAyarlariGuncelleSchema>;
