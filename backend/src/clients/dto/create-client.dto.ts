import { IsEmail, IsString, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AddressDto {
  @ApiProperty({ example: 'Rua das Flores' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'Centro' })
  @IsString()
  neighborhood: string;

  @ApiProperty({ example: '123' })
  @IsString()
  number: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  state: string;
}

export class CreateClientDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'joao@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: '(11) 99999-9999' })
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 'tenant-123', required: false })
  @IsString()
  @IsOptional()
  tenantId?: string;
}
