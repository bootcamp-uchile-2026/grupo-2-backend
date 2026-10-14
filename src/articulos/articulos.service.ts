import { Injectable } from '@nestjs/common';
import { Article } from '../models/article.model';
import { ArticleSummaryDto } from '../dto/article-summary.dto';
import { ArticleDetailDto } from '../dto/article-detail.dto';
import { ArticleNotFoundError } from 'src/common/errors/article-not-found.error';

@Injectable()
export class ArticlesService {

    private readonly articles: Article[] = [
        {
            id: 1,
            title: 'Cinco formas de reducir residuos en el hogar',
            summary: 'Recomendaciones para adoptar hábitos más sustentables.',
            content:
                'Reducir los residuos comienza con pequeños cambios cotidianos, como reutilizar envases, preferir productos duraderos y separar materiales reciclables.',
            imageUrl: 'https://example.com/images/article-1.jpg',
            author: 'Equipo BuenOrigen',
            publishedAt: new Date('2026-10-01T12:00:00.000Z'),
        },
        {
            id: 2,
            title: 'La importancia de apoyar a emprendedores locales',
            summary: 'Conoce los beneficios del comercio local.',
            content:
                'Apoyar a emprendedores locales contribuye al desarrollo de las comunidades, favorece la economía regional y permite conocer productos con identidad propia.',
            imageUrl: 'https://example.com/images/article-2.jpg',
            author: 'Equipo BuenOrigen',
            publishedAt: new Date('2026-10-05T12:00:00.000Z'),
        },
    ];

    findAll(): ArticleSummaryDto[] {
        return this.articles
            .map((article) => this.toSummaryDto(article))
            .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    }

    findOne(articleId: number): ArticleDetailDto {
        const article = this.articles.find(
            (item) => item.id === articleId,
        );

        if (!article) {
            throw new ArticleNotFoundError();
        }

        return {
            ...this.toSummaryDto(article),
            content: article.content,
            author: article.author,
        };
    }

    private toSummaryDto(article: Article): ArticleSummaryDto {
        return {
            id: article.id,
            title: article.title,
            summary: article.summary,
            imageUrl: article.imageUrl,
            publishedAt: article.publishedAt.toISOString(),
        };
    }
}
