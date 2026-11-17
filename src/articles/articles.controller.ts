import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam, ApiBadRequestResponse, ApiNotFoundResponse, ApiBearerAuth, ApiCreatedResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { ArticleDetailDto } from '../dto/article-detail.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { UpdateArticleStatusDto } from '../dto/update-article-status.dto';
import { ManagedArticleDto } from '../dto/managed-article.dto';
import { UserRole } from '../models/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadImageDto } from '../dto/upload-image.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {

    constructor(private readonly articlesService: ArticlesService) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener artículos del blog',
        description: 'Obtiene el listado paginado de artículos publicados del blog de BuenOrigen.',
    })
    @ApiOkResponse({
        description: 'Listado paginado de artículos publicados.'
    })
    @ApiBadRequestResponse({
        description: 'Parámetros de paginación u ordenamiento inválidos.'
    })
    findAll(@Query() pagination: PaginationDto) {
        return this.articlesService.findAll(pagination);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Crear un artículo como borrador'
    })
    @ApiBody({
        type: CreateArticleDto
    })
    @ApiCreatedResponse({
        type: ManagedArticleDto
    })
    @ApiBadRequestResponse({
        description: 'Datos del artículo inválidos.'
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.'
    })
    @ApiForbiddenResponse({
        description: 'Acceso no autorizado.'
    })
    create(@Body() dto: CreateArticleDto, @CurrentUser() user: { id: number; role: UserRole }): Promise<ManagedArticleDto> {
        return this.articlesService.create(dto, user.id);
    }

    @Post(':articleId/cover')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Cargar o reemplazar la portada de un artículo'
    })
    @ApiParam({
        name: 'articleId', example: 11
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: UploadImageDto
    })
    @ApiCreatedResponse({
        type: ManagedArticleDto
    })
    @ApiBadRequestResponse({
        description: 'Archivo o identificador inválido.'
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.'
    })
    @ApiForbiddenResponse({
        description: 'Acceso no autorizado.'
    })
    @ApiNotFoundResponse({
        description: 'Artículo no encontrado.'
    })
    @ApiResponse({
        status: 413,
        description: 'El archivo supera el tamaño permitido.'
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    }))
    uploadCover(@Param('articleId', ParseIntPipe) articleId: number, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 + 1 }),
            new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
    })) archivo: Express.Multer.File): Promise<ManagedArticleDto> {

        return this.articlesService.uploadCover(articleId, archivo);
    }

    @Get('manage')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Obtener listado administrativo de artículos'
    })
    @ApiOkResponse({
        description: 'Listado paginado de artículos de todos los estados.'
    })
    @ApiBadRequestResponse({
        description: 'Parámetros de consulta inválidos.'
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.'
    })
    @ApiForbiddenResponse({
        description: 'Acceso no autorizado.'
    })
    findManagedArticles(@Query() pagination: PaginationDto) {
        return this.articlesService.findManagedArticles(pagination);
    }

    @Get(':articleId/manage')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Consultar un artículo administrativamente'
    })
    @ApiParam({
        name: 'articleId',
        type: Number,
        example: 6
    })
    @ApiOkResponse({
        type: ManagedArticleDto
    })
    @ApiBadRequestResponse({
        description: 'Identificador inválido.'
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.'
    })
    @ApiForbiddenResponse({
        description: 'Acceso no autorizado.'
    })
    @ApiNotFoundResponse({
        description: 'Artículo no encontrado.'
    })
    findManagedArticle(@Param('articleId', ParseIntPipe) articleId: number): Promise<ManagedArticleDto> {
        return this.articlesService.findManagedArticle(articleId);
    }

    @Get(':articleId')
    @ApiOperation({
        summary: 'Obtener detalle de un artículo',
        description: 'Obtiene el contenido completo de un artículo publicado.',
    })
    @ApiParam({
        name: 'articleId',
        type: Number,
        example: 6,
        description: 'Identificador numérico positivo del artículo.'
    })
    @ApiOkResponse({
        description: 'Artículo obtenido correctamente.',
        type: ArticleDetailDto
    })
    @ApiBadRequestResponse({
        description: 'El identificador debe ser un número entero positivo.'
    })
    @ApiNotFoundResponse({ description: 'Artículo no encontrado.' })
    findOne(@Param('articleId', ParseIntPipe) articleId: number): Promise<ArticleDetailDto> {
        return this.articlesService.findOne(articleId);
    }

    @Patch(':articleId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Actualizar contenido de un artículo'
    })
    @ApiParam({
        name: 'articleId',
        type: Number,
        example: 6
    })
    @ApiBody({
        type: UpdateArticleDto
    })
    @ApiOkResponse({
        type: ManagedArticleDto
    })
    @ApiBadRequestResponse({
        description: 'Datos de actualización inválidos.'
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.'
    })
    @ApiForbiddenResponse({
        description: 'Acceso no autorizado.'
    })
    @ApiNotFoundResponse({
        description: 'Artículo no encontrado.'
    })
    update(@Param('articleId', ParseIntPipe) articleId: number, @Body() dto: UpdateArticleDto): Promise<ManagedArticleDto> {
        return this.articlesService.update(articleId, dto);
    }

    @Patch(':articleId/status')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Publicar, archivar o restaurar un artículo'
    })
    @ApiParam({
        name: 'articleId',
        type: Number,
        example: 6
    })
    @ApiBody({
        type: UpdateArticleStatusDto
    })
    @ApiOkResponse({
        type: ManagedArticleDto
    })
    @ApiBadRequestResponse({
        description: 'Estado inválido o transición no permitida.'
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.'
    })
    @ApiForbiddenResponse({
        description: 'Acceso no autorizado.'
    })
    @ApiNotFoundResponse({
        description: 'Artículo no encontrado.'
    })
    updateStatus(@Param('articleId', ParseIntPipe) articleId: number, @Body() dto: UpdateArticleStatusDto): Promise<ManagedArticleDto> {
        return this.articlesService.updateStatus(articleId, dto);
    }
}