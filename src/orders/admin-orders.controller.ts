import { Body, Controller, Get, Patch, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../models/user.entity';
import { OrderQueryDto } from '../dto/order-query.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { StatisticsQueryDto } from 'src/dto/statistics-query.dto';
import { OrderStatisticsDto } from 'src/dto/order-statistics.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('orders')
export class AdminOrdersController {

    constructor(
        private readonly ordersService: OrdersService) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener listado general de pedidos.',
    })
    @ApiOkResponse({
        description: 'Listado paginado de pedidos.',
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
    findAll(@Query() query: OrderQueryDto) {
        return this.ordersService.findAllOrders(query);
    }

    @Get('statistics')
    @ApiOperation({
        summary: 'Consultar las estadísticas generales de pedidos',
    })
    @ApiOkResponse({
        type: OrderStatisticsDto,
    })
    @ApiBadRequestResponse({
        description: 'Periodo de consulta inválido.',
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.',
    })
    @ApiForbiddenResponse({
        description: 'Acceso exclusivo para administradores.',
    })
    getStatistics(@Query() query: StatisticsQueryDto): Promise<OrderStatisticsDto> {
        return this.ordersService.getStatistics(query);
    }

    @Get(':orderId')
    @ApiOperation({
        summary: 'Obtener detalle completo de un pedido.',
    })
    @ApiParam({
        name: 'orderId',
        type: Number,
        example: 21,
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
        description: 'Pedido no encontrado.',
    })
    findOne(@Param('orderId', ParseIntPipe) orderId: number): Promise<OrderResponseDto> {
        return this.ordersService.findOrderByAdmin(orderId);
    }

    @Patch(':orderId/status')
    @ApiOperation({
        summary: 'Actualizar estado de un pedido.',
        description:
            'Actualiza el estado del pedido según las transiciones permitidas.',
    })
    @ApiParam({
        name: 'orderId',
        type: Number,
        example: 21,
    })
    @ApiOkResponse({
        type: OrderResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Identificador o estado inválido.',
    })
    @ApiUnauthorizedResponse({
        description: 'Autenticación requerida.',
    })
    @ApiForbiddenResponse({
        description: 'Usuario no autorizado.',
    })
    @ApiNotFoundResponse({
        description: 'Pedido no encontrado.',
    })
    @ApiConflictResponse({
        description: 'Transición de estado no permitida.',
    })
    updateStatus(@Param('orderId', ParseIntPipe) orderId: number, @Body() dto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
        return this.ordersService.updateOrderStatus(orderId, dto);
    }
}