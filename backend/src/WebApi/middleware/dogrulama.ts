import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';

export function validateBySchema(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const sonuc = schema.safeParse(req.body);
    if (!sonuc.success) {
      return res.status(400).json({
        mesaj: 'Geçersiz veri',
        hatalar: sonuc.error.flatten().fieldErrors,
      });
    }
    req.body = sonuc.data;
    next();
  };
}
