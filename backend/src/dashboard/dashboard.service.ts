import { Injectable } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class DashboardService {
  constructor(private readonly clientsService: ClientsService) {}

  async getStats(tenantId: string) {
    return this.clientsService.getStats(tenantId);
  }
}
