import { FormRepository } from '../Infrastructure/repositories/FormRepository.js';
import { prisma } from '../Infrastructure/database/prismaClient.js';

const formRepo = new FormRepository();

export class BildirimService {
  async listele(siteId: number) {
    const [gonderimler, okunmamisSayi, sonLoglar] = await Promise.all([
      formRepo.sonGonderimler(siteId, 30),
      formRepo.okunmamisGonderimSayisi(siteId),
      prisma.adminLog.findMany({
        where: {
          siteId,
          olusturma: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
        orderBy: { olusturma: 'desc' },
        take: 10,
        select: {
          id: true,
          islem: true,
          modulId: true,
          kullaniciAd: true,
          olusturma: true,
        },
      }),
    ]);

    const formBildirimleri = gonderimler.map((g) => ({
      id: `form_${g.id}`,
      tip: 'form_gonderim' as const,
      baslik: g.okundu ? 'Form gönderimi' : 'Yeni form gönderimi',
      mesaj: `${g.form.ad} formundan yeni mesaj`,
      okundu: g.okundu,
      olusturma: g.olusturma.toISOString(),
      formId: String(g.form.id),
      gonderimId: String(g.id),
      link: '/gt-admin/formlar',
    }));

    const logBildirimleri = sonLoglar.map((l) => ({
      id: `log_${l.id}`,
      tip: 'sistem' as const,
      baslik: 'İçerik güncellendi',
      mesaj: `${l.kullaniciAd}: ${l.islem}`,
      okundu: true,
      olusturma: l.olusturma.toISOString(),
      link: '/gt-admin/loglar',
    }));

    const bildirimler = [...formBildirimleri, ...logBildirimleri].sort(
      (a, b) => new Date(b.olusturma).getTime() - new Date(a.olusturma).getTime()
    );

    return { bildirimler, okunmamisSayi };
  }

  async tumunuOkundu(siteId: number) {
    await formRepo.tumGonderimleriOkundu(siteId);
  }
}
