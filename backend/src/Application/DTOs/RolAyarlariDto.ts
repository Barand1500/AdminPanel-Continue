import { z } from 'zod';
import { YETKILER } from './KullaniciDto.js';

const yetkiEnum = z.enum(YETKILER);

export const rolTanimiSchema = z.object({
  kod: z.string().min(1),
  baslik: z.string().min(1),
  aciklama: z.string().default(''),
  yetkiler: z.array(yetkiEnum),
  sistemRolu: z.boolean().optional(),
});

export const rolKaydetSchema = z.object({
  roller: z.array(rolTanimiSchema).min(1),
});

export type RolTanimiDto = z.infer<typeof rolTanimiSchema>;
export type RolKaydetDto = z.infer<typeof rolKaydetSchema>;
