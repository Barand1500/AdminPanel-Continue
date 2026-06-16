import { prisma } from '../database/prismaClient.js';

export class YedeklemeRepository {
  async siteVerisiGetir(siteId: number) {
    return prisma.site.findUnique({
      where: { id: siteId },
      include: {
        siteAyarlari: true,
        sistemAyari: true,
        kullanicilar: true,
        sayfalar: true,
        widgetlar: true,
        medyalar: true,
        blogYazilari: true,
        formTanimlari: { include: { gonderimler: true } },
        kisayolAyarlari: true,
        sekmeAyarlari: true,
      },
    });
  }

  async loglariGetir(siteId: number) {
    return prisma.adminLog.findMany({
      where: { siteId },
      orderBy: { olusturma: 'asc' },
    });
  }

  async siteVeriTemizle(siteId: number) {
    await prisma.$transaction([
      prisma.formGonderim.deleteMany({ where: { form: { siteId } } }),
      prisma.formTanimi.deleteMany({ where: { siteId } }),
      prisma.widget.deleteMany({ where: { siteId } }),
      prisma.sayfa.deleteMany({ where: { siteId } }),
      prisma.medya.deleteMany({ where: { siteId } }),
      prisma.blogYazisi.deleteMany({ where: { siteId } }),
      prisma.adminLog.deleteMany({ where: { siteId } }),
      prisma.yedekKaydi.deleteMany({ where: { siteId } }),
      prisma.sekmeAyari.deleteMany({ where: { siteId } }),
      prisma.kisayolAyari.deleteMany({ where: { siteId } }),
      prisma.sistemAyari.deleteMany({ where: { siteId } }),
      prisma.rol.deleteMany({ where: { siteId } }),
      prisma.siteAyarlari.deleteMany({ where: { siteId } }),
      prisma.kullanici.deleteMany({ where: { siteId } }),
      prisma.site.deleteMany({ where: { id: siteId } }),
    ]);
  }
}
