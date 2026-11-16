import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, Min, Max, ValidateIf } from 'class-validator';

export class UpdateReviewDto {

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 5,
        example: 4,
    })
    @ValidateIf((object, value) => value !== undefined)
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        example: 'Producto de muy buena calidad.',
    })
    @IsOptional()
    @IsString()
    comment?: string | null;
}