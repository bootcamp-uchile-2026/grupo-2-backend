import { Controller, Get, Post, Param, ParseIntPipe, Query, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiCreatedResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CategoriesService } from './categories.service';
import { CategoryDto } from '../dto/category.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { UploadImageDto } from '../dto/upload-image.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../models/user.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {

    constructor(
        private readonly categoriesService: CategoriesService) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener categorías paginadas',
    })
    @ApiOkResponse({
        description: 'Listado paginado de categorías',
    })
    @ApiBadRequestResponse({
        description: 'Parámetros de paginación inválidos',
    })
    findAll(@Query() pagination: PaginationDto) {

        return this.categoriesService.findAll(pagination);
    }

    @Get(':categoryId')
    @ApiOperation({
        summary: 'Obtener detalle de una categoría',
    })
    @ApiParam({
        name: 'categoryId',
        type: Number,
        example: 9
    })
    @ApiOkResponse({
        type: CategoryDto
    })
    @ApiBadRequestResponse({
        description: 'Identificador inválido'
    })
    @ApiNotFoundResponse({
        description: 'Categoría no encontrada'
    })
    findOne(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<CategoryDto> {

        return this.categoriesService.findOne(categoryId);
    }

    @Post(':categoryId/image')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Cargar o reemplazar imagen de una categoría'
    })
    @ApiParam({
        name: 'categoryId', example: 9
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: UploadImageDto
    })
    @ApiCreatedResponse({
        type: CategoryDto
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
        description: 'Categoría no encontrada.'
    })
    @ApiResponse({
        status: 413,
        description: 'El archivo supera el tamaño permitido.'
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    }))
    uploadImage(@Param('categoryId', ParseIntPipe) categoryId: number, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 + 1 }),
            new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
    })) archivo: Express.Multer.File): Promise<CategoryDto> {

        return this.categoriesService.uploadImage(categoryId, archivo);
    }
}