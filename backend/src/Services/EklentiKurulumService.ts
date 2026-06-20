import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AdmZip from 'adm-zip';
import type { Prisma } from '@prisma/client';
import { eklentiManifestSchema } from '../Application/DTOs/EklentiDto.js';
import { EklentiRepository } from '../Infrastructure/repositories/EklentiRepository.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_ROOT = path.join(__dirname, '../../uploads/eklentiler');

const repo = new EklentiRepository();

function eklentiKlasorYolu(siteId: number, kod: string) {
  return path.join(UPLOADS_ROOT, String(siteId), kod);
}

function zipSlipGuvenli(hedefKok: string, hedefYol: string) {
  const cozulmus = path.resolve(hedefYol);
  const kok = path.resolve(hedefKok);
  if (!cozulmus.startsWith(kok + path.sep) && cozulmus !== kok) {
    throw new Error('Guvenlik: gecersiz zip icerigi');
  }
}

export class EklentiKurulumService {
  dosyaKlasorunuSil(siteId: number, kod: string) {
    const klasor = eklentiKlasorYolu(siteId, kod);
    if (fs.existsSync(klasor)) {
      fs.rmSync(klasor, { recursive: true, force: true });
    }
  }

  async ziptenKur(siteId: number, buffer: Buffer) {
    const zip = new AdmZip(buffer);
    const manifestEntry = zip.getEntry('manifest.json');
    if (!manifestEntry) throw new Error('manifest.json bulunamadi');

    let manifestHam: unknown;
    try {
      manifestHam = JSON.parse(manifestEntry.getData().toString('utf8'));
    } catch {
      throw new Error('manifest.json gecersiz JSON');
    }

    const manifest = eklentiManifestSchema.parse(manifestHam);
    const mevcut = await repo.findByKod(siteId, manifest.kod);
    if (mevcut) throw new Error('Bu kod ile eklenti zaten kurulu');

    const hedefKlasor = eklentiKlasorYolu(siteId, manifest.kod);
    fs.mkdirSync(hedefKlasor, { recursive: true });

    const entries = zip.getEntries();
    for (const entry of entries) {
      if (entry.isDirectory) continue;
      const hedefYol = path.join(hedefKlasor, entry.entryName);
      zipSlipGuvenli(hedefKlasor, hedefYol);
      fs.mkdirSync(path.dirname(hedefYol), { recursive: true });
      fs.writeFileSync(hedefYol, entry.getData());
    }

    return repo.create(siteId, {
      kod: manifest.kod,
      ad: manifest.ad,
      surum: manifest.surum,
      durum: 'kurulu',
      kaynak: 'yukleme',
      manifestJson: manifest as Prisma.InputJsonValue,
      ayarlarJson: {},
    });
  }
}
