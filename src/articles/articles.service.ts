
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { ArticleEntity, ArticleStatus } from '../models/article.entity';
import { ArticleDetailDto } from '../dto/article-detail.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { ArticleNotFoundError } from '../common/errors/article-not-found.error';
import { ArticleMapper } from './article.mapper';

@Injectable()
export class ArticlesService {

    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>) {}

    async findAll(pagination: PaginationDto) {

        const { page, size, sortBy, sortDirection } = pagination;

        const allowedSortFields = ['id', 'title', 'publishedAt', 'createdAt'];

        if (!allowedSortFields.includes(sortBy)) {
            throw new BadRequestException('Campo de ordenamiento inválido.')}

        const where = {
            status: ArticleStatus.PUBLISHED,
            publishedAt: LessThanOrEqual(new Date())};

        const articles = await this.articleRepository.find({
            where,
            skip: page * size,
            take: size,
            order: {
                [sortBy]: sortDirection,
                id: sortBy === 'id' ? sortDirection : 'ASC',
            },
        });

        const totalElements = await this.articleRepository.count({ where });

        return {
            content: articles.map(article => ArticleMapper.toSummaryDto(article)),
            page,
            size,
            totalElements,
            totalPages: Math.ceil(totalElements / size),
            sortBy,
            sortDirection,
        };
    }

    async findOne(articleId: number): Promise<ArticleDetailDto> {

        if (articleId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.',
            );
        }
        const article = await this.articleRepository.findOne({
            where: {
                id: articleId,
                status: ArticleStatus.PUBLISHED,
                publishedAt: LessThanOrEqual(new Date()),
            },
            relations: {
                author: true,
            },
        });

        if (!article) {
            throw new ArticleNotFoundError();
        }

        return ArticleMapper.toDetailDto(article);
    }
}
