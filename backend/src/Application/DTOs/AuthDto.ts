import { z } from 'zod';
import type { YetkiKodu } from './KullaniciDto.js';

export const girisSchema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
  sifre: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});

export const kayitSchema = z.object({
  ad: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta girin'),
  sifre: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  sifreTekrar: z.string().min(6, 'Şifre tekrarı en az 6 karakter olmalı'),
}).refine((v) => v.sifre === v.sifreTekrar, {
  message: 'Şifreler eşleşmiyor',
  path: ['sifreTekrar'],
});

export const profilGuncelleSchema = z.object({
  ad: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta girin'),
});

export const sifreDegistirSchema = z.object({
  mevcutSifre: z.string().min(6),
  yeniSifre: z.string().min(6, 'Yeni şifre en az 6 karakter olmalı'),
  yeniSifreTekrar: z.string().min(6),
}).refine((v) => v.yeniSifre === v.yeniSifreTekrar, {
  message: 'Yeni şifreler eşleşmiyor',
  path: ['yeniSifreTekrar'],
});

export const adminProfilGuncelleSchema = z
  .object({
    ad: z.string().min(2, 'Ad en az 2 karakter olmalı'),
    email: z.string().email('Geçerli bir e-posta girin'),
    mevcutSifre: z.string().min(6).optional(),
    yeniSifre: z.string().min(6, 'Yeni şifre en az 6 karakter olmalı').optional(),
  })
  .superRefine((v, ctx) => {
    if (v.yeniSifre && !v.mevcutSifre) {
      ctx.addIssue({
        code: 'custom',
        message: 'Şifre değiştirmek için mevcut şifrenizi girin',
        path: ['mevcutSifre'],
      });
    }
  });

export const tercihlerGuncelleSchema = z.object({
  dashboardHizliErisim: z.array(z.string()).min(1, 'En az bir modül seçin').max(16),
});

export type GirisDto = z.infer<typeof girisSchema>;
export type KayitDto = z.infer<typeof kayitSchema>;
export type ProfilGuncelleDto = z.infer<typeof profilGuncelleSchema>;
export type SifreDegistirDto = z.infer<typeof sifreDegistirSchema>;
export type AdminProfilGuncelleDto = z.infer<typeof adminProfilGuncelleSchema>;
export type TercihlerGuncelleDto = z.infer<typeof tercihlerGuncelleSchema>;

export interface KullaniciTercihleriDto {
  dashboardHizliErisim: string[];
}

export interface AuthKullaniciDto {
  id: string;
  email: string;
  ad: string;
  rol: string;
  siteId: string | null;
  tercihler: KullaniciTercihleriDto;
  yetkiler?: YetkiKodu[];
}

export interface AuthYanitDto {
  token: string;
  kullanici: AuthKullaniciDto;
}
