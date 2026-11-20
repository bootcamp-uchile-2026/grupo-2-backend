import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional, MinLength, MaxLength, ValidateIf } from 'class-validator';

export class UpdateCustomerDto {

    @ApiPropertyOptional({
        example: 'cliente@correo.com',
    })
    @ValidateIf((object, value) => value !== undefined)
    @IsEmail()
    @MaxLength(255)
    email?: string;

    @ApiPropertyOptional({
        example: 'NuevaClave1234!',
        writeOnly: true,
    })
    @ValidateIf((object, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(128)
    password?: string;

    @ApiPropertyOptional({
        example: 'Javiera',
    })
    @ValidateIf((object, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    firstName?: string;

    @ApiPropertyOptional({
        example: 'Soto',
        type: String,
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    lastName?: string | null;

    @ApiPropertyOptional({
        example: '+56912345678',
        type: String,
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string | null;
}
