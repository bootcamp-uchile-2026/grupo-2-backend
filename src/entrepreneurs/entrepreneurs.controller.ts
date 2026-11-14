import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EntrepreneursService } from './entrepreneurs.service';
import { EntrepreneurSummaryDto } from '../dto/entrepreneur-summary.dto';
import { EntrepreneurDetailDto } from '../dto/entrepreneur-detail.dto';
import { ProductSummaryDto } from '../dto/product-summary.dto';

@ApiTags('Entrepreneurs')
@Controller('entrepreneurs')
export class EntrepreneursController {

  constructor(private readonly entrepreneursService: EntrepreneursService) { }

  @Get()
  @ApiOperation({
    summary: 'Obtener emprendedores',
    description:
      'Obtiene los emprendedores registrados en BuenOrigen. Opcionalmente permite limitar la cantidad de resultados.',
  })
  @ApiQuery({
    name: 'quantity',
    required: false,
    type: Number,
    example: 4,
    description:
      'Cantidad máxima de emprendedores. Debe ser un número entero positivo.',
  })
  @ApiOkResponse({
    description: 'Emprendedores obtenidos correctamente.',
    type: EntrepreneurSummaryDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description:
      'El parámetro cantidad debe ser un número entero positivo.',
  })
  findAll(@Query('quantity') quantity?: string): EntrepreneurSummaryDto[] {
    return this.entrepreneursService.findAll(quantity);
  }

  @Get(':entrepreneurId')
  @ApiOperation({
    summary: 'Obtener perfil de un emprendedor',
    description:
      'Obtiene la información pública detallada de un emprendedor específico.',
  })
  @ApiParam({
    name: 'entrepreneurId',
    type: Number,
    example: 1,
    description: 'Identificador único del emprendedor',
  })
  @ApiOkResponse({
    description: 'Emprendedor obtenido correctamente.',
    type: EntrepreneurDetailDto,
  })
  @ApiNotFoundResponse({
    description: 'Emprendedor no encontrado.',
  })
  @ApiBadRequestResponse({
    description: 'El identificador debe ser un número entero.',
  })
  findOne(@Param('entrepreneurId', ParseIntPipe) entrepreneurId: number): EntrepreneurDetailDto {
    return this.entrepreneursService.findOne(
      entrepreneurId,
    );
  }

  @Get(':entrepreneurId/products')
  @ApiOperation({
    summary: 'Obtener productos de un emprendedor',
    description:
      'Obtiene los productos asociados a un emprendedor específico.',
  })
  @ApiParam({
    name: 'entrepreneurId',
    type: Number,
    example: 1,
    description: 'Identificador único del emprendedor',
  })
  @ApiOkResponse({
    description:
      'productos del emprendedor obtenidos correctamente.',
    type: ProductSummaryDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'Emprendedor no encontrado.',
  })
  @ApiBadRequestResponse({
    description: 'El identificador debe ser un número entero.',
  })
  findProductsByEntrepreneur(@Param('entrepreneurId', ParseIntPipe) entrepreneurId: number): ProductSummaryDto[] {
    return this.entrepreneursService.findProductsByEntrepreneur(
      entrepreneurId,
    );
  }
}
