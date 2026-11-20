import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse, ApiParam } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../models/user.entity';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { CustomerReviewDto } from '../dto/customer-review.dto';
import { PaginationDto } from '../dto/pagination.dto';

@ApiTags('Customer Reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
@Controller('customers/:customerId/reviews')
export class ReviewsController {

    constructor(
        private readonly reviewsService: ReviewsService) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener las valoraciones del cliente.',
    })
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
    })
    @ApiOkResponse({
        description: 'Listado paginado de valoraciones.',
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
    findAll(@Param('customerId', ParseIntPipe) customerId: number, @Query() pagination: PaginationDto, @CurrentUser() user: { id: number; role: UserRole }) {

        return this.reviewsService.findAll(
            customerId,
            pagination,
            user.id,
        );
    }

    @Post()
    @ApiOperation({
        summary: 'Crear una valoración de un producto comprado.',
        description: 'Requiere una compra entregada y acredita cinco puntos verdes por una valoración válida.',
    })
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
    })
    @ApiCreatedResponse({
        description: 'Valoración creada correctamente.',
        type: CustomerReviewDto,
    })
    @ApiBadRequestResponse({
        description: 'Datos de valoración inválidos.',
    })
    @ApiUnauthorizedResponse({
        description: 'Autenticación requerida.',
    })
    @ApiForbiddenResponse({
        description: 'Usuario no autorizado.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente o producto no encontrado.',
    })
    @ApiConflictResponse({
        description: 'Valoración duplicada o producto sin compra entregada.',
    })
    create(@Param('customerId', ParseIntPipe) customerId: number, @Body() dto: CreateReviewDto, @CurrentUser() user: { id: number; role: UserRole }): Promise<CustomerReviewDto> {

        return this.reviewsService.create(
            customerId,
            dto,
            user.id,
        );
    }

    @Patch(':reviewId')
    @ApiOperation({
        summary: 'Actualizar una valoración propia.',
        description: 'Permite modificar la calificación y el comentario sin acreditar puntos verdes adicionales.',
    })
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
    })
    @ApiParam({
        name: 'reviewId',
        type: Number,
        example: 1,
    })
    @ApiOkResponse({
        description: 'Valoración actualizada correctamente.',
        type: CustomerReviewDto,
    })
    @ApiBadRequestResponse({
        description: 'Datos de valoración inválidos.',
    })
    @ApiUnauthorizedResponse({
        description: 'Autenticación requerida.',
    })
    @ApiForbiddenResponse({
        description: 'Usuario no autorizado.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente o valoración no encontrada.',
    })
    update(@Param('customerId', ParseIntPipe) customerId: number, @Param('reviewId', ParseIntPipe) reviewId: number, @Body() dto: UpdateReviewDto, @CurrentUser() user: { id: number; role: UserRole }): Promise<CustomerReviewDto> {

        return this.reviewsService.update(
            customerId,
            reviewId,
            dto,
            user.id,
        );
    }
}