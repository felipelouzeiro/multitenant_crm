import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/clients.service';
import { UserRole } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';

async function setupDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const usersService = app.get(UsersService);
  const clientsService = app.get(ClientsService);

  try {
    console.log('🔄 Verificando conexão com banco de dados...');
    
    // Verificar se as tabelas existem
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'clients')
    `);
    
    if (tables.length === 0) {
      console.log('📋 Tabelas não existem. Execute as migrações primeiro.');
      console.log('💡 Execute: npm run migration:run');
      return;
    }

    console.log('🗑️ Limpando dados existentes...');
    
    // Limpar dados existentes (se houver)
    try {
      await dataSource.query('DELETE FROM clients');
      await dataSource.query('DELETE FROM users');
    } catch (error) {
      console.log('⚠️ Erro ao limpar dados (pode ser normal se não existirem):', error.message);
    }
    
    console.log('👥 Criando usuários...');
    
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

    console.log('👥 Criando clientes...');
    
    // Criar clientes
    const clients = [
      // Tenant 1 - ACME
      {
        name: 'João Silva',
        email: 'joao.silva@acme.com',
        contact: '(11) 99999-1111',
        isActive: true,
        publicId: 'ACME-001',
        address: {
          street: 'Rua das Flores',
          neighborhood: 'Centro',
          number: '123',
          state: 'SP'
        },
        tenantId: 'tenant-1',
      },
      {
        name: 'Maria Santos',
        email: 'maria.santos@acme.com',
        contact: '(11) 99999-2222',
        isActive: true,
        publicId: 'ACME-002',
        address: {
          street: 'Av. Paulista',
          neighborhood: 'Bela Vista',
          number: '456',
          state: 'SP'
        },
        tenantId: 'tenant-1',
      },
      // Tenant 2 - GLOBEX
      {
        name: 'Pedro Costa',
        email: 'pedro.costa@globex.com',
        contact: '(21) 99999-3333',
        isActive: true,
        publicId: 'GLOBEX-001',
        address: {
          street: 'Rua do Comércio',
          neighborhood: 'Centro',
          number: '789',
          state: 'RJ'
        },
        tenantId: 'tenant-2',
      },
      {
        name: 'Ana Oliveira',
        email: 'ana.oliveira@globex.com',
        contact: '(21) 99999-4444',
        isActive: false,
        publicId: 'GLOBEX-002',
        address: {
          street: 'Av. Rio Branco',
          neighborhood: 'Centro',
          number: '321',
          state: 'RJ'
        },
        tenantId: 'tenant-2',
      },
      // Tenant 3 - INITECH
      {
        name: 'Carlos Lima',
        email: 'carlos.lima@initech.com',
        contact: '(31) 99999-5555',
        isActive: true,
        publicId: 'INITECH-001',
        address: {
          street: 'Rua da Liberdade',
          neighborhood: 'Savassi',
          number: '654',
          state: 'MG'
        },
        tenantId: 'tenant-3',
      },
    ];

    for (const clientData of clients) {
      await clientsService.create(clientData);
    }

    console.log('✅ Banco de dados configurado com sucesso!');
    console.log('');
    console.log('👤 Usuários criados:');
    console.log('  - admin@acme.com / admin123');
    console.log('  - admin@globex.com / admin123');
    console.log('  - admin@initech.com / admin123');
    console.log('');
    console.log('💡 Teste o multitenancy fazendo login com diferentes tenants!');

  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error.message);
    throw error;
  } finally {
    await app.close();
  }
}

setupDatabase();
