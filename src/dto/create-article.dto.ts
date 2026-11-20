import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateArticleDto {

    @ApiProperty({ example: 'Cinco formas de reducir residuos en el hogar', maxLength: 200 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title: string;

    @ApiPropertyOptional({ example: 'Recomendaciones para reducir residuos.', maxLength: 500, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    summary?: string | null;

    @ApiProperty({ example: 'La reducción de residuos comienza con pequeños cambios...' })
    @IsString()
    @IsNotEmpty()
    content: string;
}