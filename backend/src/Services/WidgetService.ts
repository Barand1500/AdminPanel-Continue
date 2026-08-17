import type { WidgetTipi } from '@prisma/client';
import type { WidgetGuncelleDto, WidgetOlusturDto, WidgetTip } from '../Application/DTOs/WidgetDto.js';
import { deprecatedWidgetTipleri } from '../Application/DTOs/WidgetDto.js';
import { WidgetRepository } from '../Infrastructure/repositories/WidgetRepository.js';
import { BlogService } from './BlogService.js';

import { opsiyonelSayisalId } from '../Infrastructure/utils/sayisalId.js';

const widgetRepo = new WidgetRepository();
const blogService = new BlogService();

function blogKaruselKartlari(configJson: unknown): Array<Record<string, unknown>> {
  if (!configJson || typeof configJson !== 'object') return [];
  const kartlar = (configJson as { blogKartlari?: unknown }).blogKartlari;
  return Array.isArray(kartlar) ? (kartlar as Array<Record<string, unknown>>) : [];
}

async function blogKaruselSenkron(siteId: number, tip: string, configJson: unknown) {
  if (tip !== 'BLOG_KARUSEL') return;
  const kartlar = blogKaruselKartlari(configJson);
  if (kartlar.length === 0) return;
  await blogService.karuselKartlariniSenkronizeEt(siteId, kartlar as never);
}

export class WidgetService {
  async listele(siteId: number, tip?: WidgetTip) {
    return widgetRepo.findAdminBySiteId(siteId, tip);
  }

  async olustur(siteId: number, dto: WidgetOlusturDto) {
    if (deprecatedWidgetTipleri.includes(dto.tip)) {
      throw new Error('Bu widget tipi artik desteklenmiyor. Lutfen baska bir tip secin.');
    }
    const widget = await widgetRepo.createForSite(siteId, {
      ad: dto.ad,
      tip: dto.tip as WidgetTipi,
      sayfa: dto.sayfaId ? { connect: { id: opsiyonelSayisalId(dto.sayfaId)! } } : undefined,
      sira: dto.sira,
      aktif: dto.aktif,
      baslik: dto.baslik,
      altBaslik: dto.altBaslik,
      aciklama: dto.aciklama,
      gorselUrl: dto.gorselUrl,
      butonMetni: dto.butonMetni,
      butonLink: dto.butonLink,
      arkaPlanRenk: dto.arkaPlanRenk,
      yaziRenk: dto.yaziRenk,
      mobilGoster: dto.mobilGoster,
      masaustuGoster: dto.masaustuGoster,
      configJson: dto.configJson as never,
    });

    await blogKaruselSenkron(siteId, dto.tip, dto.configJson);
    return widget;
  }

  async guncelle(siteId: number, widgetId: number, dto: WidgetGuncelleDto) {
    const mevcut = await widgetRepo.findByIdAndSiteId(widgetId, siteId);
    if (!mevcut) {
      throw new Error('Widget bulunamadi');
    }

    const widget = await widgetRepo.updateForSite(widgetId, {
      ad: dto.ad,
      tip: dto.tip as WidgetTipi | undefined,
      sayfa:
        dto.sayfaId !== undefined
          ? opsiyonelSayisalId(dto.sayfaId)
            ? { connect: { id: opsiyonelSayisalId(dto.sayfaId)! } }
            : { disconnect: true }
          : undefined,
      sira: dto.sira,
      aktif: dto.aktif,
      baslik: dto.baslik,
      altBaslik: dto.altBaslik,
      aciklama: dto.aciklama,
      gorselUrl: dto.gorselUrl,
      butonMetni: dto.butonMetni,
      butonLink: dto.butonLink,
      arkaPlanRenk: dto.arkaPlanRenk,
      yaziRenk: dto.yaziRenk,
      mobilGoster: dto.mobilGoster,
      masaustuGoster: dto.masaustuGoster,
      configJson: dto.configJson as never,
    });

    const tip = dto.tip ?? mevcut.tip;
    const configJson = dto.configJson ?? mevcut.configJson;
    await blogKaruselSenkron(siteId, tip, configJson);
    return widget;
  }

  async sil(siteId: number, widgetId: number) {
    const mevcut = await widgetRepo.findByIdAndSiteId(widgetId, siteId);
    if (!mevcut) throw new Error('Widget bulunamadi');
    await widgetRepo.deleteForSite(widgetId, siteId);
  }
}
