import { z } from 'zod';

const tarihSchema = z
  .string()
  .trim()
  .refine((deger) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(deger)) {
      const tarih = new Date(`${deger}T00:00:00.000Z`);
      return !Number.isNaN(tarih.getTime()) && tarih.toISOString().slice(0, 10) === deger;
    }
    return !Number.isNaN(new Date(deger).getTime());
  }, 'Gecerli bir tarih girin');

const gorevAlanlariSchema = z.object({
  metin: z.string().trim().min(1, 'Gorev metni zorunlu').max(500),
  tamamlandi: z.boolean().optional(),
  onemli: z.boolean().optional(),
  tarih: tarihSchema.nullable().optional(),
  tarihBitis: tarihSchema.nullable().optional(),
});

export const gorevOlusturSchema = gorevAlanlariSchema.superRefine((deger, ctx) => {
  if (!deger.tarih || !deger.tarihBitis) return;
  if (new Date(deger.tarih).getTime() > new Date(deger.tarihBitis).getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['tarihBitis'],
      message: 'Bitis tarihi baslangic tarihinden once olamaz',
    });
  }
});

export const gorevGuncelleSchema = gorevAlanlariSchema
  .partial()
  .refine((deger) => Object.keys(deger).length > 0, 'Guncellenecek en az bir alan gonderin');

export type GorevOlusturDto = z.infer<typeof gorevOlusturSchema>;
export type GorevGuncelleDto = z.infer<typeof gorevGuncelleSchema>;
