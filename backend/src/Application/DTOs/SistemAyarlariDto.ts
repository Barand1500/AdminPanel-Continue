import { z } from 'zod';

export const sayfa404AyarlariSchema = z.object({
  baslik: z.string().max(200).optional(),
  mesaj: z.string().max(500).optional(),
  gorselUrl: z.union([z.string().max(2000), z.literal('')]).optional(),
  menuTipi: z.enum(['ust', 'footer', 'her-ikisi', 'yok']).optional(),
  oneriSayfaId: z.union([z.string(), z.literal(''), z.null()]).optional(),
  anaSayfaButonu: z.boolean().optional(),
});

export const sagTikPanelAyarlariSchema = z.object({
  aktif: z.boolean().optional(),
  ogeler: z
    .array(
      z.object({
        id: z.string().max(32),
        aktif: z.boolean(),
      })
    )
    .max(32)
    .optional(),
  modulIdler: z.array(z.string().max(64)).max(40).optional(),
});

export const sistemAyarlariGuncelleSchema = z.object({
  siteAktif: z.boolean().optional(),
  domain: z.union([z.string().max(200), z.literal(''), z.null()]).optional(),
  bakimModu: z.boolean().optional(),
  bakimMesaji: z.string().max(500).optional(),
  bakimBaslik: z.string().max(200).optional(),
  bakimGorselUrl: z.union([z.string().max(2000), z.literal('')]).optional(),
  bakimTahminiSure: z.string().max(100).optional(),
  bakimIpBeyazListe: z.array(z.string().max(50)).max(20).optional(),
  logSaklamaGun: z.number().int().min(7).max(365).optional(),
  panelDili: z.string().min(2).max(10).optional(),
  panelCeviriler: z.record(z.string(), z.record(z.string(), z.string())).optional(),
  sayfa404: sayfa404AyarlariSchema.optional(),
  otomatikYedekleme: z.boolean().optional(),
  otomatikYedeklemeGun: z.number().int().min(1).max(30).optional(),
  guvenlikBasliklari: z.boolean().optional(),
  robotsEngelle: z.boolean().optional(),
  sagTikPaneli: sagTikPanelAyarlariSchema.optional(),
});

export type SistemAyarlariGuncelleDto = z.infer<typeof sistemAyarlariGuncelleSchema>;

export interface Sayfa404Ayarlari {
  baslik?: string;
  mesaj?: string;
  gorselUrl?: string;
  menuTipi?: 'ust' | 'footer' | 'her-ikisi' | 'yok';
  oneriSayfaId?: string | null;
  anaSayfaButonu?: boolean;
}

export interface SistemAyarlariJson {
  bakimModu?: boolean;
  bakimMesaji?: string;
  bakimBaslik?: string;
  bakimGorselUrl?: string;
  bakimTahminiSure?: string;
  bakimIpBeyazListe?: string[];
  logSaklamaGun?: number;
  panelDili?: string;
  panelCeviriler?: Record<string, Record<string, string>>;
  sayfa404?: Sayfa404Ayarlari;
  otomatikYedekleme?: boolean;
  otomatikYedeklemeGun?: number;
  guvenlikBasliklari?: boolean;
  robotsEngelle?: boolean;
  sagTikPaneli?: {
    aktif?: boolean;
    ogeler?: { id: string; aktif: boolean }[];
    modulIdler?: string[];
  };
}
