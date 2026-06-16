import type { Request, Response } from 'express';
import { TcmbKurService } from '../../Services/TcmbKurService.js';
import type { KurTipi } from '../../Services/TcmbKurService.js';

const service = new TcmbKurService();

const GECERLI_TIPLER: KurTipi[] = ['doviz_alis', 'doviz_satis', 'efektif_alis', 'efektif_satis'];

export class KurController {
  async tcmbOnizle(req: Request, res: Response) {
    const kod = (req.query.kod as string) ?? '';
    const kurTipi = (req.query.kurTipi as KurTipi) ?? 'doviz_satis';

    if (!GECERLI_TIPLER.includes(kurTipi)) {
      return res.status(400).json({ mesaj: 'Gecersiz kur tipi' });
    }

    const sonuc = await service.onizle(kod, kurTipi);
    return res.json(sonuc);
  }
}
