import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type {
  AdminProfilGuncelleDto,
  AuthKullaniciDto,
  AuthYanitDto,
  GirisDto,
  KullaniciTercihleriDto,
  TercihlerGuncelleDto,
} from '../Application/DTOs/AuthDto.js';
import { config } from '../config/env.js';
import { KullaniciRepository } from '../Infrastructure/repositories/KullaniciRepository.js';
import type { Prisma } from '@prisma/client';
import { RolService } from './RolService.js';

const kullaniciRepo = new KullaniciRepository();
const rolService = new RolService();

export interface JwtPayload {
  kullaniciId: number;
  email: string;
  rol: string;
  siteId: number | null;
}

export class AuthService {
  async giris(dto: GirisDto): Promise<AuthYanitDto> {
    const kullanici = await kullaniciRepo.findByEmail(dto.email);

    if (!kullanici || !kullanici.aktif) {
      throw new Error('Gecersiz e-posta veya sifre');
    }

    if (kullanici.rol === 'MUSTERI') {
      throw new Error('Site uye girisi icin /api/auth/giris kullanin');
    }

    const sifreDogru = await bcrypt.compare(dto.sifre, kullanici.sifreHash);
    if (!sifreDogru) {
      throw new Error('Gecersiz e-posta veya sifre');
    }

    const payload: JwtPayload = {
      kullaniciId: kullanici.id,
      email: kullanici.email,
      rol: kullanici.rol,
      siteId: kullanici.siteId,
    };

    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
    });

    return {
      token,
      kullanici: await this.toDto(kullanici),
    };
  }

  async ben(kullaniciId: number): Promise<AuthKullaniciDto> {
    const kullanici = await kullaniciRepo.findById(kullaniciId);
    if (!kullanici || !kullanici.aktif) {
      throw new Error('Kullanici bulunamadi');
    }
    return this.toDto(kullanici);
  }

  async profilGuncelle(kullaniciId: number, dto: AdminProfilGuncelleDto): Promise<AuthKullaniciDto> {
    const mevcut = await kullaniciRepo.findById(kullaniciId);
    if (!mevcut || !mevcut.aktif || mevcut.rol === 'MUSTERI') {
      throw new Error('Kullanici bulunamadi');
    }

    const email = dto.email.toLowerCase().trim();
    if (email !== mevcut.email) {
      const epostaVar = await kullaniciRepo.findByEmail(email);
      if (epostaVar) throw new Error('Bu e-posta zaten kayitli');
    }

    const guncelleme: Parameters<KullaniciRepository['guncelle']>[1] = {
      ad: dto.ad.trim(),
      email,
    };

    if (dto.yeniSifre) {
      const dogru = await bcrypt.compare(dto.mevcutSifre ?? '', mevcut.sifreHash);
      if (!dogru) throw new Error('Mevcut sifre hatali');
      guncelleme.sifreHash = await bcrypt.hash(dto.yeniSifre, 10);
    }

    const guncel = await kullaniciRepo.guncelle(kullaniciId, guncelleme);
    return await this.toDto(guncel);
  }

  async tercihlerGuncelle(kullaniciId: number, dto: TercihlerGuncelleDto): Promise<AuthKullaniciDto> {
    const mevcut = await kullaniciRepo.findById(kullaniciId);
    if (!mevcut || !mevcut.aktif || mevcut.rol === 'MUSTERI') {
      throw new Error('Kullanici bulunamadi');
    }

    const onceki = this.tercihleriOku(mevcut.tercihlerJson);
    const guncel = await kullaniciRepo.guncelle(kullaniciId, {
      tercihlerJson: {
        ...onceki,
        dashboardHizliErisim: dto.dashboardHizliErisim,
      } as Prisma.InputJsonValue,
    });
    return await this.toDto(guncel);
  }

  tokenDogrula(token: string): JwtPayload {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  }

  private tercihleriOku(ham: unknown): KullaniciTercihleriDto {
    const varsayilan: KullaniciTercihleriDto = { dashboardHizliErisim: [] };
    if (!ham || typeof ham !== 'object') return varsayilan;
    const kayit = ham as Record<string, unknown>;
    const liste = kayit.dashboardHizliErisim;
    if (!Array.isArray(liste)) return varsayilan;
    return {
      dashboardHizliErisim: liste.filter((id): id is string => typeof id === 'string'),
    };
  }

  private async toDto(kullanici: {
    id: number;
    email: string;
    ad: string;
    rol: string;
    siteId: number | null;
    tercihlerJson?: unknown;
  }): Promise<AuthKullaniciDto> {
    const yetkiler = await rolService.kullaniciYetkileri({
      kullaniciId: kullanici.id,
      email: kullanici.email,
      rol: kullanici.rol,
      siteId: kullanici.siteId,
    });

    return {
      id: String(kullanici.id),
      email: kullanici.email,
      ad: kullanici.ad,
      rol: kullanici.rol,
      siteId: kullanici.siteId !== null ? String(kullanici.siteId) : null,
      tercihler: this.tercihleriOku(kullanici.tercihlerJson),
      yetkiler,
    };
  }
}
