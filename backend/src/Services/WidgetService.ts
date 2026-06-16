import type { WidgetTipi } from '@prisma/client';
import type { WidgetGuncelleDto, WidgetOlusturDto } from '../Application/DTOs/WidgetDto.js';
import { deprecatedWidgetTipleri } from '../Application/DTOs/WidgetDto.js';
import { WidgetRepository } from '../Infrastructure/repositories/WidgetRepository.js';

import { opsiyonelSayisalId } from '../Infrastructure/utils/sayisalId.js';

const widgetRepo = new WidgetRepository();

export class WidgetService {
  async listele(siteId: number, tip?: WidgetTipi) {
    return widgetRepo.findAdminBySiteId(siteId, tip);
  }

  async olustur(siteId: number, dto: WidgetOlusturDto) {
    if (deprecatedWidgetTipleri.includes(dto.tip)) {
      throw new Error('Bu widget tipi artik desteklenmiyor. Lutfen baska bir tip secin.');
    }
    return widgetRepo.createForSite(siteId, {
      ad: dto.ad,
      tip: dto.tip,
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
  }

  async guncelle(siteId: number, widgetId: number, dto: WidgetGuncelleDto) {
    const mevcut = await widgetRepo.findByIdAndSiteId(widgetId, siteId);
    if (!mevcut) {
      throw new Error('Widget bulunamadi');
    }

    return widgetRepo.updateForSite(widgetId, {
      ad: dto.ad,
      tip: dto.tip,
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
  }

  async sil(siteId: number, widgetId: number) {
    const mevcut = await widgetRepo.findByIdAndSiteId(widgetId, siteId);
    if (!mevcut) throw new Error('Widget bulunamadi');
    await widgetRepo.deleteForSite(widgetId, siteId);
  }
}
