import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { ReturnStatus } from '../models/return.entity';

export class ReturnQueryDto extends PaginationDto {

    @ApiPropertyOptional({
        enum: ReturnStatus,
        example: ReturnStatus.REQUESTED,
    })
    @IsOptional()
    @IsEnum(ReturnStatus)
    status?: ReturnStatus;
}