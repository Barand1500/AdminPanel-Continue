import type { Prisma } from '@prisma/client';
import { prisma } from '../database/prismaClient.js';

export class FormRepository {
  async findAdminBySiteId(siteId: number) {
    return prisma.formTanimi.findMany({
      where: { siteId },
      orderBy: [{ olusturma: 'desc' }],
      include: { _count: { select: { gonderimler: true } } },
    });
  }

  async findByIdAndSiteId(id: number, siteId: number) {
    return prisma.formTanimi.findFirst({
      where: { id, siteId },
      include: { gonderimler: { orderBy: { olusturma: 'desc' } } },
    });
  }

  async createForSite(siteId: number, data: Omit<Prisma.FormTanimiUncheckedCreateInput, 'siteId'>) {
    return prisma.formTanimi.create({ data: { ...data, siteId } });
  }

  async updateForSite(id: number, data: Prisma.FormTanimiUpdateInput) {
    return prisma.formTanimi.update({ where: { id }, data });
  }

  async deleteForSite(id: number, siteId: number) {
    return prisma.formTanimi.deleteMany({ where: { id, siteId } });
  }

  async countBySiteId(siteId: number) {
    return prisma.formTanimi.count({ where: { siteId } });
  }

  async gonderimleriGetir(formId: number, siteId: number) {
    const form = await prisma.formTanimi.findFirst({ where: { id: formId, siteId } });
    if (!form) return null;
    return prisma.formGonderim.findMany({
      where: { formId },
      orderBy: { olusturma: 'desc' },
    });
  }

  async gonderimOkundu(id: number, formId: number) {
    return prisma.formGonderim.updateMany({
      where: { id, formId },
      data: { okundu: true },
    });
  }

  async gonderimSil(id: number, formId: number) {
    return prisma.formGonderim.deleteMany({ where: { id, formId } });
  }

  async okunmamisGonderimSayisi(siteId: number) {
    return prisma.formGonderim.count({
      where: { form: { siteId }, okundu: false },
    });
  }

  async toplamGonderimSayisi(siteId: number) {
    return prisma.formGonderim.count({
      where: { form: { siteId } },
    });
  }
}
