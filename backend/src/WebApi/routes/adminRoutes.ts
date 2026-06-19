import { Router } from 'express';
import { blogGuncelleSchema, blogOlusturSchema } from '../../Application/DTOs/BlogDto.js';
import { formGuncelleSchema, formOlusturSchema } from '../../Application/DTOs/FormDto.js';
import { kisayolGuncelleSchema, kisayolOlusturSchema } from '../../Application/DTOs/KisayolDto.js';
import { sekmeGuncelleSchema, sekmeOlusturSchema } from '../../Application/DTOs/SekmeDto.js';
import { kullaniciGuncelleSchema, kullaniciOlusturSchema } from '../../Application/DTOs/KullaniciDto.js';
import { rolKaydetSchema } from '../../Application/DTOs/RolAyarlariDto.js';
import { adminProfilGuncelleSchema, girisSchema, tercihlerGuncelleSchema } from '../../Application/DTOs/AuthDto.js';
import {
  menuGuncelleSchema,
  sayfaGuncelleSchema,
  sayfaOlusturSchema,
  sayfaTasiSchema,
} from '../../Application/DTOs/SayfaDto.js';
import { medyaOlusturSchema, medyaTopluSilSchema } from '../../Application/DTOs/MedyaDto.js';
import {
  seoGenelGuncelleSchema,
  seoSayfaGuncelleSchema,
  seoTopluKaydetSchema,
} from '../../Application/DTOs/SeoDto.js';
import { siteAyarlariGuncelleSchema } from '../../Application/DTOs/SiteAyarlariDto.js';
import { sistemAyarlariGuncelleSchema } from '../../Application/DTOs/SistemAyarlariDto.js';
import { widgetGuncelleSchema, widgetOlusturSchema } from '../../Application/DTOs/WidgetDto.js';
import { AuthController, authMiddleware } from '../controllers/AuthController.js';
import { BlogController } from '../controllers/BlogController.js';
import { DashboardController } from '../controllers/DashboardController.js';
import { FormController } from '../controllers/FormController.js';
import { BildirimController } from '../controllers/BildirimController.js';
import { MedyaController } from '../controllers/MedyaController.js';
import { SayfaController } from '../controllers/SayfaController.js';
import { SeoController } from '../controllers/SeoController.js';
import { SiteAyarlariController } from '../controllers/SiteAyarlariController.js';
import { WidgetController } from '../controllers/WidgetController.js';
import { LogController } from '../controllers/LogController.js';
import { YedeklemeController } from '../controllers/YedeklemeController.js';
import { SistemAyarlariController } from '../controllers/SistemAyarlariController.js';
import { KullaniciController } from '../controllers/KullaniciController.js';
import { RolController } from '../controllers/RolController.js';
import { KurController } from '../controllers/KurController.js';
import { HavaDurumuController } from '../controllers/HavaDurumuController.js';
import { KriptoController } from '../controllers/KriptoController.js';
import { KisayolController } from '../controllers/KisayolController.js';
import { SekmeController } from '../controllers/SekmeController.js';
import { NavKategoriController } from '../controllers/NavKategoriController.js';
import {
  navKategoriGuncelleSchema,
  navKategoriOlusturSchema,
} from '../../Application/DTOs/NavKategoriDto.js';
import { rolMiddleware } from '../middleware/rolMiddleware.js';
import { yetkiMiddleware } from '../middleware/yetkiMiddleware.js';
import { medyaYukle } from '../middleware/medyaYukle.js';
import { yedekYukle } from '../middleware/yedekYukle.js';
import { validateBySchema } from '../middleware/dogrulama.js';

const router = Router();
const authController = new AuthController();
const widgetController = new WidgetController();
const siteAyarlariController = new SiteAyarlariController();
const sayfaController = new SayfaController();
const medyaController = new MedyaController();
const seoController = new SeoController();
const dashboardController = new DashboardController();
const blogController = new BlogController();
const formController = new FormController();
const bildirimController = new BildirimController();
const logController = new LogController();
const yedeklemeController = new YedeklemeController();
const sistemAyarlariController = new SistemAyarlariController();
const kullaniciController = new KullaniciController();
const rolController = new RolController();
const kurController = new KurController();
const havaController = new HavaDurumuController();
const kriptoController = new KriptoController();
const kisayolController = new KisayolController();
const sekmeController = new SekmeController();
const navKategoriController = new NavKategoriController();

const yG = yetkiMiddleware('goruntuleme');
const yE = yetkiMiddleware('ekleme');
const yD = yetkiMiddleware('duzenleme');
const yS = yetkiMiddleware('silme');
const yK = yetkiMiddleware('kullanici_yonetimi');

router.post('/auth/giris', validateBySchema(girisSchema), (req, res) => authController.giris(req, res));
router.get('/auth/ben', authMiddleware, (req, res) => authController.ben(req, res));
router.patch('/auth/profil', authMiddleware, validateBySchema(adminProfilGuncelleSchema), (req, res) =>
  authController.profilGuncelle(req, res)
);
router.patch('/auth/tercihler', authMiddleware, validateBySchema(tercihlerGuncelleSchema), (req, res) =>
  authController.tercihlerGuncelle(req, res)
);

router.get('/dashboard', authMiddleware, yG, (req, res) => dashboardController.ozet(req, res));

router.get('/bildirimler', authMiddleware, yG, (req, res) => bildirimController.listele(req, res));
router.patch('/bildirimler/tumu-okundu', authMiddleware, yG, (req, res) => bildirimController.tumunuOkundu(req, res));

router.get('/widgetlar', authMiddleware, yG, (req, res) => widgetController.listele(req, res));
router.post('/widgetlar', authMiddleware, yE, validateBySchema(widgetOlusturSchema), (req, res) => widgetController.olustur(req, res));
router.put('/widgetlar/:id', authMiddleware, yD, validateBySchema(widgetGuncelleSchema), (req, res) => widgetController.guncelle(req, res));
router.delete('/widgetlar/:id', authMiddleware, yS, (req, res) => widgetController.sil(req, res));

router.get('/site-ayarlari', authMiddleware, yG, (req, res) => siteAyarlariController.getir(req, res));
router.put('/site-ayarlari', authMiddleware, yD, validateBySchema(siteAyarlariGuncelleSchema), (req, res) => siteAyarlariController.guncelle(req, res));
router.get('/site/ayarlar', authMiddleware, yG, (req, res) => siteAyarlariController.getir(req, res));
router.patch('/site/ayarlar', authMiddleware, yD, validateBySchema(siteAyarlariGuncelleSchema), (req, res) => siteAyarlariController.guncelle(req, res));

router.get('/kur/tcmb-onizle', authMiddleware, yG, (req, res) => kurController.tcmbOnizle(req, res));
router.get('/hava-onizle', authMiddleware, yG, (req, res) => havaController.getir(req, res));
router.get('/kripto-onizle', authMiddleware, yG, (req, res) => kriptoController.listele(req, res));

router.get('/kisayollar', authMiddleware, yG, (req, res) => kisayolController.listele(req, res));
router.post('/kisayollar', authMiddleware, yE, validateBySchema(kisayolOlusturSchema), (req, res) =>
  kisayolController.olustur(req, res)
);
router.put('/kisayollar/:id', authMiddleware, yD, validateBySchema(kisayolGuncelleSchema), (req, res) =>
  kisayolController.guncelle(req, res)
);
router.delete('/kisayollar/:id', authMiddleware, yS, (req, res) => kisayolController.sil(req, res));

router.get('/sekmeler', authMiddleware, yG, (req, res) => sekmeController.listele(req, res));
router.post('/sekmeler', authMiddleware, yE, validateBySchema(sekmeOlusturSchema), (req, res) =>
  sekmeController.olustur(req, res)
);
router.put('/sekmeler/:id', authMiddleware, yD, validateBySchema(sekmeGuncelleSchema), (req, res) =>
  sekmeController.guncelle(req, res)
);
router.delete('/sekmeler/:id', authMiddleware, yS, (req, res) => sekmeController.sil(req, res));

router.get('/sayfalar', authMiddleware, yG, (req, res) => sayfaController.listele(req, res));
router.post('/sayfalar', authMiddleware, yE, validateBySchema(sayfaOlusturSchema), (req, res) => sayfaController.olustur(req, res));
router.put('/sayfalar/:id/tasi', authMiddleware, yD, validateBySchema(sayfaTasiSchema), (req, res) => sayfaController.tasi(req, res));
router.put('/sayfalar/:id', authMiddleware, yD, validateBySchema(sayfaGuncelleSchema), (req, res) => sayfaController.guncelle(req, res));
router.delete('/sayfalar/:id', authMiddleware, yS, (req, res) => sayfaController.sil(req, res));
router.put('/menu', authMiddleware, yD, validateBySchema(menuGuncelleSchema), (req, res) => sayfaController.menuGuncelle(req, res));

router.get('/nav-kategoriler', authMiddleware, yG, (req, res) => navKategoriController.listele(req, res));
router.post('/nav-kategoriler', authMiddleware, yE, validateBySchema(navKategoriOlusturSchema), (req, res) =>
  navKategoriController.olustur(req, res)
);
router.put('/nav-kategoriler/:id', authMiddleware, yD, validateBySchema(navKategoriGuncelleSchema), (req, res) =>
  navKategoriController.guncelle(req, res)
);
router.delete('/nav-kategoriler/:id', authMiddleware, yS, (req, res) => navKategoriController.sil(req, res));

router.get('/medya', authMiddleware, yG, (req, res) => medyaController.listele(req, res));
router.post('/medya', authMiddleware, yE, validateBySchema(medyaOlusturSchema), (req, res) => medyaController.olustur(req, res));
router.post('/medya/yukle', authMiddleware, yE, medyaYukle.single('dosya'), (req, res) => medyaController.yukle(req, res));
router.delete('/medya/:id', authMiddleware, yS, (req, res) => medyaController.sil(req, res));
router.delete('/medya', authMiddleware, yS, validateBySchema(medyaTopluSilSchema), (req, res) =>
  medyaController.topluSil(req, res)
);

router.get('/seo', authMiddleware, yG, (req, res) => seoController.ozet(req, res));
router.put('/seo/genel', authMiddleware, yD, validateBySchema(seoGenelGuncelleSchema), (req, res) => seoController.genelGuncelle(req, res));
router.put('/seo/toplu', authMiddleware, yD, validateBySchema(seoTopluKaydetSchema), (req, res) => seoController.topluKaydet(req, res));
router.put('/seo/sayfa/:id', authMiddleware, yD, validateBySchema(seoSayfaGuncelleSchema), (req, res) => seoController.sayfaGuncelle(req, res));

router.get('/blog', authMiddleware, yG, (req, res) => blogController.listele(req, res));
router.post('/blog', authMiddleware, yE, validateBySchema(blogOlusturSchema), (req, res) => blogController.olustur(req, res));
router.put('/blog/:id', authMiddleware, yD, validateBySchema(blogGuncelleSchema), (req, res) => blogController.guncelle(req, res));
router.delete('/blog/:id', authMiddleware, yS, (req, res) => blogController.sil(req, res));

router.get('/formlar', authMiddleware, yG, (req, res) => formController.listele(req, res));
router.get('/formlar/:id', authMiddleware, yG, (req, res) => formController.detay(req, res));
router.post('/formlar', authMiddleware, yE, validateBySchema(formOlusturSchema), (req, res) => formController.olustur(req, res));
router.put('/formlar/:id', authMiddleware, yD, validateBySchema(formGuncelleSchema), (req, res) => formController.guncelle(req, res));
router.delete('/formlar/:id', authMiddleware, yS, (req, res) => formController.sil(req, res));
router.get('/formlar/:id/gonderimler', authMiddleware, yG, (req, res) => formController.gonderimler(req, res));
router.patch('/formlar/:id/gonderimler/:gonderimId/okundu', authMiddleware, yD, (req, res) => formController.gonderimOkundu(req, res));
router.delete('/formlar/:id/gonderimler/:gonderimId', authMiddleware, yS, (req, res) => formController.gonderimSil(req, res));

router.get('/loglar', authMiddleware, yG, (req, res) => logController.listele(req, res));
router.post('/loglar', authMiddleware, yG, (req, res) => logController.kaydet(req, res));
router.delete('/loglar/temizle', authMiddleware, yS, (req, res) => logController.temizle(req, res));

router.get('/yedek/varsayilan-dosya-adi', authMiddleware, yG, (req, res) => yedeklemeController.varsayilanDosyaAdi(req, res));
router.get('/yedek/gecmis', authMiddleware, yG, (req, res) => yedeklemeController.gecmis(req, res));
router.post('/yedek/indir', authMiddleware, yD, (req, res) => yedeklemeController.indir(req, res));
router.post('/yedek/geri-yukle', authMiddleware, yD, yedekYukle.single('dosya'), (req, res) => yedeklemeController.geriYukle(req, res));

router.get('/sistem-ayarlari', authMiddleware, yG, (req, res) => sistemAyarlariController.getir(req, res));
router.put('/sistem-ayarlari', authMiddleware, yD, validateBySchema(sistemAyarlariGuncelleSchema), (req, res) =>
  sistemAyarlariController.guncelle(req, res)
);

router.get('/kullanicilar', authMiddleware, yK, (req, res) =>
  kullaniciController.listele(req, res)
);
router.get('/kullanicilar/siteler', authMiddleware, yK, (req, res) =>
  kullaniciController.siteler(req, res)
);
router.post('/kullanicilar', authMiddleware, yK, validateBySchema(kullaniciOlusturSchema), (req, res) =>
  kullaniciController.olustur(req, res)
);
router.put('/kullanicilar/:id', authMiddleware, yK, validateBySchema(kullaniciGuncelleSchema), (req, res) =>
  kullaniciController.guncelle(req, res)
);
router.delete('/kullanicilar/:id', authMiddleware, yK, (req, res) =>
  kullaniciController.sil(req, res)
);

router.get('/roller', authMiddleware, rolMiddleware('SUPER_ADMIN', 'AJANS_ADMIN'), (req, res) =>
  rolController.listele(req, res)
);
router.put('/roller', authMiddleware, rolMiddleware('SUPER_ADMIN'), validateBySchema(rolKaydetSchema), (req, res) =>
  rolController.kaydet(req, res)
);

export default router;
