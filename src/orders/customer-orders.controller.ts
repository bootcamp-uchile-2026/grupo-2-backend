import { Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiParam, ApiConflictResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../models/user.entity';
import { OrderQueryDto } from '../dto/order-query.dto';
import { OrderResponseDto } from '../dto/order-response.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
@Controller('customers/:customerId/orders')
export class CustomerOrdersController {

    constructor(
        private readonly ordersService: OrdersService) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener historial de pedidos del cliente.',
    })
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
    })
    @ApiOkResponse({
        description: 'Historial paginado de pedidos.',
    })
    @ApiBadRequestResponse({
        description: 'Parámetros de consulta inválidos.',
    })
    @ApiUnauthorizedResponse({
        description: 'Autenticación requerida.',
    })
    @ApiForbiddenResponse({
        description: 'Usuario no autorizado.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente no encontrado.',
    })
    findAll(@Param('customerId', ParseIntPipe) customerId: number, @Query() query: OrderQueryDto, @CurrentUser() user: { id: number; role: UserRole }) {
        return this.ordersService.findOrdersByCustomer(
            customerId,
            query,
            user.id,
        );
    }

    @Get(':orderId')
    @ApiOperation({
        summary: 'Obtener detalle de un pedido del cliente.',
    })
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
    })
    @ApiParam({
        name: 'orderId',
        type: Number,
        example: 21,
    })
    @ApiOkResponse({
        description: 'Detalle del pedido.',
        type: OrderResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Identificador inválido.',
    })
    @ApiUnauthorizedResponse({
        description: 'Autenticación requerida.',
    })
    @ApiForbiddenResponse({
        description: 'Usuario no autorizado.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente o pedido no encontrado.',
    })
    findOne(@Param('customerId', ParseIntPipe) customerId: number, @Param('orderId', ParseIntPipe) orderId: number, @CurrentUser() user: { id: number; role: UserRole }): Promise<OrderResponseDto> {

        return this.ordersService.findOrderByCustomer(
            customerId,
            orderId,
            user.id,
        );
    }

    @Patch(':orderId/cancel')
    @ApiOperation({
        summary: 'Cancelar un pedido del cliente.',
        description:
            'Permite cancelar un pedido propio en estado CONFIRMED.',
    })
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
    })
    @ApiParam({
        name: 'orderId',
        type: Number,
        example: 16,
    })
    @ApiOkResponse({
        type: OrderResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Identificador inválido.',
    })
    @ApiUnauthorizedResponse({
        description: 'Autenticación requerida.',
    })
    @ApiForbiddenResponse({
        description: 'Usuario no autorizado.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente o pedido no encontrado.',
    })
    @ApiConflictResponse({
        description: 'El estado del pedido no permite su cancelación.',
    })
    cancel(@Param('customerId', ParseIntPipe) customerId: number,
        @Param('orderId', ParseIntPipe) orderId: number,
        @CurrentUser() user: { id: number; role: UserRole }): Promise<OrderResponseDto> {
        return this.ordersService.cancelOrderByCustomer(customerId,orderId, user.id);
    }
}