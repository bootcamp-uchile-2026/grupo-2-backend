import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { ArticleDetailDto } from '../dto/article-detail.dto';
import { PaginationDto } from '../dto/pagination.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {

    constructor(private readonly articlesService: ArticlesService) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener artículos del blog',
        description:
            'Obtiene el listado paginado de artículos publicados del blog de BuenOrigen.',
    })
    @ApiOkResponse({
        description: 'Listado paginado de artículos publicados.',
    })
    @ApiBadRequestResponse({
        description: 'Parámetros de paginación u ordenamiento inválidos.',
    })
    findAll(@Query() pagination: PaginationDto) {
        return this.articlesService.findAll(pagination);
    }

    @Get(':articleId')
    @ApiOperation({
        summary: 'Obtener detalle de un artículo',
        description:
            'Obtiene el contenido completo de un artículo publicado.',
    })
    @ApiParam({
        name: 'articleId',
        type: Number,
        example: 6,
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
    findOne(@Param('articleId', ParseIntPipe) articleId: number): Promise<ArticleDetailDto> {
        return this.articlesService.findOne(articleId);
    }
}
