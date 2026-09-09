import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { MEDYA_MAX_DOSYA_BOYUTU } from '../../config/medya.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const guvenli = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${guvenli}`);
  },
});

export const medyaYukle = multer({
  storage,
  limits: { fileSize: MEDYA_MAX_DOSYA_BOYUTU },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || ['video/mp4', 'video/webm', 'video/ogg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Sadece gorsel veya MP4, WebM, Ogg video dosyalari kabul edilir'));
    }
  },
});
