import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const HERO_VARSAYILAN = {
  gecisSuresiSn: 6,
  sliderDuzenlemeModu: 'ayni-sekme',
  sliderlar: [
    {
      id: 'slide-1',
      sira: 0,
      aktif: true,
      gorselUrl: '',
      baslik: 'Kurumsal Çözümler',
      altBaslik: 'Güzel Teknoloji',
      aciklama: 'İşletmeniz için güvenilir dijital altyapı ve danışmanlık hizmetleri.',
      stil: 'sol-alt',
      butonAktif: true,
      butonMetni: 'Hizmetlerimiz',
      butonLink: '/hakkimizda',
      butonKonum: 'sol-alt',
      butonRenk: '#7c3aed',
      butonYaziRenk: '#ffffff',
    },
  ],
  kartlarAktif: true,
  kartlar: [
    { id: 'k1', ikon: '🏢', baslik: 'Kurumsal Deneyim', aciklama: 'Yılların tecrübesi', sira: 0 },
    { id: 'k2', ikon: '🔒', baslik: 'Güvenilir Hizmet', aciklama: 'Profesyonel çözümler', sira: 1 },
    { id: 'k3', ikon: '💬', baslik: '7/24 Destek', aciklama: 'Uzman ekip yanınızda', sira: 2 },
    { id: 'k4', ikon: '✅', baslik: 'Memnuniyet', aciklama: 'Referans müşteriler', sira: 3 },
  ],
};

async function main() {
  let site = await prisma.site.findUnique({ where: { slug: 'demo' } });

  if (!site) {
    site = await prisma.site.create({
      data: {
        ad: 'Güzel Teknoloji',
        slug: 'demo',
        domain: 'localhost',
      },
    });
  } else {
    site = await prisma.site.update({
      where: { id: site.id },
      data: { ad: 'Güzel Teknoloji' },
    });
  }

  const mevcutAyarlar = await prisma.siteAyarlari.findUnique({ where: { siteId: site.id } });

  if (!mevcutAyarlar) {
    await prisma.siteAyarlari.create({
      data: {
        siteId: site.id,
        anaRenk: '#7c3aed',
        ikincilRenk: '#a78bfa',
        slogan: 'Teknolojinin en güzel hali — güvenilir kurumsal çözümler.',
        telifYazisi: `© ${new Date().getFullYear()} Güzel Teknoloji. Tüm hakları saklıdır.`,
        telefon: '+90 212 000 00 00',
        email: 'info@guzelteknoloji.com',
        adres: 'İstanbul, Türkiye',
        sosyalMedyaJson: {
          linkedin: 'https://linkedin.com/company/guzel-teknoloji',
          instagram: 'https://instagram.com/guzelteknoloji',
          linkedin_icon: 'solid',
          instagram_icon: 'brand',
        },
        heroJson: HERO_VARSAYILAN,
        seoBaslik: 'Güzel Teknoloji — Kurumsal Web Çözümleri',
        seoAciklama: 'Kurumsal tanıtım sitesi, içerik yönetimi ve dijital danışmanlık.',
      },
    });
  }

  const mevcutSistemAyari = await prisma.sistemAyari.findUnique({
    where: { siteId: site.id },
  });

  const sistemAyariVerisi = {
    bakimModu: false,
    bakimBaslik: 'Bakim Calismasi',
    bakimMesaji: 'Site gecici olarak bakimda. Lutfen daha sonra tekrar deneyin.',
    bakimGorselUrl: '',
    bakimTahminiSure: '',
    bakimIpBeyazListeJson: [],
    logSaklamaGun: 90,
    panelDili: 'tr',
    panelCevirilerJson: {},
    sayfa404Baslik: 'Sayfa Bulunamadi',
    sayfa404Mesaj: 'Aradiginiz sayfa tasinmis, silinmis veya hic var olmamis olabilir.',
    sayfa404GorselUrl: '',
    sayfa404MenuTipi: 'ust',
    sayfa404AnaSayfaButonu: true,
    sayfa404OneriSayfaId: null,
    otomatikYedekleme: false,
    otomatikYedeklemeGun: 7,
    guvenlikBasliklari: true,
    robotsEngelle: false,
    ekAyarlarJson: {
      yerelAyarlar: ['sekmePanelAyarlari', 'adminTema'],
      not: 'UI tercihlerinin bir kismi localStorage tarafinda tutulur.',
    },
  };

  if (mevcutSistemAyari) {
    await prisma.sistemAyari.update({
      where: { id: mevcutSistemAyari.id },
      data: sistemAyariVerisi,
    });
  } else {
    await prisma.sistemAyari.create({
      data: { siteId: site.id, ...sistemAyariVerisi },
    });
  }

  const sayfalar = [
    {
      baslik: 'Ana Sayfa',
      slug: 'ana-sayfa',
      sira: 0,
      icerik: '<p>Kurumsal tanıtım sitenize hoş geldiniz. İçeriği admin panelden düzenleyebilirsiniz.</p>',
    },
    {
      baslik: 'Hakkımızda',
      slug: 'hakkimizda',
      sira: 1,
      icerik: '<h2>Biz Kimiz?</h2><p>Güzel Teknoloji olarak kurumsal dijital çözümler sunuyoruz.</p>',
    },
    {
      baslik: 'Hizmetler',
      slug: 'hizmetler',
      sira: 2,
      icerik: '<h2>Hizmetlerimiz</h2><p>Web tasarım, içerik yönetimi ve teknik destek.</p>',
    },
    {
      baslik: 'İletişim',
      slug: 'iletisim',
      sira: 3,
      icerik: '<h2>Bize Ulaşın</h2><p>Form veya iletişim bilgilerimiz üzerinden yazabilirsiniz.</p>',
    },
  ];

  for (const sayfa of sayfalar) {
    const mevcut = await prisma.sayfa.findUnique({
      where: { siteId_slug: { siteId: site.id, slug: sayfa.slug } },
    });

    if (mevcut) {
      await prisma.sayfa.update({
        where: { id: mevcut.id },
        data: { menudeGoster: true, yayinda: true },
      });
    } else {
      await prisma.sayfa.create({
        data: { ...sayfa, siteId: site.id, yayinda: true, menudeGoster: true },
      });
    }
  }

  const mevcutForm = await prisma.formTanimi.findUnique({
    where: { siteId_slug: { siteId: site.id, slug: 'iletisim' } },
  });

  if (!mevcutForm) {
    await prisma.formTanimi.create({
      data: {
        siteId: site.id,
        ad: 'İletişim Formu',
        slug: 'iletisim',
        aciklama: 'Ziyaretçilerden gelen mesajlar',
        aktif: true,
        bildirimEmail: 'info@guzelteknoloji.com',
        alanlarJson: [
          { id: 'ad', tip: 'text', etiket: 'Ad Soyad', zorunlu: true },
          { id: 'email', tip: 'email', etiket: 'E-posta', zorunlu: true },
          { id: 'mesaj', tip: 'textarea', etiket: 'Mesajınız', zorunlu: true },
        ],
      },
    });
  }

  const mevcutBlog = await prisma.blogYazisi.findUnique({
    where: { siteId_slug: { siteId: site.id, slug: 'hos-geldiniz' } },
  });

  if (!mevcutBlog) {
    await prisma.blogYazisi.create({
      data: {
        siteId: site.id,
        baslik: 'Kurumsal Sitenize Hoş Geldiniz',
        slug: 'hos-geldiniz',
        ozet: 'Admin panelden içeriklerinizi kolayca yönetin.',
        icerik: '<p>Blog modülü ile haber ve duyurularınızı paylaşabilirsiniz.</p>',
        yayinda: true,
        yazar: 'Güzel Teknoloji',
      },
    });
  }

  const kisayollar = [
    {
      ad: 'Dashboard',
      kod: 'dashboard',
      tusKombinasyonu: 'Alt+1',
      deger: '/gt-admin',
      aciklama: 'Yonetim paneli ana ekranina hizli gecis yapar.',
      kategori: 'navigasyon',
      sira: 1,
      aktif: true,
    },
    {
      ad: 'Sayfalar',
      kod: 'sayfalar',
      tusKombinasyonu: 'Alt+2',
      deger: '/gt-admin/sayfalar',
      aciklama: 'Sayfa yonetimi ekranini acar.',
      kategori: 'navigasyon',
      sira: 2,
      aktif: true,
    },
    {
      ad: 'Medya',
      kod: 'medya',
      tusKombinasyonu: 'Alt+3',
      deger: '/gt-admin/medya',
      aciklama: 'Medya yonetimine hizli erisim saglar.',
      kategori: 'navigasyon',
      sira: 3,
      aktif: true,
    },
  ];

  for (const kisayol of kisayollar) {
    await prisma.kisayolAyari.upsert({
      where: { siteId_kod: { siteId: site.id, kod: kisayol.kod } },
      create: { siteId: site.id, ...kisayol },
      update: kisayol,
    });
  }

  const dashboardKisayol = await prisma.kisayolAyari.findUnique({
    where: { siteId_kod: { siteId: site.id, kod: 'dashboard' } },
  });
  const sayfalarKisayol = await prisma.kisayolAyari.findUnique({
    where: { siteId_kod: { siteId: site.id, kod: 'sayfalar' } },
  });

  const sekmeler = [
    {
      ad: 'Genel Bakis',
      kod: 'genel-bakis',
      tip: 'sayfa',
      yol: '/gt-admin',
      ikon: 'layout-dashboard',
      aciklama: 'Panel acilisinda gosterilecek varsayilan sekme.',
      kategori: 'yonetim',
      hedef: '_self',
      sira: 1,
      aktif: true,
      sabit: true,
      kisayolId: dashboardKisayol?.id ?? null,
      ekAyarlarJson: { rozet: 'ana', acilistaAc: true },
    },
    {
      ad: 'Sayfa Yonetimi',
      kod: 'sayfa-yonetimi',
      tip: 'sayfa',
      yol: '/gt-admin/sayfalar',
      ikon: 'files',
      aciklama: 'Icerik ve menu yonetimi icin sekme.',
      kategori: 'icerik',
      hedef: '_self',
      sira: 2,
      aktif: true,
      sabit: false,
      kisayolId: sayfalarKisayol?.id ?? null,
      ekAyarlarJson: { pinlenebilir: true },
    },
    {
      ad: 'Canli Site',
      kod: 'canli-site',
      tip: 'harici-link',
      yol: '/',
      ikon: 'external-link',
      aciklama: 'Siteyi yeni sekmede acar.',
      kategori: 'hizli-erisim',
      hedef: '_blank',
      sira: 3,
      aktif: true,
      sabit: false,
      kisayolId: null,
      ekAyarlarJson: { disLink: true },
    },
  ];

  for (const sekme of sekmeler) {
    await prisma.sekmeAyari.upsert({
      where: { siteId_kod: { siteId: site.id, kod: sekme.kod } },
      create: { siteId: site.id, ...sekme },
      update: sekme,
    });
  }

  const sifreHash = await bcrypt.hash('admin123', 10);
  const mevcutAdmin = await prisma.kullanici.findUnique({
    where: { email: 'admin@guzelteknoloji.com' },
  });

  if (!mevcutAdmin) {
    await prisma.kullanici.create({
      data: {
        email: 'admin@guzelteknoloji.com',
        sifreHash,
        ad: 'Demo Admin',
        rol: 'SUPER_ADMIN',
        siteId: site.id,
      },
    });
  }

  console.log('Seed tamamlandı.');
  console.log(`Demo site id: ${site.id}, slug: demo`);
  console.log('Admin: admin@guzelteknoloji.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
