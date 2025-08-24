import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar usuário (apenas ADMIN)' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  create(@Body() createUserDto: CreateUserDto, @Req() req) {
    createUserDto.tenantId = req.user.tenantId;
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Listar usuários (ADMIN e USER)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  findAll(@Req() req) {
    return this.usersService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar usuário (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  update(@Param('id') id: string, @Body() updateUserDto: Partial<CreateUserDto>) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover usuário (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
