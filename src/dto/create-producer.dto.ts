import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsBoolean, Equals, IsUrl } from 'class-validator';

export class CreateProducerDto {

    @ApiProperty({ example: 'emprendedor@buenorigen.test' })
    @IsEmail()
    @MaxLength(255)
    email: string;

    @ApiProperty({ example: 'ProducerTest2026!', minLength: 8, maxLength: 128, writeOnly: true })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(128)
    password: string;

    @ApiProperty({ example: 'Felipe' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    firstName: string;

    @ApiPropertyOptional({ example: 'González' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    lastName?: string;

    @ApiPropertyOptional({ example: '+56912345678' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;

    @ApiProperty({ example: 'EcoNatural' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    businessName: string;

    @ApiPropertyOptional({ example: 'Emprendimiento de productos sustentables.' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 'Santiago, Chile' })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    location?: string;

    @ApiPropertyOptional({ example: 'https://ejemplo.cl' })
    @IsOptional()
    @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
    @MaxLength(500)
    websiteUrl?: string;

    @ApiProperty({ example: true, description: 'Aceptación previa de la política de privacidad.' })
    @IsBoolean()
    @Equals(true, { message: 'Debe aceptar la política de privacidad.' })
    privacyAccepted: boolean;
}