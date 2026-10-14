import { ApiProperty } from '@nestjs/swagger';

export class ArticleSummaryDto {
    @ApiProperty({
        example: 1,
        description: 'Identificador único del artículo.',
    })
    id: number;

    @ApiProperty({
        example: 'Cinco formas de reducir residuos en el hogar',
        description: 'Título público del artículo.',
    })
    title: string;

    @ApiProperty({
        example: 'Recomendaciones prácticas para reducir residuos.',
        description: 'Resumen del contenido.',
    })
    summary: string;

    @ApiProperty({
        example: 'https://example.com/images/article-1.jpg',
        description: 'URL de la imagen principal.',
    })
    imageUrl: string;

    @ApiProperty({
        example: '2026-10-01T12:00:00.000Z',
        description: 'Fecha de publicación en formato ISO 8601.',
        type: String,
        format: 'date-time',
    })
    publishedAt: string;
}
