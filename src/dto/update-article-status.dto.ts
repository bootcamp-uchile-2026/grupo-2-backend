import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ArticleStatus } from '../models/article.entity';

export class UpdateArticleStatusDto {

    @ApiProperty({ enum: ArticleStatus, example: ArticleStatus.PUBLISHED })
    @IsEnum(ArticleStatus)
    status: ArticleStatus;
}