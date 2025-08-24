import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepository.create(createClientDto);
    return this.clientsRepository.save(client);
  }

  async findAll(tenantId: string): Promise<Client[]> {
    return this.clientsRepository.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: { id, tenantId },
    });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return client;
  }

  async update(id: string, updateClientDto: Partial<CreateClientDto>, tenantId: string): Promise<Client> {
    const client = await this.findOne(id, tenantId);
    Object.assign(client, updateClientDto);
    return this.clientsRepository.save(client);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const client = await this.findOne(id, tenantId);
    await this.clientsRepository.remove(client);
  }

  async getStats(tenantId: string): Promise<{ total: number; active: number }> {
    const [total, active] = await Promise.all([
      this.clientsRepository.count({ where: { tenantId } }),
      this.clientsRepository.count({ where: { tenantId, isActive: true } }),
    ]);

    return { total, active };
  }
}
