
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { ArticleEntity, ArticleStatus } from '../models/article.entity';
import { ArticleDetailDto } from '../dto/article-detail.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { ArticleNotFoundError } from '../common/errors/article-not-found.error';
import { ArticleMapper } from './article.mapper';
import { CreateArticleDto } from 'src/dto/create-article.dto';
import { ManagedArticleDto } from 'src/dto/managed-article.dto';
import { UpdateArticleDto } from 'src/dto/update-article.dto';
import { UpdateArticleStatusDto } from 'src/dto/update-article-status.dto';

@Injectable()
export class ArticlesService {

    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>) { }

    async create(dto: CreateArticleDto, authorId: number): Promise<ManagedArticleDto> {

        const title = dto.title.trim();
        const content = dto.content.trim();

        if (!title || !content) {
            throw new BadRequestException('El título y contenido son obligatorios.');
        }

        const article = this.articleRepository.create({
            authorId,
            title,
            summary: dto.summary?.trim() || null,
            content,
            coverFileId: null,
            status: ArticleStatus.DRAFT,
            publishedAt: null,
        });

        const savedArticle = await this.articleRepository.save(article);

        return this.findManagedArticle(savedArticle.id);
    }

    async findAll(pagination: PaginationDto) {

        const { page, size, sortBy, sortDirection } = pagination;

        const allowedSortFields = ['id', 'title', 'publishedAt', 'createdAt'];

        if (!allowedSortFields.includes(sortBy)) {
            throw new BadRequestException('Campo de ordenamiento inválido.')
        }

        const where = {
            status: ArticleStatus.PUBLISHED,
            publishedAt: LessThanOrEqual(new Date())
        };

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

    async findManagedArticle(articleId: number): Promise<ManagedArticleDto> {

        if (articleId <= 0) {
            throw new BadRequestException('El identificador debe ser un número entero positivo.');
        }

        const article = await this.articleRepository.findOne({
            where: {
                id: articleId,
            },
            relations: {
                author: true,
            },
        });

        if (!article) {
            throw new ArticleNotFoundError();
        }

        return ArticleMapper.toManagedDto(article);
    }

    async findManagedArticles(pagination: PaginationDto) {

        const { page, size, sortBy, sortDirection } = pagination;

        const allowedSortFields = ['id', 'title', 'status', 'publishedAt', 'createdAt', 'updatedAt'];

        if (!allowedSortFields.includes(sortBy)) {
            throw new BadRequestException('Campo de ordenamiento inválido.');
        }

        const articles = await this.articleRepository.find({
            relations: {
                author: true,
            },
            skip: page * size,
            take: size,
            order: {
                [sortBy]: sortDirection,
                id: sortBy === 'id' ? sortDirection : 'ASC',
            },
        });

        const totalElements = await this.articleRepository.count();

        return {
            content: articles.map(article => ArticleMapper.toManagedDto(article)),
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

    async update(articleId: number, dto: UpdateArticleDto): Promise<ManagedArticleDto> {

        await this.findManagedArticle(articleId);

        if (Object.keys(dto).length === 0) {
            throw new BadRequestException('Debe proporcionar al menos un campo para actualizar.');
        }

        if (dto.title !== undefined && !dto.title.trim()) {
            throw new BadRequestException('El título no puede estar vacío.');
        }

        if (dto.content !== undefined && !dto.content.trim()) {
            throw new BadRequestException('El contenido no puede estar vacío.');
        }

        await this.articleRepository.update(articleId, {
            ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
            ...(dto.summary !== undefined ? { summary: dto.summary?.trim() || null } : {}),
            ...(dto.content !== undefined ? { content: dto.content.trim() } : {}),
            updatedAt: new Date(),
        });

        return this.findManagedArticle(articleId);
    }

    async updateStatus(articleId: number, dto: UpdateArticleStatusDto): Promise<ManagedArticleDto> {

        const article = await this.findManagedArticle(articleId);

        if (article.status === dto.status) {
            return article;
        }

        const allowedTransitions = {
            [ArticleStatus.DRAFT]: [ArticleStatus.PUBLISHED, ArticleStatus.ARCHIVED],
            [ArticleStatus.PUBLISHED]: [ArticleStatus.ARCHIVED],
            [ArticleStatus.ARCHIVED]: [ArticleStatus.DRAFT],
        };

        if (!allowedTransitions[article.status].includes(dto.status)) {
            throw new BadRequestException('La transición de estado no está permitida.');
        }

        const now = new Date();

        await this.articleRepository.update(articleId, {
            status: dto.status,
            publishedAt: dto.status === ArticleStatus.PUBLISHED ? now : dto.status === ArticleStatus.DRAFT ? null : article.publishedAt ? new Date(article.publishedAt) : null,
            updatedAt: now,
        });

        return this.findManagedArticle(articleId);
    }
}
