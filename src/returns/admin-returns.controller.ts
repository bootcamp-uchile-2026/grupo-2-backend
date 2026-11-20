import {Body,Controller,Get,Param,ParseIntPipe,Patch, Query,UseGuards} from '@nestjs/common';
import {ApiTags,ApiBearerAuth,ApiOperation,ApiParam,ApiOkResponse,ApiBadRequestResponse,ApiUnauthorizedResponse,ApiForbiddenResponse,ApiNotFoundResponse,ApiConflictResponse} from '@nestjs/swagger';
import { ReturnsService } from './returns.service';
import { ReturnQueryDto } from '../dto/return-query.dto';
import { ReturnResponseDto } from '../dto/return-response.dto';
import { UpdateReturnStatusDto } from '../dto/update-return-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

import { UserRole } from '../models/user.entity';

@ApiTags('Admin Returns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('returns')
export class AdminReturnsController {

    constructor(
        private readonly returnsService: ReturnsService) { }

    @Get()
    @ApiOperation({
        summary: 'Consultar todas las devoluciones',
    })
    @ApiOkResponse({
        description: 'Listado paginado de devoluciones.',
    })
    @ApiBadRequestResponse({
        description: 'Parámetros de consulta inválidos.',
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.',
    })
    @ApiForbiddenResponse({
        description: 'Acceso exclusivo para administradores.',
    })
    findAll(@Query() query: ReturnQueryDto) {

        return this.returnsService.findAllByAdmin(query);
    }

    @Get(':returnId')
    @ApiOperation({
        summary: 'Consultar el detalle de una devolución',
    })
    @ApiParam({
        name: 'returnId',
        example: 1,
    })
    @ApiOkResponse({
        type: ReturnResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Identificador inválido.',
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.',
    })
    @ApiForbiddenResponse({
        description: 'Acceso exclusivo para administradores.',
    })
    @ApiNotFoundResponse({
        description: 'Devolución no encontrada.',
    })
    findOne(@Param('returnId', ParseIntPipe) returnId: number): Promise<ReturnResponseDto> {
        return this.returnsService.findOneByAdmin(returnId);
    }

    @Patch(':returnId/status')
    @ApiOperation({
        summary: 'Aprobar, rechazar o completar una devolución',
    })
    @ApiParam({
        name: 'returnId',
        example: 1,
    })
    @ApiOkResponse({
        type: ReturnResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Datos de actualización inválidos.',
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.',
    })
    @ApiForbiddenResponse({
        description: 'Acceso exclusivo para administradores.',
    })
    @ApiNotFoundResponse({
        description: 'Devolución o registro relacionado no encontrado.',
    })
    @ApiConflictResponse({
        description: 'Transición o condiciones de devolución inválidas.',
    })
    updateStatus(@Param('returnId', ParseIntPipe) returnId: number,@Body() dto: UpdateReturnStatusDto,@CurrentUser() user: { id: number; role: UserRole }): Promise<ReturnResponseDto> {
        return this.returnsService.updateStatus(
            returnId,
            dto,
            user.id,
        );
    }
}