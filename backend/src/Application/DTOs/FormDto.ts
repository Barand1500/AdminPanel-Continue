import { z } from 'zod';

const formKosulSchema = z.object({
  alanId: z.string(),
  operator: z.enum(['esit', 'farkli', 'dolu', 'bos', 'icerir']),
  deger: z.string().optional(),
});

const formAlanSchema = z.object({
  id: z.string(),
  tip: z.enum(['text', 'email', 'tel', 'textarea', 'select', 'checkbox', 'radio', 'number', 'date', 'file']),
  etiket: z.string().min(1),
  zorunlu: z.boolean().default(false),
  placeholder: z.string().optional(),
  secenekler: z.array(z.string()).optional(),
  yardimMetni: z.string().optional(),
  varsayilan: z.string().optional(),
  genislik: z.enum(['tam', 'yarim']).optional(),
  kosullar: z.array(formKosulSchema).optional(),
  kosulMantigi: z.enum(['ve', 'veya']).optional(),
});

const formAyarlarSchema = z
  .object({
    gorunumTipi: z
      .enum(['inline', 'modal', 'yan-panel', 'sabit-alt', 'sayfa-ici', 'yuzucu'])
      .optional()
      .transform((v) => {
        if (!v || v === 'sayfa-ici') return 'inline';
        if (v === 'yuzucu' || v === 'sabit-alt') return 'modal';
        return v;
      }),
    tumSayfalarda: z.boolean().optional(),
    sayfaSluglari: z.array(z.string()).optional(),
    sayfaKonumu: z.enum(['icerik-basi', 'icerik-sonu', 'sidebar', 'footer-ustu', 'hero-alti']).optional(),
    genislik: z.enum(['tam', 'orta', 'dar']).optional(),
    baslikGoster: z.boolean().optional(),
    aciklamaGoster: z.boolean().optional(),
    gonderButonMetni: z.string().optional(),
    epostaZorunlu: z.boolean().optional(),
    telefonZorunlu: z.boolean().optional(),
    adSoyadZorunlu: z.boolean().optional(),
    kvkkOnayZorunlu: z.boolean().optional(),
    kvkkMetni: z.string().optional(),
    captchaAktif: z.boolean().optional(),
    tekGonderimLimiti: z.enum(['yok', 'saat', 'gun']).optional(),
    basariMesaji: z.string().optional(),
    yonlendirmeUrl: z.string().optional(),
    kullaniciyaOtomatikYanit: z.boolean().optional(),
    otomatikYanitKonu: z.string().optional(),
    otomatikYanitMetin: z.string().optional(),
    arkaPlanRenk: z.string().optional(),
    butonRenk: z.string().optional(),
    bildirimGoster: z.boolean().optional(),
  })
  .optional();

export const formOlusturSchema = z.object({
  ad: z.string().min(1),
  slug: z.string().optional(),
  aciklama: z.string().nullable().optional(),
  alanlarJson: z.array(formAlanSchema).default([]),
  ayarlarJson: formAyarlarSchema,
  aktif: z.boolean().default(true),
  bildirimEmail: z.union([z.string().email(), z.literal(''), z.null()]).optional(),
});

export const formGuncelleSchema = formOlusturSchema.partial();

export type FormOlusturDto = z.infer<typeof formOlusturSchema>;
export type FormGuncelleDto = z.infer<typeof formGuncelleSchema>;
