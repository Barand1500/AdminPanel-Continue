import { z } from 'zod';

export const medyaOlusturSchema = z.object({
  ad: z.string().min(1),
  url: z.string().min(1),
  tip: z.string().default('GORSEL'),
});

export type MedyaOlusturDto = z.infer<typeof medyaOlusturSchema>;
