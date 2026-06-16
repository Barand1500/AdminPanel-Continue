import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type {
  AuthKullaniciDto,
  AuthYanitDto,
  GirisDto,
  KayitDto,
  ProfilGuncelleDto,
  SifreDegistirDto,
} from '../Application/DTOs/AuthDto.js';
import { config } from '../config/env.js';
import { KullaniciRepository } from '../Infrastructure/repositories/KullaniciRepository.js';
import { SiteRepository } from '../Infrastructure/repositories/SiteRepository.js';
import type { JwtPayload } from './AuthService.js';

const kullaniciRepo = new KullaniciRepository();
const siteRepo = new SiteRepository();

const UYE_ROL = 'MUSTERI';

function toDto(kullanici: {
  id: number;
  email: string;
  ad: string;
  rol: string;
  siteId: number | null;
  tercihlerJson?: unknown;
}): AuthKullaniciDto {
  const tercihler =
    kullanici.tercihlerJson &&
    typeof kullanici.tercihlerJson === 'object' &&
    Array.isArray((kullanici.tercihlerJson as { dashboardHizliErisim?: unknown }).dashboardHizliErisim)
      ? {
          dashboardHizliErisim: (
            (kullanici.tercihlerJson as { dashboardHizliErisim: unknown[] }).dashboardHizliErisim
          ).filter((id): id is string => typeof id === 'string'),
        }
      : { dashboardHizliErisim: [] };

  return {
    id: String(kullanici.id),
    email: kullanici.email,
    ad: kullanici.ad,
    rol: kullanici.rol,
    siteId: kullanici.siteId !== null ? String(kullanici.siteId) : null,
    tercihler,
  };
}

function tokenOlustur(kullanici: { id: number; email: string; rol: string; siteId: number | null }) {
  const payload: JwtPayload = {
    kullaniciId: kullanici.id,
    email: kullanici.email,
    rol: kullanici.rol,
    siteId: kullanici.siteId,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
  });
}

export class SiteAuthService {
  async kayit(dto: KayitDto): Promise<AuthYanitDto> {
    const mevcut = await kullaniciRepo.findByEmail(dto.email);
    if (mevcut) throw new Error('Bu e-posta zaten kayıtlı');

    const site = await siteRepo.findBySlug(config.defaultSiteSlug);
    if (!site) throw new Error('Site bulunamadı');

    const sifreHash = await bcrypt.hash(dto.sifre, 10);
    const kullanici = await kullaniciRepo.olustur({
      email: dto.email.toLowerCase().trim(),
      ad: dto.ad.trim(),
      sifreHash,
      rol: UYE_ROL,
      siteId: site.id,
    });

    const token = tokenOlustur(kullanici);
    return { token, kullanici: toDto(kullanici) };
  }

  async giris(dto: GirisDto): Promise<AuthYanitDto> {
    const kullanici = await kullaniciRepo.findByEmail(dto.email.toLowerCase().trim());

    if (!kullanici || !kullanici.aktif) {
      throw new Error('Geçersiz e-posta veya şifre');
    }

    if (kullanici.rol !== UYE_ROL) {
      throw new Error('Bu hesap site üyeliği için uygun değil');
    }

    const sifreDogru = await bcrypt.compare(dto.sifre, kullanici.sifreHash);
    if (!sifreDogru) {
      throw new Error('Geçersiz e-posta veya şifre');
    }

    const token = tokenOlustur(kullanici);
    return { token, kullanici: toDto(kullanici) };
  }

  async ben(kullaniciId: number): Promise<AuthKullaniciDto> {
    const kullanici = await kullaniciRepo.findById(kullaniciId);
    if (!kullanici || !kullanici.aktif || kullanici.rol !== UYE_ROL) {
      throw new Error('Kullanıcı bulunamadı');
    }
    return toDto(kullanici);
  }

  async profilGuncelle(kullaniciId: number, dto: ProfilGuncelleDto): Promise<AuthKullaniciDto> {
    const mevcut = await kullaniciRepo.findById(kullaniciId);
    if (!mevcut || mevcut.rol !== UYE_ROL) throw new Error('Kullanıcı bulunamadı');

    const email = dto.email.toLowerCase().trim();
    if (email !== mevcut.email) {
      const epostaVar = await kullaniciRepo.findByEmail(email);
      if (epostaVar) throw new Error('Bu e-posta zaten kayıtlı');
    }

    const guncel = await kullaniciRepo.guncelle(kullaniciId, {
      ad: dto.ad.trim(),
      email,
    });
    return toDto(guncel);
  }

  async sifreDegistir(kullaniciId: number, dto: SifreDegistirDto): Promise<void> {
    const kullanici = await kullaniciRepo.findById(kullaniciId);
    if (!kullanici || kullanici.rol !== UYE_ROL) throw new Error('Kullanıcı bulunamadı');

    const dogru = await bcrypt.compare(dto.mevcutSifre, kullanici.sifreHash);
    if (!dogru) throw new Error('Mevcut şifre hatalı');

    const sifreHash = await bcrypt.hash(dto.yeniSifre, 10);
    await kullaniciRepo.guncelle(kullaniciId, { sifreHash });
  }
}
