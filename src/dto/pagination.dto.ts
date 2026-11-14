import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, IsIn, IsOptional, Min, Max } from 'class-validator';

export class PaginationDto {

    @ApiPropertyOptional({
        description: 'Número de página',
        default: 0,
        example: 0,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    page: number = 0;

    @ApiPropertyOptional({
        description: 'Cantidad de registros por página',
        default: 20,
        example: 20,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    size: number = 20;

    @ApiPropertyOptional({
        description: 'Campo de ordenamiento',
        default: 'id',
        example: 'id',
    })
    @IsOptional()
    @IsString()
    sortBy: string = 'id';

    @ApiPropertyOptional({
        description: 'Dirección del ordenamiento',
        enum: ['ASC', 'DESC'],
        default: 'ASC',
    })
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortDirection: 'ASC' | 'DESC' = 'ASC';
}