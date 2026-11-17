import { ApiProperty } from '@nestjs/swagger';
import { ArticleStatus } from '../models/article.entity';

export class ManagedArticleDto {

    @ApiProperty({ example: 6 })
    id: number;

    @ApiProperty({ example: 'Cinco formas de reducir residuos en el hogar' })
    title: string;

    @ApiProperty({ type: String, nullable: true })
    summary: string | null;

    @ApiProperty({ example: 'La reducción de residuos comienza con pequeños cambios...' })
    content: string;

    @ApiProperty({ example: 15 })
    authorId: number;

    @ApiProperty({ example: 'Administrador BuenOrigen' })
    author: string;

    @ApiProperty({ type: String, format: 'uuid', nullable: true })
    coverFileId: string | null;

    @ApiProperty({ enum: ArticleStatus, example: ArticleStatus.DRAFT })
    status: ArticleStatus;

    @ApiProperty({ type: String, format: 'date-time', nullable: true })
    publishedAt: string | null;

    @ApiProperty({ type: String, format: 'date-time' })
    createdAt: string;

    @ApiProperty({ type: String, format: 'date-time' })
    updatedAt: string;
}