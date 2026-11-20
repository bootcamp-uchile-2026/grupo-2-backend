import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional, MinLength, MaxLength, ValidateIf, IsUrl } from 'class-validator';

export class UpdateProducerDto {

    @ApiPropertyOptional({ example: 'emprendedor@buenorigen.test' })
    @ValidateIf((object, value) => value !== undefined)
    @IsEmail()
    @MaxLength(255)
    email?: string;

    @ApiPropertyOptional({ example: 'NuevaClave1234!', writeOnly: true })
    @ValidateIf((object, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(128)
    password?: string;

    @ApiPropertyOptional({ example: 'Felipe' })
    @ValidateIf((object, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    firstName?: string;

    @ApiPropertyOptional({ example: 'González', type: String, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    lastName?: string | null;

    @ApiPropertyOptional({ example: '+56912345678', type: String, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string | null;

    @ApiPropertyOptional({ example: 'EcoNatural' })
    @ValidateIf((object, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    businessName?: string;

    @ApiPropertyOptional({ example: 'Productos amigables con el medioambiente.', type: String, nullable: true })
    @IsOptional()
    @IsString()
    description?: string | null;

    @ApiPropertyOptional({ example: 'Valparaíso, Chile', type: String, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    location?: string | null;

    @ApiPropertyOptional({ example: 'https://ejemplo.cl', type: String, nullable: true })
    @IsOptional()
    @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
    @MaxLength(500)
    websiteUrl?: string | null;
}