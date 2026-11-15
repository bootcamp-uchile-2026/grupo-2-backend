import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

export class CreateAddressDto {

    @ApiPropertyOptional({
        description: 'Nombre identificativo de la dirección.',
        example: 'Casa',
        nullable: true})
    @IsOptional()
    @IsString()
    @MaxLength(50)
    label?: string | null;

    @ApiProperty({
        description: 'Nombre de la persona que recibirá el pedido.',
        example: 'María González'})
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    recipientName: string;

    @ApiProperty({
        description: 'Teléfono de contacto del destinatario.',
        example: '+56912345678'})
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    recipientPhone: string;

    @ApiProperty({
        description: 'Nombre de la calle o avenida.',
        example: 'Avenida Providencia'})
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    street: string;

    @ApiProperty({
        description: 'Número de la dirección.',
        example: '1234'})
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    streetNumber: string;

    @ApiPropertyOptional({
        description: 'Departamento u oficina.',
        example: '502',
        nullable: true})
    @IsOptional()
    @IsString()
    @MaxLength(30)
    apartment?: string | null;

    @ApiProperty({
        description: 'Comuna de despacho.',
        example: 'Providencia'})
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    commune: string;

    @ApiProperty({
        description: 'Región de despacho.',
        example: 'Metropolitana de Santiago'})
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    region: string;

    @ApiPropertyOptional({
        description: 'Información adicional para facilitar la entrega.',
        example: 'Entregar en conserjería.',
        nullable: true})
    @IsOptional()
    @IsString()
    @MaxLength(255)
    reference?: string | null;

    @ApiPropertyOptional({
        description: 'Indica si será la dirección predeterminada.',
        example: true})
    @ValidateIf((_, value) => value !== undefined)
    @IsBoolean()
    isDefault?: boolean;
}