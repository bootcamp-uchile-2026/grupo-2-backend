import { Controller, Get, Param, ParseUUIDPipe, StreamableFile, UseGuards, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiBearerAuth, ApiUnauthorizedResponse, ApiProduces } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FileResponseDto } from '../dto/file-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../models/user.entity';

@ApiTags('Files')
@Controller('files')
export class FilesController {

    constructor(private readonly filesService: FilesService) { }

    @Get(':fileId')
    @ApiOperation({
        summary: 'Consultar la URL de una imagen pública'
    })
    @ApiParam({
        name: 'fileId',
        type: String,
        format: 'uuid'
    })
    @ApiOkResponse({
        type: FileResponseDto
    })
    @ApiBadRequestResponse({
        description: 'Identificador inválido.'
    })
    @ApiNotFoundResponse({
        description: 'Imagen no encontrada.'
    })
    findPublicFile(@Param('fileId', ParseUUIDPipe) fileId: string): Promise<FileResponseDto> {

        return this.filesService.findPublicFile(fileId);
    }

    @Get(':fileId/content')
    @Header('Cache-Control', 'no-store')
    @ApiOperation({
        summary: 'Visualizar la portada de un artículo publicado'
    })
    @ApiParam({
        name: 'fileId',
        type: String,
        format: 'uuid'
    })
    @ApiProduces('image/jpeg', 'image/png', 'image/webp')
    @ApiOkResponse({
        description: 'Contenido de la imagen.',
        schema: { type: 'string', format: 'binary' }
    })
    @ApiBadRequestResponse({
        description: 'Identificador inválido.'
    })
    @ApiNotFoundResponse({
        description: 'Imagen no encontrada.'
    })
    async readPublicContent(@Param('fileId', ParseUUIDPipe) fileId: string): Promise<StreamableFile> {

        const file = await this.filesService.readPublicContent(fileId);

        return new StreamableFile(file.content, {
            type: file.mimeType,
            disposition: 'inline',
        });
    }

    @Get(':fileId/private')
    @Header('Cache-Control', 'no-store')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Visualizar una imagen privada autorizada'
    })
    @ApiParam({
        name: 'fileId',
        type: String,
        format: 'uuid'
    })
    @ApiProduces('image/jpeg', 'image/png', 'image/webp')
    @ApiOkResponse({
        description: 'Contenido de la imagen.',
        schema: { type: 'string', format: 'binary' }
    })
    @ApiBadRequestResponse({
        description: 'Identificador inválido.'
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.'
    })
    @ApiNotFoundResponse({
        description: 'Imagen no encontrada o acceso no autorizado.'
    })
    async readPrivateContent(@Param('fileId', ParseUUIDPipe) fileId: string, @CurrentUser() user: { id: number; role: UserRole }): Promise<StreamableFile> {

        const file = await this.filesService.readPrivateContent(fileId, user.id, user.role);

        return new StreamableFile(file.content, {
            type: file.mimeType,
            disposition: 'inline',
        });
    }
}