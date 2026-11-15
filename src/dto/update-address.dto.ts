import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

export class UpdateAddressDto {

    @ApiPropertyOptional({
        description: 'Nombre identificativo de la dirección.',
        example: 'Trabajo',
        nullable: true})
    @IsOptional()
    @IsString()
    @MaxLength(50)
    label?: string | null;

    @ApiPropertyOptional({
        description: 'Nombre de la persona que recibirá el pedido.',
        example: 'María González'})
    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    recipientName?: string;

    @ApiPropertyOptional({
        description: 'Teléfono de contacto del destinatario.',
        example: '+56987654321'})
    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    recipientPhone?: string;

    @ApiPropertyOptional({
        description: 'Nombre de la calle o avenida.',
        example: 'Avenida Providencia'})
    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    street?: string;

    @ApiPropertyOptional({
        description: 'Número de la dirección.',
        example: '1500'})
    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    streetNumber?: string;

    @ApiPropertyOptional({
        description: 'Departamento u oficina.',
        example: '604',
        nullable: true})
    @IsOptional()
    @IsString()
    @MaxLength(30)
    apartment?: string | null;

    @ApiPropertyOptional({
        description: 'Comuna de despacho.',
        example: 'Providencia'})
    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    commune?: string;

    @ApiPropertyOptional({
        description: 'Región de despacho.',
        example: 'Metropolitana de Santiago'})
    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    region?: string;

    @ApiPropertyOptional({
        description: 'Información adicional para facilitar la entrega.',
        example: 'Llamar antes de entregar.',
        nullable: true})
    @IsOptional()
    @IsString()
    @MaxLength(255)
    reference?: string | null;
}