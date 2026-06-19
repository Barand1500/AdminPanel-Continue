import { Router } from 'express';
import { SiteController } from '../controllers/SiteController.js';
import { SiteAuthController, uyeAuthMiddleware } from '../controllers/SiteAuthController.js';
import { PublicFormController } from '../controllers/PublicFormController.js';
import { HavaDurumuController } from '../controllers/HavaDurumuController.js';
import { KriptoController } from '../controllers/KriptoController.js';
import { validateBySchema } from '../middleware/dogrulama.js';
import { formRateLimit } from '../middleware/formRateLimit.js';
import { formGonderSchema } from '../../Application/DTOs/FormDto.js';
import {
  girisSchema,
  kayitSchema,
  profilGuncelleSchema,
  sifreDegistirSchema,
} from '../../Application/DTOs/AuthDto.js';

const router = Router();
const controller = new SiteController();
const authController = new SiteAuthController();
const publicFormController = new PublicFormController();
const havaController = new HavaDurumuController();
const kriptoController = new KriptoController();

router.get('/health', (req, res) => controller.health(req, res));
router.get('/hava', (req, res) => havaController.getir(req, res));
router.get('/kripto', (req, res) => kriptoController.listele(req, res));
router.get('/site', (req, res) => controller.getPublicSite(req, res));
router.get('/sayfalar/detay', (req, res) => controller.getSayfa(req, res));
router.get('/sayfalar/*splat', (req, res) => {
  const raw = req.params.splat;
  const parcalar = Array.isArray(raw) ? raw : [String(raw)];
  if (parcalar.length === 1 && parcalar[0] === 'detay') {
    return controller.getSayfa(req, res);
  }
  return controller.getSayfa(req, res, parcalar.join('/'));
});
router.get('/blog', (req, res) => controller.listeleBlog(req, res));
router.get('/blog/:slug', (req, res) => controller.getBlog(req, res));

router.post(
  '/formlar/:slug/gonder',
  formRateLimit,
  validateBySchema(formGonderSchema),
  (req, res) => publicFormController.gonder(req, res)
);

router.post('/auth/kayit', validateBySchema(kayitSchema), (req, res) => authController.kayit(req, res));
router.post('/auth/giris', validateBySchema(girisSchema), (req, res) => authController.giris(req, res));
router.get('/auth/ben', uyeAuthMiddleware, (req, res) => authController.ben(req, res));
router.patch('/auth/profil', uyeAuthMiddleware, validateBySchema(profilGuncelleSchema), (req, res) =>
  authController.profilGuncelle(req, res)
);
router.patch('/auth/sifre', uyeAuthMiddleware, validateBySchema(sifreDegistirSchema), (req, res) =>
  authController.sifreDegistir(req, res)
);

export default router;
