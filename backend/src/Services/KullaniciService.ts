import bcrypt from 'bcryptjs';
import type { KullaniciGuncelleDto, KullaniciOlusturDto, RolKodu } from '../Application/DTOs/KullaniciDto.js';
import { KullaniciRepository } from '../Infrastructure/repositories/KullaniciRepository.js';
import { SiteRepository } from '../Infrastructure/repositories/SiteRepository.js';
import { cozulenSiteIdFromKullanici } from '../Infrastructure/utils/siteIdCoz.js';
import { opsiyonelSayisalId, sayisalId } from '../Infrastructure/utils/sayisalId.js';
import type { JwtPayload } from './AuthService.js';
import { RolService } from './RolService.js';

const kullaniciRepo = new KullaniciRepository();
const siteRepo = new SiteRepository();
const rolService = new RolService();

const YONETICI_ROLLER: RolKodu[] = ['SUPER_ADMIN', 'AJANS_ADMIN'];

function kullaniciDto(k: {
  id: number;
  email: string;
  ad: string;
  rol: string;
  siteId: number | null;
  aktif: boolean;
  olusturma: Date;
  guncelleme: Date;
  site?: { id: number; ad: string; slug: string } | null;
}) {
  return {
    id: String(k.id),
    email: k.email,
    ad: k.ad,
    rol: k.rol,
    siteId: k.siteId !== null ? String(k.siteId) : null,
    aktif: k.aktif,
    olusturma: k.olusturma.toISOString(),
    guncelleme: k.guncelleme.toISOString(),
    siteAd: k.site?.ad ?? null,
    siteSlug: k.site?.slug ?? null,
  };
}

export class KullaniciService {
  private yetkiKontrol(cagiran: JwtPayload) {
    if (!YONETICI_ROLLER.includes(cagiran.rol as RolKodu)) {
      throw new Error('Bu islem icin yetkiniz yok');
    }
  }

  private async rolAtamaKontrol(cagiran: JwtPayload, hedefRol: string, siteId: number) {
    const roller = await rolService.listeleSite(siteId);
    const atanabilir = rolService.atanabilirRoller(cagiran.rol, roller);
    if (!atanabilir.some((r) => r.kod === hedefRol)) {
      throw new Error('Bu rol atama yetkiniz yok');
    }
    if (!roller.some((r) => r.kod === hedefRol)) {
      throw new Error('Gecersiz rol');
    }
  }

  private hedefKullaniciKontrol(cagiran: JwtPayload, hedefSiteId: number | null) {
    if (cagiran.rol === 'SUPER_ADMIN') return;
    if (cagiran.rol === 'AJANS_ADMIN' && hedefSiteId === cagiran.siteId) return;
    throw new Error('Bu kullanici uzerinde islem yapma yetkiniz yok');
  }

  async listele(cagiran: JwtPayload, filtreSiteId?: string | number | null) {
    this.yetkiKontrol(cagiran);

    if (cagiran.rol === 'AJANS_ADMIN') {
      const siteId = cagiran.siteId;
      if (!siteId) throw new Error('Site baglantiniz bulunamadi');
      const liste = await kullaniciRepo.listele(siteId);
      return liste.map(kullaniciDto);
    }

    const siteId = opsiyonelSayisalId(filtreSiteId ?? undefined);
    const liste = await kullaniciRepo.listele(siteId ?? undefined);
    return liste.map(kullaniciDto);
  }

  async siteler(cagiran: JwtPayload) {
    this.yetkiKontrol(cagiran);
    if (cagiran.rol !== 'SUPER_ADMIN') {
      if (!cagiran.siteId) return [];
      const site = await siteRepo.findById(cagiran.siteId);
      return site ? [{ id: site.id, ad: site.ad, slug: site.slug }] : [];
    }
    return siteRepo.listeleAktif();
  }

  async olustur(cagiran: JwtPayload, dto: KullaniciOlusturDto) {
    this.yetkiKontrol(cagiran);

    const siteId =
      cagiran.rol === 'AJANS_ADMIN'
        ? cagiran.siteId
        : opsiyonelSayisalId(dto.siteId ?? undefined);

    if (!siteId && dto.rol !== 'SUPER_ADMIN' && dto.rol !== 'AJANS_ADMIN') {
      throw new Error('Site secimi gerekli');
    }

    const cozumSiteId = siteId ?? (await cozulenSiteIdFromKullanici(cagiran));
    await this.rolAtamaKontrol(cagiran, dto.rol, cozumSiteId);

    const mevcut = await kullaniciRepo.findByEmail(dto.email);
    if (mevcut) throw new Error('Bu e-posta zaten kayitli');

    const sifreHash = await bcrypt.hash(dto.sifre, 10);
    const kullanici = await kullaniciRepo.olustur({
      email: dto.email.trim().toLowerCase(),
      ad: dto.ad.trim(),
      sifreHash,
      rol: dto.rol,
      siteId,
      aktif: dto.aktif,
    });

    return kullaniciDto(kullanici);
  }

  async guncelle(cagiran: JwtPayload, idHam: string | number, dto: KullaniciGuncelleDto) {
    this.yetkiKontrol(cagiran);
    const id = sayisalId(idHam);

    const mevcut = await kullaniciRepo.findById(id);
    if (!mevcut) throw new Error('Kullanici bulunamadi');

    this.hedefKullaniciKontrol(cagiran, mevcut.siteId);

    if (dto.rol) {
      const cozumSiteId = mevcut.siteId ?? (await cozulenSiteIdFromKullanici(cagiran));
      await this.rolAtamaKontrol(cagiran, dto.rol, cozumSiteId);
    }

    if (id === cagiran.kullaniciId && dto.aktif === false) {
      throw new Error('Kendi hesabinizi pasif yapamazsiniz');
    }

    if (dto.email && dto.email !== mevcut.email) {
      const epostaVar = await kullaniciRepo.findByEmail(dto.email);
      if (epostaVar) throw new Error('Bu e-posta zaten kayitli');
    }

    const guncelleme: Parameters<KullaniciRepository['guncelle']>[1] = {};
    if (dto.email) guncelleme.email = dto.email.trim().toLowerCase();
    if (dto.ad) guncelleme.ad = dto.ad.trim();
    if (dto.rol) guncelleme.rol = dto.rol;
    if (dto.aktif !== undefined) guncelleme.aktif = dto.aktif;
    if (dto.sifre) guncelleme.sifreHash = await bcrypt.hash(dto.sifre, 10);

    if (cagiran.rol === 'SUPER_ADMIN' && dto.siteId !== undefined) {
      guncelleme.siteId = opsiyonelSayisalId(dto.siteId);
    }

    const kullanici = await kullaniciRepo.guncelle(id, guncelleme);
    return kullaniciDto(kullanici);
  }

  async sil(cagiran: JwtPayload, idHam: string | number) {
    this.yetkiKontrol(cagiran);
    const id = sayisalId(idHam);

    if (id === cagiran.kullaniciId) {
      throw new Error('Kendi hesabinizi silemezsiniz');
    }

    const mevcut = await kullaniciRepo.findById(id);
    if (!mevcut) throw new Error('Kullanici bulunamadi');

    this.hedefKullaniciKontrol(cagiran, mevcut.siteId);

    await kullaniciRepo.sil(id);
  }
}
