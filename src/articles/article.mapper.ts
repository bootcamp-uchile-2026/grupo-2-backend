import { ArticleEntity } from '../models/article.entity';
import { ArticleSummaryDto } from '../dto/article-summary.dto';
import { ArticleDetailDto } from '../dto/article-detail.dto';
import { ManagedArticleDto } from '../dto/managed-article.dto';

export class ArticleMapper {

    static toSummaryDto(article: ArticleEntity): ArticleSummaryDto {
        return {
            id: article.id,
            title: article.title,
            summary: article.summary,
            coverFileId: article.coverFileId,
            publishedAt: article.publishedAt!.toISOString(),
        };
    }

    static toDetailDto(article: ArticleEntity): ArticleDetailDto {
        return {
            ...this.toSummaryDto(article),
            content: article.content,
            author: `${article.author.firstName} ${article.author.lastName ?? ''}`.trim(),
        };
    }

    static toManagedDto(article: ArticleEntity): ManagedArticleDto {
        return {
            id: article.id,
            title: article.title,
            summary: article.summary,
            content: article.content,
            authorId: article.authorId,
            author: `${article.author.firstName} ${article.author.lastName ?? ''}`.trim(),
            coverFileId: article.coverFileId,
            status: article.status,
            publishedAt: article.publishedAt?.toISOString() ?? null,
            createdAt: article.createdAt.toISOString(),
            updatedAt: article.updatedAt.toISOString(),
        };
    }
}