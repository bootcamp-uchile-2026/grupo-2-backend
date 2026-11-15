import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';

export class NewProductsQueryDto extends PaginationDto {

    @ApiPropertyOptional({
        default: 'createdAt',
        example: 'createdAt',
    })
    sortBy: string = 'createdAt';

    @ApiPropertyOptional({
        enum: ['ASC', 'DESC'],
        default: 'DESC',
    })
    sortDirection: 'ASC' | 'DESC' = 'DESC';
}