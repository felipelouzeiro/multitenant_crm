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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('clients')
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Criar cliente (ADMIN e USER)' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  create(@Body() createClientDto: CreateClientDto, @Req() req) {
    createClientDto.tenantId = req.user.tenantId;
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  findAll(@Req() req) {
    return this.clientsService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.clientsService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Atualizar cliente (ADMIN e USER)' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso' })
  update(
    @Param('id') id: string,
    @Body() updateClientDto: Partial<CreateClientDto>,
    @Req() req,
  ) {
    return this.clientsService.update(id, updateClientDto, req.user.tenantId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Remover cliente (ADMIN e USER)' })
  @ApiResponse({ status: 200, description: 'Cliente removido com sucesso' })
  remove(@Param('id') id: string, @Req() req) {
    return this.clientsService.remove(id, req.user.tenantId);
  }
}
