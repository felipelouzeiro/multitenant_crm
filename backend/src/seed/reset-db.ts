import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/clients.service';
import { UserRole } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';

async function resetDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const usersService = app.get(UsersService);
  const clientsService = app.get(ClientsService);

  try {
    console.log('🗑️ Limpando banco de dados...');
    
    // Limpar todas as tabelas
    await dataSource.query('DELETE FROM clients');
    await dataSource.query('DELETE FROM users');
    
    // Criar usuários
    const users = [
      {
        name: 'Administrador',
        email: 'admin@example.com',
        password: 'admin123',
        role: UserRole.ADMIN,
        tenantId: 'tenant-1',
      },
      {
        name: 'Usuário Normal',
        email: 'user@example.com',
        password: 'user123',
        role: UserRole.USER,
        tenantId: 'tenant-1',
      },
      {
        name: 'Convidado',
        email: 'guest@example.com',
        password: 'guest123',
        role: UserRole.GUEST,
        tenantId: 'tenant-1',
      },
    ];

    for (const userData of users) {
      await usersService.create(userData);
    }

    // Criar clientes
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
        tenantId: 'tenant-1',
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
        tenantId: 'tenant-1',
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

    console.log('✅ Reset do banco concluído!');
    console.log('👤 Usuários de teste:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User: user@example.com / user123');
    console.log('   Guest: guest@example.com / guest123');
  } catch (error) {
    console.error('❌ Erro ao resetar banco:', error.message);
  } finally {
    await app.close();
  }
}

resetDatabase();
