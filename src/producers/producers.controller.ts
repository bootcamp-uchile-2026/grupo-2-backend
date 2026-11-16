import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { ProducersService } from './producers.service';
import { ProducerDetailDto } from '../dto/producer-detail.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../models/user.entity';
import { ProducerStatisticsDto } from '../dto/producer-statistics.dto';
import { StatisticsQueryDto } from '../dto/statistics-query.dto';

@ApiTags('Producers')
@Controller('producers')
export class ProducersController {

  constructor(
    private readonly producersService: ProducersService) { }

  @Get()
  @ApiOperation({
    summary: 'Obtener productores activos paginados',
  })
  @ApiOkResponse({
    description: 'Listado paginado de productores',
  })
  @ApiBadRequestResponse({
    description: 'Parámetros de paginación inválidos',
  })
  findAll(@Query() pagination: PaginationDto) {
    return this.producersService.findAll(pagination);
  }

  @Get(':producerId')
  @ApiOperation({
    summary: 'Obtener perfil público de un productor',
  })
  @ApiParam({
    name: 'producerId',
    type: Number,
    example: 9,
  })
  @ApiOkResponse({
    type: ProducerDetailDto,
  })
  @ApiBadRequestResponse({
    description: 'Identificador inválido',
  })
  @ApiNotFoundResponse({
    description: 'Productor no encontrado',
  })
  findOne(@Param('producerId', ParseIntPipe) producerId: number): Promise<ProducerDetailDto> {
    return this.producersService.findOne(producerId);
  }

  @Get(':producerId/products')
  @ApiOperation({
    summary: 'Obtener productos de un productor',
  })
  @ApiParam({
    name: 'producerId',
    type: Number,
    example: 9,
  })
  @ApiOkResponse({
    description: 'Listado paginado de productos',
  })
  @ApiBadRequestResponse({
    description: 'Parámetros inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Productor no encontrado',
  })
  findProductsByProducer(@Param('producerId', ParseIntPipe) producerId: number,
    @Query() pagination: PaginationDto) {
    return this.producersService.findProductsByProducer(producerId, pagination);
  }

  @Get(':producerId/statistics')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiOperation({
    summary: 'Consultar los indicadores comerciales del productor',
  })
  @ApiParam({
    name: 'producerId',
    example: 12,
  })
  @ApiOkResponse({
    type: ProducerStatisticsDto,
  })
  @ApiBadRequestResponse({
    description: 'Identificador o periodo inválido.',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado.',
  })
  @ApiForbiddenResponse({
    description: 'Acceso no autorizado.',
  })
  @ApiNotFoundResponse({
    description: 'Productor no encontrado.',
  })
  getStatistics(@Param('producerId', ParseIntPipe) producerId: number, @Query() query: StatisticsQueryDto,@CurrentUser() user: { id: number; role: UserRole }): Promise<ProducerStatisticsDto> {
    return this.producersService.getStatistics( producerId, query,user.id);
  }
}