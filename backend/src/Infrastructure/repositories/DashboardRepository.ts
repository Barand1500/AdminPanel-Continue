import { prisma } from '../database/prismaClient.js';

export class DashboardRepository {
  async ozet(siteId: number) {
    const [
      sayfaSayisi,
      blogSayisi,
      formSayisi,
      medyaSayisi,
      widgetSayisi,
      yayindaSayfa,
      yayindaBlog,
      gonderimSayisi,
      okunmamisGonderim,
      sonBloglar,
      sonGonderimler,
    ] = await Promise.all([
      prisma.sayfa.count({ where: { siteId } }),
      prisma.blogYazisi.count({ where: { siteId } }),
      prisma.formTanimi.count({ where: { siteId } }),
      prisma.medya.count({ where: { siteId } }),
      prisma.widget.count({ where: { siteId } }),
      prisma.sayfa.count({ where: { siteId, yayinda: true } }),
      prisma.blogYazisi.count({ where: { siteId, yayinda: true } }),
      prisma.formGonderim.count({ where: { form: { siteId } } }),
      prisma.formGonderim.count({ where: { form: { siteId }, okundu: false } }),
      prisma.blogYazisi.findMany({
        where: { siteId },
        orderBy: { olusturma: 'desc' },
        take: 5,
        select: { id: true, baslik: true, yayinda: true, olusturma: true },
      }),
      prisma.formGonderim.findMany({
        where: { form: { siteId } },
        orderBy: { olusturma: 'desc' },
        take: 5,
        select: {
          id: true,
          okundu: true,
          olusturma: true,
          form: { select: { ad: true } },
        },
      }),
    ]);

    return {
      istatistikler: {
        sayfaSayisi,
        blogSayisi,
        formSayisi,
        medyaSayisi,
        widgetSayisi,
        gonderimSayisi,
        okunmamisGonderim,
        yayindaSayfa,
        yayindaBlog,
      },
      sonBloglar: sonBloglar.map((b) => ({
        id: String(b.id),
        baslik: b.baslik,
        yayinda: b.yayinda,
        olusturma: b.olusturma.toISOString(),
      })),
      sonGonderimler: sonGonderimler.map((g) => ({
        id: String(g.id),
        formAd: g.form.ad,
        okundu: g.okundu,
        olusturma: g.olusturma.toISOString(),
      })),
    };
  }
}
