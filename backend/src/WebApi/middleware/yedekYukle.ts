import multer from 'multer';

export const yedekYukle = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ad = file.originalname.toLowerCase();
    if (ad.endsWith('.json') || ad.endsWith('.sql') || file.mimetype === 'application/json' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Sadece .json veya .sql dosyalari kabul edilir'));
    }
  },
});
