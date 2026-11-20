import {Controller, Get,Patch, Param,ParseIntPipe, Query,UseGuards} from '@nestjs/common';
import { ApiTags,ApiBearerAuth,ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse,ApiConflictResponse,ApiParam, ApiNotFoundResponse} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../models/user.entity';
import { OrderQueryDto } from '../dto/order-query.dto';
import { ProducerOrderDetailDto } from '../dto/producer-order-detail.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PRODUCER)
@Controller('producers/:producerId/orders')
export class ProducerOrdersController {

    constructor(
        private readonly ordersService: OrdersService) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener pedidos asociados al productor.',
    })
    @ApiParam({
        name: 'producerId',
        type: Number,
        example: 12,
    })
    @ApiOkResponse({
        description: 'Listado paginado de pedidos del productor.',
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
        description: 'Productor no encontrado.',
    })
    findAll(@Param('producerId', ParseIntPipe) producerId: number,@Query() query: OrderQueryDto,@CurrentUser() user: { id: number; role: UserRole }) {
        return this.ordersService.findOrdersByProducer(producerId,query,user.id);
    }

    @Get(':orderId')
    @ApiOperation({
        summary: 'Obtener detalle de un pedido del productor.',
    })
    @ApiParam({
        name: 'producerId',
        type: Number,
        example: 12,
    })
    @ApiParam({
        name: 'orderId',
        type: Number,
        example: 21,
    })
    @ApiOkResponse({
        type: ProducerOrderDetailDto,
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
        description: 'Productor o pedido no encontrado.',
    })
    findOne(@Param('producerId', ParseIntPipe) producerId: number, @Param('orderId', ParseIntPipe) orderId: number, @CurrentUser() user: { id: number; role: UserRole }): Promise<ProducerOrderDetailDto> {
        return this.ordersService.findOrderByProducer( producerId,orderId,user.id);
    }

    @Patch(':orderId/items/:itemId/prepare')
    @ApiOperation({
        summary: 'Marcar un ítem del pedido como preparado.',
        description:
            'El productor solo puede preparar sus propios productos.',
    })
    @ApiParam({
        name: 'producerId',
        type: Number,
        example: 12,
    })
    @ApiParam({
        name: 'orderId',
        type: Number,
        example: 21,
    })
    @ApiParam({
        name: 'itemId',
        type: Number,
        example: 41,
    })
    @ApiOkResponse({
        type: ProducerOrderDetailDto,
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
        description: 'Productor, pedido o ítem no encontrado.',
    })
    @ApiConflictResponse({
        description: 'El estado del pedido no permite preparar sus productos.',
    })
    prepareItem(
        @Param('producerId', ParseIntPipe) producerId: number,
        @Param('orderId', ParseIntPipe) orderId: number,
        @Param('itemId', ParseIntPipe) itemId: number,
        @CurrentUser() user: { id: number; role: UserRole }): Promise<ProducerOrderDetailDto> {

        return this.ordersService.prepareOrderItem(
            producerId,
            orderId,
            itemId,
            user.id,
        );
    }
}