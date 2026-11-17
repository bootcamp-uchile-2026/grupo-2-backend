import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FileResponseDto } from '../dto/file-response.dto';

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
}