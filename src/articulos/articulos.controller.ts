import { Controller, Get, Param, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ArticlesService } from './articulos.service';
import { ArticleSummaryDto } from '../dto/article-summary.dto';
import { ArticleDetailDto } from '../dto/article-detail.dto';

@ApiTags('Artículos')
@Controller('articulos')
export class ArticlesController {

    constructor(private readonly articlesService: ArticlesService) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener artículos del blog',
        description:
            'Obtiene los artículos públicos del blog de BuenOrigen, ordenados desde el más reciente al más antiguo.',
    })
    @ApiOkResponse({
        description: 'Artículos obtenidos correctamente.',
        type: ArticleSummaryDto,
        isArray: true,
    })
    findAll(): ArticleSummaryDto[] {
        return this.articlesService.findAll();
    }

    @Get(':articleId')
    @ApiOperation({
        summary: 'Obtener detalle de un artículo',
        description:
            'Obtiene el contenido completo de un artículo del blog mediante su identificador.',
    })
    @ApiParam({
        name: 'articleId',
        type: Number,
        example: 1,
        description: 'Identificador numérico positivo del artículo.',
    })
    @ApiOkResponse({
        description: 'Artículo obtenido correctamente.',
        type: ArticleDetailDto,
    })
    @ApiBadRequestResponse({
        description: 'El identificador debe ser un número entero positivo.',
    })
    @ApiNotFoundResponse({
        description: 'Artículo no encontrado.',
    })
    findOne(
        @Param('articleId', ParseIntPipe) articleId: number,
    ): ArticleDetailDto {
        if (articleId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.',
            );
        }

        return this.articlesService.findOne(articleId);
    }
}
