import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProducersService } from './producers.service';
import { ProducerDetailDto } from '../dto/producer-detail.dto';
import { PaginationDto } from '../dto/pagination.dto';

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
}