import { ApiProperty } from '@nestjs/swagger';

export class ArticleSummaryDto {

    @ApiProperty({
        example: 6,
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
        type: String,
        nullable: true,
    })
    summary: string | null;

    @ApiProperty({
        description: 'Identificador del archivo de portada.',
        type: String,
        format: 'uuid',
        nullable: true,
        example: null,
    })
    coverFileId: string | null;

    @ApiProperty({
        example: '2026-10-25T21:50:34.408Z',
        description: 'Fecha de publicación en formato ISO 8601.',
        type: String,
        format: 'date-time',
    })
    publishedAt: string;
}
