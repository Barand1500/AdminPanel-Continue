import { prisma } from '../database/prismaClient.js';
import {
  donemBaslangic,
  formGonderimGrafik,
  gecerliDonem,
  type DashboardDonem,
} from './dashboardAnalitikYardimci.js';

export class DashboardRepository {
  async ozet(siteId: number, donem?: DashboardDonem) {
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

    const sonuc: {
      istatistikler: {
        sayfaSayisi: number;
        blogSayisi: number;
        formSayisi: number;
        medyaSayisi: number;
        widgetSayisi: number;
        gonderimSayisi: number;
        okunmamisGonderim: number;
        yayindaSayfa: number;
        yayindaBlog: number;
      };
      sonBloglar: { id: string; baslik: string; yayinda: boolean; olusturma: string }[];
      sonGonderimler: { id: string; formAd: string; okundu: boolean; olusturma: string }[];
      analitik?: Awaited<ReturnType<DashboardRepository['analitik']>>;
    } = {
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

    if (donem) {
      sonuc.analitik = await this.analitik(siteId, donem);
    }

    return sonuc;
  }

  async analitik(siteId: number, donem: DashboardDonem) {
    const baslangic = donemBaslangic(donem);

    const [donemGonderimleri, donemGonderimSayisi, sayfalar, widgetGruplari] = await Promise.all([
      prisma.formGonderim.findMany({
        where: { form: { siteId }, olusturma: { gte: baslangic } },
        select: { olusturma: true },
      }),
      prisma.formGonderim.count({
        where: { form: { siteId }, olusturma: { gte: baslangic } },
      }),
      prisma.sayfa.findMany({
        where: { siteId },
        orderBy: [{ yayinda: 'desc' }, { sira: 'asc' }],
        take: 8,
        select: {
          baslik: true,
          _count: { select: { widgetlar: true } },
        },
      }),
      prisma.widget.groupBy({
        by: ['tip'],
        where: { siteId, aktif: true },
        _count: { tip: true },
      }),
    ]);

    return {
      donem,
      donemGonderimSayisi,
      formGrafik: formGonderimGrafik(
        donemGonderimleri.map((g) => g.olusturma),
        donem
      ),
      sayfalar: sayfalar.map((s) => ({
        ad: s.baslik,
        widgetSayisi: s._count.widgetlar,
      })),
      widgetDagilimi: widgetGruplari
        .map((w) => ({
          tip: w.tip,
          adet: w._count.tip,
        }))
        .sort((a, b) => b.adet - a.adet)
        .slice(0, 8),
    };
  }
}

export { gecerliDonem };
