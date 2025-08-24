import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ClientsService } from '../clients/clients.service';

async function seedClients() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const clientsService = app.get(ClientsService);

  try {
    const clients = [
      {
        name: 'João Silva',
        email: 'joao.silva@example.com',
        isActive: true,
        contact: '(11) 99999-1111',
        address: {
          street: 'Rua das Flores',
          neighborhood: 'Centro',
          number: '123',
          state: 'SP'
        },
        imageUrl: 'https://example.com/joao.jpg',
        tenantId: 'tenant-1',
      },
      {
        name: 'Maria Santos',
        email: 'maria.santos@example.com',
        isActive: true,
        contact: '(11) 99999-2222',
        address: {
          street: 'Avenida Paulista',
          neighborhood: 'Bela Vista',
          number: '456',
          state: 'SP'
        },
        imageUrl: 'https://example.com/maria.jpg',
        tenantId: 'tenant-1',
      },
      {
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@example.com',
        isActive: false,
        contact: '(11) 99999-3333',
        address: {
          street: 'Rua Augusta',
          neighborhood: 'Consolação',
          number: '789',
          state: 'SP'
        },
        imageUrl: 'https://example.com/pedro.jpg',
        tenantId: 'tenant-2',
      },
      {
        name: 'Ana Costa',
        email: 'ana.costa@example.com',
        isActive: true,
        contact: '(11) 99999-4444',
        address: {
          street: 'Rua Oscar Freire',
          neighborhood: 'Jardins',
          number: '321',
          state: 'SP'
        },
        imageUrl: 'https://example.com/ana.jpg',
        tenantId: 'tenant-2',
      },
      {
        name: 'Carlos Ferreira',
        email: 'carlos.ferreira@example.com',
        isActive: true,
        contact: '(11) 99999-5555',
        address: {
          street: 'Rua Haddock Lobo',
          neighborhood: 'Cerqueira César',
          number: '654',
          state: 'SP'
        },
        imageUrl: 'https://example.com/carlos.jpg',
        tenantId: 'tenant-1',
      }
    ];

    for (const clientData of clients) {
      await clientsService.create(clientData);
    }

    console.log('Total de clientes criados:', clients.length);
  } catch (error) {
    console.error('Erro ao criar clientes:', error.message);
  } finally {
    await app.close();
  }
}

seedClients();
