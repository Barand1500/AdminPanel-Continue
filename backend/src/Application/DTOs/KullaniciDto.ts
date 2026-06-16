import { z } from 'zod';

export const ROLLER = [
  'SUPER_ADMIN',
  'AJANS_ADMIN',
  'MUSTERI_ADMIN',
  'EDITOR',
  'SEO_EDITOR',
  'GORUNTULEME',
] as const;

export const SISTEM_ROLLER = [...ROLLER] as const;

export type RolKodu = (typeof ROLLER)[number];

export const YETKILER = [
  'goruntuleme',
  'ekleme',
  'duzenleme',
  'silme',
  'yayinlama',
  'dosya_yukleme',
  'seo_duzenleme',
  'tema_duzenleme',
  'kullanici_yonetimi',
] as const;

export type YetkiKodu = (typeof YETKILER)[number];

export const ROL_TANIMLARI: Record<
  RolKodu,
  { baslik: string; aciklama: string; yetkiler: YetkiKodu[] }
> = {
  SUPER_ADMIN: {
    baslik: 'Super Admin',
    aciklama: 'Tum siteler ve sistem ayarlari uzerinde tam yetki.',
    yetkiler: [...YETKILER],
  },
  AJANS_ADMIN: {
    baslik: 'Ajans Admin',
    aciklama: 'Birden fazla musteri sitesini yonetir, kullanici atayabilir.',
    yetkiler: [
      'goruntuleme',
      'ekleme',
      'duzenleme',
      'silme',
      'yayinlama',
      'dosya_yukleme',
      'seo_duzenleme',
      'tema_duzenleme',
      'kullanici_yonetimi',
    ],
  },
  MUSTERI_ADMIN: {
    baslik: 'Musteri Admin',
    aciklama: 'Kendi sitesinin tum icerigini yonetir.',
    yetkiler: [
      'goruntuleme',
      'ekleme',
      'duzenleme',
      'silme',
      'yayinlama',
      'dosya_yukleme',
      'seo_duzenleme',
      'tema_duzenleme',
    ],
  },
  EDITOR: {
    baslik: 'Editor',
    aciklama: 'Sayfa, blog ve medya icerigi duzenler.',
    yetkiler: ['goruntuleme', 'ekleme', 'duzenleme', 'dosya_yukleme'],
  },
  SEO_EDITOR: {
    baslik: 'SEO Editoru',
    aciklama: 'SEO alanlarini ve meta bilgilerini duzenler.',
    yetkiler: ['goruntuleme', 'duzenleme', 'seo_duzenleme'],
  },
  GORUNTULEME: {
    baslik: 'Sadece Goruntuleme',
    aciklama: 'Salt okunur erisim, degisiklik yapamaz.',
    yetkiler: ['goruntuleme'],
  },
};

export const YETKI_ETIKETLERI: Record<YetkiKodu, string> = {
  goruntuleme: 'Goruntuleme',
  ekleme: 'Ekleme',
  duzenleme: 'Duzenleme',
  silme: 'Silme',
  yayinlama: 'Yayinlama',
  dosya_yukleme: 'Dosya Yukleme',
  seo_duzenleme: 'SEO Duzenleme',
  tema_duzenleme: 'Tema Duzenleme',
  kullanici_yonetimi: 'Kullanici Yonetimi',
};

const rolSchema = z.string().min(1);

export const kullaniciOlusturSchema = z.object({
  email: z.string().email(),
  ad: z.string().min(1),
  sifre: z.string().min(6),
  rol: rolSchema.default('MUSTERI_ADMIN'),
  siteId: z.string().nullable().optional(),
  aktif: z.boolean().default(true),
});

export const kullaniciGuncelleSchema = z.object({
  email: z.string().email().optional(),
  ad: z.string().min(1).optional(),
  sifre: z.string().min(6).optional(),
  rol: rolSchema.optional(),
  siteId: z.string().nullable().optional(),
  aktif: z.boolean().optional(),
});

export type KullaniciOlusturDto = z.infer<typeof kullaniciOlusturSchema>;
export type KullaniciGuncelleDto = z.infer<typeof kullaniciGuncelleSchema>;
