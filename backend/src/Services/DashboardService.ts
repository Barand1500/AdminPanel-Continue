import { DashboardRepository, gecerliDonem } from '../Infrastructure/repositories/DashboardRepository.js';
import type { DashboardDonem } from '../Infrastructure/repositories/dashboardAnalitikYardimci.js';

const dashboardRepo = new DashboardRepository();

export class DashboardService {
  async ozet(siteId: number, donem?: DashboardDonem) {
    return dashboardRepo.ozet(siteId, donem);
  }
}

export { gecerliDonem };
