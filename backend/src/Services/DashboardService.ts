import { DashboardRepository } from '../Infrastructure/repositories/DashboardRepository.js';

const dashboardRepo = new DashboardRepository();

export class DashboardService {
  async ozet(siteId: number) {
    return dashboardRepo.ozet(siteId);
  }
}
