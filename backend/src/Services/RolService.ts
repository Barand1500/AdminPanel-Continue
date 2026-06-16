import type { Prisma } from '@prisma/client';
import type { RolKaydetDto, RolTanimiDto } from '../Application/DTOs/RolAyarlariDto.js';
import {
  ROL_TANIMLARI,
  SISTEM_ROLLER,
  YETKILER,
  type RolKodu,
  type YetkiKodu,
} from '../Application/DTOs/KullaniciDto.js';
import { KullaniciRepository } from '../Infrastructure/repositories/KullaniciRepository.js';
import { SiteAyarlariRepository } from '../Infrastructure/repositories/SiteAyarlariRepository.js';
import { cozulenSiteIdFromKullanici } from '../Infrastructure/utils/siteIdCoz.js';
import type { JwtPayload } from './AuthService.js';

const ayarlarRepo = new SiteAyarlariRepository();
const kullaniciRepo = new KullaniciRepository();

const AJANS_ATAYAMAZ: RolKodu[] = ['SUPER_ADMIN', 'AJANS_ADMIN'];

function varsayilanRoller(): RolTanimiDto[] {
  return SISTEM_ROLLER.map((kod) => {
    const tanim = ROL_TANIMLARI[kod];
    return {
      kod,
      baslik: tanim.baslik,
      aciklama: tanim.aciklama,
      yetkiler: kod === 'SUPER_ADMIN' ? [...YETKILER] : [...tanim.yetkiler],
      sistemRolu: true,
    };
  });
}

function jsondanRollerCoz(json: unknown): RolTanimiDto[] | null {
  if (!json || typeof json !== 'object') return null;
  const kayit = json as { roller?: unknown };
  if (!Array.isArray(kayit.roller)) return null;

  const roller: RolTanimiDto[] = [];
  for (const oge of kayit.roller) {
    if (!oge || typeof oge !== 'object') continue;
    const r = oge as Record<string, unknown>;
    if (typeof r.kod !== 'string' || typeof r.baslik !== 'string') continue;
    const yetkiler = Array.isArray(r.yetkiler)
      ? r.yetkiler.filter((y): y is YetkiKodu => typeof y === 'string' && YETKILER.includes(y as YetkiKodu))
      : [];
    roller.push({
      kod: r.kod,
      baslik: r.baslik,
      aciklama: typeof r.aciklama === 'string' ? r.aciklama : '',
      yetkiler: r.kod === 'SUPER_ADMIN' ? [...YETKILER] : yetkiler,
      sistemRolu: SISTEM_ROLLER.includes(r.kod as RolKodu),
    });
  }
  return roller.length > 0 ? roller : null;
}

function superAdminZorla(roller: RolTanimiDto[]): RolTanimiDto[] {
  return roller.map((rol) =>
    rol.kod === 'SUPER_ADMIN' ? { ...rol, yetkiler: [...YETKILER], sistemRolu: true } : rol
  );
}

function baslikdanKod(baslik: string): string {
  const temiz = baslik
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return temiz || 'YENI_ROL';
}

export class RolService {
  kodUret(baslik: string, mevcutKodlar: string[]): string {
    let kod = baslikdanKod(baslik);
    if (!mevcutKodlar.includes(kod)) return kod;
    let sayac = 2;
    while (mevcutKodlar.includes(`${kod}_${sayac}`)) sayac += 1;
    return `${kod}_${sayac}`;
  }

  async listeleSite(siteId: number): Promise<RolTanimiDto[]> {
    const ayarlar = await ayarlarRepo.findBySiteId(siteId);
    const kayitli = jsondanRollerCoz(ayarlar?.rolTanimlariJson);
    if (kayitli) return superAdminZorla(kayitli);
    return varsayilanRoller();
  }

  async listele(kullanici: JwtPayload, explicitSiteId?: string | number | null) {
    const siteId = await cozulenSiteIdFromKullanici(kullanici, explicitSiteId);
    return this.listeleSite(siteId);
  }

  atanabilirRoller(cagiranRol: string, tumRoller: RolTanimiDto[]): RolTanimiDto[] {
    if (cagiranRol === 'SUPER_ADMIN') return tumRoller;
    if (cagiranRol === 'AJANS_ADMIN') {
      return tumRoller.filter((r) => !AJANS_ATAYAMAZ.includes(r.kod as RolKodu));
    }
    return [];
  }

  async rolGecerliMi(siteId: number, rolKod: string): Promise<boolean> {
    const roller = await this.listeleSite(siteId);
    return roller.some((r) => r.kod === rolKod);
  }

  async kaydet(kullanici: JwtPayload, dto: RolKaydetDto, explicitSiteId?: string | number | null) {
    if (kullanici.rol !== 'SUPER_ADMIN') {
      throw new Error('Rol tanimlarini yalnizca Super Admin duzenleyebilir');
    }

    const siteId = await cozulenSiteIdFromKullanici(kullanici, explicitSiteId);
    const mevcut = await this.listeleSite(siteId);
    const mevcutKodlar = new Set(mevcut.map((r) => r.kod));
    const gelenKodlar = new Set(dto.roller.map((r) => r.kod));

    for (const sistemKod of SISTEM_ROLLER) {
      if (!gelenKodlar.has(sistemKod)) {
        throw new Error(`Sistem rolu silinemez: ${sistemKod}`);
      }
    }

    for (const kod of mevcutKodlar) {
      if (!gelenKodlar.has(kod) && !SISTEM_ROLLER.includes(kod as RolKodu)) {
        const sayi = await kullaniciRepo.sayRol(kod);
        if (sayi > 0) {
          throw new Error(`"${kod}" rolune atanmis ${sayi} kullanici var; rol silinemez`);
        }
      }
    }

    const dogrulanmis: RolTanimiDto[] = dto.roller.map((rol) => {
      const sistemRolu = SISTEM_ROLLER.includes(rol.kod as RolKodu);
      const yetkiler = rol.kod === 'SUPER_ADMIN'
        ? [...YETKILER]
        : rol.yetkiler.filter((y) => YETKILER.includes(y));
      return {
        kod: rol.kod,
        baslik: rol.baslik.trim(),
        aciklama: rol.aciklama.trim(),
        yetkiler,
        sistemRolu,
      };
    });

    await ayarlarRepo.upsert(siteId, {
      rolTanimlariJson: { roller: dogrulanmis } as Prisma.InputJsonValue,
    });

    return dogrulanmis;
  }
}
