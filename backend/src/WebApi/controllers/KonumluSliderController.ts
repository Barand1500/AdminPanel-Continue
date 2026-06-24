import type { Request, Response } from 'express';
import type { KonumluSlider } from '@prisma/client';
import { KonumluSliderService } from '../../Services/KonumluSliderService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';
import { paramId } from '../../Infrastructure/utils/paramId.js';
import { idToApi } from '../../Infrastructure/utils/sayisalId.js';

const service = new KonumluSliderService();

function sliderToApi(slider: KonumluSlider) {
  return {
    ...slider,
    id: idToApi(slider.id),
    siteId: idToApi(slider.siteId),
    sayfaId: slider.sayfaId != null ? idToApi(slider.sayfaId) : null,
  };
}

export class KonumluSliderController {
  async listele(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const sliderlar = await service.listeleAdmin(siteId);
      return res.json({ sliderlar: sliderlar.map(sliderToApi) });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Sliderlar alinamadi';
      return res.status(500).json({ mesaj });
    }
  }

  async olustur(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const slider = await service.olustur(siteId, req.body);
      return res.status(201).json({ slider: sliderToApi(slider) });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Slider olusturulamadi';
      return res.status(400).json({ mesaj });
    }
  }

  async guncelle(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const slider = await service.guncelle(siteId, paramId(req.params.id), req.body);
      return res.json({ slider: sliderToApi(slider) });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Slider guncellenemedi';
      const status = mesaj === 'Slider bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async sil(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      await service.sil(siteId, paramId(req.params.id));
      return res.json({ mesaj: 'Slider silindi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Slider silinemedi';
      const status = mesaj === 'Slider bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }
}
