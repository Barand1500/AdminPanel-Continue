import { z } from 'zod';

/** Tam URL veya /uploads/... gibi site içi yollar */
export const bosVeyaMedyaUrl = z
  .union([
    z.string().url(),
    z.string().regex(/^\//, 'Gecerli URL veya / ile baslayan yol girin'),
    z.literal(''),
    z.null(),
  ])
  .optional();

export const bosVeyaEmail = z.union([z.string().email(), z.literal(''), z.null()]).optional();

/** JSON alanlari — sema degisse bile kayit bozulmasin */
export const esnekJson = z.record(z.unknown()).nullable().optional();
