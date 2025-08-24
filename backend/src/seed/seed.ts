import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Criar usuário admin
    await usersService.create({
      name: 'Administrador',
      email: 'admin@example.com',
      password: 'admin123',
      role: UserRole.ADMIN,
      tenantId: 'tenant-1',
    });

    // Criar usuário normal
    await usersService.create({
      name: 'Usuário Normal',
      email: 'user@example.com',
      password: 'user123',
      role: UserRole.USER,
      tenantId: 'tenant-1',
    });

    // Criar usuário guest
    await usersService.create({
      name: 'Convidado',
      email: 'guest@example.com',
      password: 'guest123',
      role: UserRole.GUEST,
      tenantId: 'tenant-1',
    });

    console.log('Usuários criados com sucesso!');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: user@example.com / user123');
    console.log('Guest: guest@example.com / guest123');
  } catch (error) {
    console.error('Erro ao criar usuários:', error.message);
  } finally {
    await app.close();
  }
}

seed();
