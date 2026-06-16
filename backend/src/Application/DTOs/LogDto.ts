import { z } from 'zod';

export const logKaydetSchema = z.object({
  islem: z.string().min(1),
  modulId: z.string().optional(),
  aksiyonId: z.string().optional(),
});

export type LogKaydetDto = z.infer<typeof logKaydetSchema>;
