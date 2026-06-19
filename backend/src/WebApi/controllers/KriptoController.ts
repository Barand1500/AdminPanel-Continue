import type { Request, Response } from 'express';
import { KriptoService } from '../../Services/KriptoService.js';

const service = new KriptoService();

export class KriptoController {
  async listele(req: Request, res: Response) {
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const symbolsRaw = (req.query.symbols as string) ?? '';
    const symbols = symbolsRaw ? symbolsRaw.split(',').map((s) => s.trim()).filter(Boolean) : undefined;

    try {
      const liste = await service.listele(limit, symbols);
      return res.json({ liste });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kripto verisi alinamadi';
      return res.status(502).json({ mesaj });
    }
  }
}
