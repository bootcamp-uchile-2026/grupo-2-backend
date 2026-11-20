import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn } from 'class-validator';

export class StatisticsQueryDto {

    @ApiPropertyOptional({
        enum: ['day', 'month', 'year'],
        example: 'month',
        description: 'Periodo de consulta de los indicadores comerciales.',
    })
    @IsOptional()
    @IsIn(['day', 'month', 'year'])
    period?: 'day' | 'month' | 'year';
}