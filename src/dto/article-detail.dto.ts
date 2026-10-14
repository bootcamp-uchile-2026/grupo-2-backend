import { ApiProperty } from '@nestjs/swagger';
import { ArticleSummaryDto } from './article-summary.dto';

export class ArticleDetailDto extends ArticleSummaryDto {

    @ApiProperty({
        example: 'La reducción de residuos comienza con pequeños cambios...',
        description: 'Contenido completo del artículo.',
    })
    content: string;

    @ApiProperty({
        example: 'Equipo BuenOrigen',
        description: 'Autor del artículo.',
    })
    author: string;
}
