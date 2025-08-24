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
      // Tenant 1 - ACME
      {
        name: 'Admin ACME',
        email: 'admin@acme.com',
        password: 'admin123',
        role: UserRole.ADMIN,
        tenantId: 'tenant-1',
      },
      {
        name: 'User ACME',
        email: 'user@acme.com',
        password: 'user123',
        role: UserRole.USER,
        tenantId: 'tenant-1',
      },
      {
        name: 'Guest ACME',
        email: 'guest@acme.com',
        password: 'guest123',
        role: UserRole.GUEST,
        tenantId: 'tenant-1',
      },
      // Tenant 2 - GLOBEX
      {
        name: 'Admin GLOBEX',
        email: 'admin@globex.com',
        password: 'admin123',
        role: UserRole.ADMIN,
        tenantId: 'tenant-2',
      },
      {
        name: 'User GLOBEX',
        email: 'user@globex.com',
        password: 'user123',
        role: UserRole.USER,
        tenantId: 'tenant-2',
      },
      {
        name: 'Guest GLOBEX',
        email: 'guest@globex.com',
        password: 'guest123',
        role: UserRole.GUEST,
        tenantId: 'tenant-2',
      },
      // Tenant 3 - INITECH
      {
        name: 'Admin INITECH',
        email: 'admin@initech.com',
        password: 'admin123',
        role: UserRole.ADMIN,
        tenantId: 'tenant-3',
      },
      {
        name: 'User INITECH',
        email: 'user@initech.com',
        password: 'user123',
        role: UserRole.USER,
        tenantId: 'tenant-3',
      },
      {
        name: 'Guest INITECH',
        email: 'guest@initech.com',
        password: 'guest123',
        role: UserRole.GUEST,
        tenantId: 'tenant-3',
      },
    ];

    for (const userData of users) {
      await usersService.create(userData);
    }

    // Criar clientes
    const clients = [
      // Tenant 1 - ACME
      {
        name: 'João Silva',
        email: 'joao.silva@acme.com',
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
        email: 'maria.santos@acme.com',
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
        email: 'pedro.oliveira@acme.com',
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
      // Tenant 2 - GLOBEX
      {
        name: 'Ana Costa',
        email: 'ana.costa@globex.com',
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
        email: 'carlos.ferreira@globex.com',
        isActive: true,
        contact: '(11) 99999-5555',
        address: {
          street: 'Rua Haddock Lobo',
          neighborhood: 'Cerqueira César',
          number: '654',
          state: 'SP'
        },
        imageUrl: 'https://example.com/carlos.jpg',
        tenantId: 'tenant-2',
      },
      {
        name: 'Lucia Mendes',
        email: 'lucia.mendes@globex.com',
        isActive: true,
        contact: '(11) 99999-6666',
        address: {
          street: 'Rua Pamplona',
          neighborhood: 'Jardins',
          number: '987',
          state: 'SP'
        },
        imageUrl: 'https://example.com/lucia.jpg',
        tenantId: 'tenant-2',
      },
      // Tenant 3 - INITECH
      {
        name: 'Roberto Alves',
        email: 'roberto.alves@initech.com',
        isActive: true,
        contact: '(11) 99999-7777',
        address: {
          street: 'Rua Bela Cintra',
          neighborhood: 'Consolação',
          number: '555',
          state: 'SP'
        },
        imageUrl: 'https://example.com/roberto.jpg',
        tenantId: 'tenant-3',
      },
      {
        name: 'Fernanda Lima',
        email: 'fernanda.lima@initech.com',
        isActive: false,
        contact: '(11) 99999-8888',
        address: {
          street: 'Rua Teodoro Sampaio',
          neighborhood: 'Pinheiros',
          number: '777',
          state: 'SP'
        },
        imageUrl: 'https://example.com/fernanda.jpg',
        tenantId: 'tenant-3',
      }
    ];

    for (const clientData of clients) {
      await clientsService.create(clientData);
    }

    console.log('✅ Reset do banco concluído!');
    console.log('👤 Usuários de teste por Tenant:');
    console.log('');
    console.log('🏢 ACME (tenant-1):');
    console.log('   Admin: admin@acme.com / admin123');
    console.log('   User: user@acme.com / user123');
    console.log('   Guest: guest@acme.com / guest123');
    console.log('');
    console.log('🏢 GLOBEX (tenant-2):');
    console.log('   Admin: admin@globex.com / admin123');
    console.log('   User: user@globex.com / user123');
    console.log('   Guest: guest@globex.com / guest123');
    console.log('');
    console.log('🏢 INITECH (tenant-3):');
    console.log('   Admin: admin@initech.com / admin123');
    console.log('   User: user@initech.com / user123');
    console.log('   Guest: guest@initech.com / guest123');
  } catch (error) {
    console.error('❌ Erro ao resetar banco:', error.message);
  } finally {
    await app.close();
  }
}

resetDatabase();
