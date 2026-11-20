import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength, ValidateIf } from 'class-validator';

export class UpdateArticleDto {

    @ApiPropertyOptional({ example: 'Consejos para reducir residuos', maxLength: 200 })
    @ValidateIf((object, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title?: string;

    @ApiPropertyOptional({ example: 'Nuevas recomendaciones sustentables.', maxLength: 500, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    summary?: string | null;

    @ApiPropertyOptional({ example: 'Contenido actualizado del artículo.' })
    @ValidateIf((object, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    content?: string;
}