import {Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards} from '@nestjs/common';
import { ApiTags, ApiBearerAuth,  ApiOperation, ApiParam, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse,ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse} from '@nestjs/swagger';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from '../dto/create-return.dto';
import { ReturnQueryDto } from '../dto/return-query.dto';
import { ReturnResponseDto } from '../dto/return-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../models/user.entity';

@ApiTags('Customer Returns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
@Controller('customers/:customerId/returns')
export class CustomerReturnsController {

    constructor(
        private readonly returnsService: ReturnsService) { }

    @Get()
    @ApiOperation({
        summary: 'Consultar las devoluciones del cliente',
    })
    @ApiParam({
        name: 'customerId',
        example: 6,
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
        description: 'Acceso no autorizado.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente no encontrado.',
    })
    findAll(@Param('customerId', ParseIntPipe) customerId: number,@Query() query: ReturnQueryDto,@CurrentUser() user: { id: number; role: UserRole }) {
        return this.returnsService.findAllByCustomer(customerId,query,user.id);
    }

    @Get(':returnId')
    @ApiOperation({
        summary: 'Consultar el detalle de una devolución',
    })
    @ApiParam({
        name: 'customerId',
        example: 6,
    })
    @ApiParam({
        name: 'returnId',
        example: 1,
    })
    @ApiOkResponse({
        type: ReturnResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Identificadores inválidos.',
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.',
    })
    @ApiForbiddenResponse({
        description: 'Acceso no autorizado.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente o devolución no encontrada.',
    })
    findOne(@Param('customerId', ParseIntPipe) customerId: number,@Param('returnId', ParseIntPipe) returnId: number,@CurrentUser() user: { id: number; role: UserRole }): Promise<ReturnResponseDto> {
        return this.returnsService.findOneByCustomer(customerId,returnId,user.id,);
    }

    @Post()
    @ApiOperation({
        summary: 'Solicitar una devolución parcial o total',
    })
    @ApiParam({
        name: 'customerId',
        example: 6,
    })
    @ApiCreatedResponse({
        type: ReturnResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Datos de solicitud inválidos.',
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.',
    })
    @ApiForbiddenResponse({
        description: 'Acceso no autorizado.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente, pedido o ítem no encontrado.',
    })
    @ApiConflictResponse({
        description: 'El pedido o las cantidades no permiten la devolución.',
    })
    create(@Param('customerId', ParseIntPipe) customerId: number,@Body() dto: CreateReturnDto,@CurrentUser() user: { id: number; role: UserRole }): Promise<ReturnResponseDto> {
        return this.returnsService.create(
            customerId,
            dto,
            user.id,
        );
    }
}