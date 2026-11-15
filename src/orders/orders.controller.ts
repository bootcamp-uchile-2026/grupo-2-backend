import {Controller, Get, Param,ParseIntPipe, Query, UseGuards} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../models/user.entity';
import { CheckoutPreviewDto } from '../dto/checkout-preview.dto';
import { CheckoutPreviewResponseDto } from '../dto/checkout-preview-response.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
@Controller('customers/:customerId/checkout')
export class OrdersController {

    constructor(
        private readonly ordersService: OrdersService) { }

    @Get('preview')
    @ApiOperation({
        summary: 'Obtener el resumen previo de una compra.',
    })
    @ApiOkResponse({
        description: 'Resumen de compra calculado correctamente.',
        type: CheckoutPreviewResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Parámetros o cantidad de puntos verdes inválidos.',
    })
    @ApiUnauthorizedResponse({
        description: 'Autenticación requerida.',
    })
    @ApiForbiddenResponse({
        description: 'El usuario no tiene permisos para realizar esta operación.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente, carrito o dirección no encontrados.',
    })
    @ApiConflictResponse({
        description: 'Carrito vacío, productos no disponibles, stock o puntos verdes insuficientes.',
    })
    async preview(@Param('customerId', ParseIntPipe)customerId: number,@Query()dto: CheckoutPreviewDto,@CurrentUser()user: { id: number; role: UserRole }): Promise<CheckoutPreviewResponseDto> {
        return this.ordersService.preview(
            customerId,
            dto,
            user.id,
        );
    }
}