import { z } from 'zod';

export const medyaOlusturSchema = z.object({
  ad: z.string().min(1),
  url: z.string().min(1),
  tip: z.string().default('GORSEL'),
});

export const medyaTopluSilSchema = z.object({
  ids: z.array(z.coerce.number()).min(1),
});

export type MedyaOlusturDto = z.infer<typeof medyaOlusturSchema>;
export type MedyaTopluSilDto = z.infer<typeof medyaTopluSilSchema>;
