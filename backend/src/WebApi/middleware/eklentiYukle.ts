import multer from 'multer';

export const eklentiYukle = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ad = file.originalname.toLowerCase();
    if (
      ad.endsWith('.zip') ||
      file.mimetype === 'application/zip' ||
      file.mimetype === 'application/x-zip-compressed'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Sadece .zip dosyalari kabul edilir'));
    }
  },
});
