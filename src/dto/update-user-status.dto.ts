import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateUserStatusDto {

    @ApiProperty({ example: false, description: 'Estado activo o inactivo del usuario.' })
    @IsBoolean()
    isActive: boolean;
}