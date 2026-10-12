import {BadRequestException, Controller, Get, Param, ParseIntPipe, Query} from '@nestjs/common';
import {ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags} from '@nestjs/swagger';
import { EntrepreneursService } from './emprendedores.service';
import { EntrepreneurSummaryDto } from '../dto/entrepreneur-summary.dto';
import { EntrepreneurDetailDto } from '../dto/entrepreneur-detail.dto';
import { ProductSummaryDto } from '../dto/product-summary.dto';

@ApiTags('Emprendedores')
@Controller('emprendedores')
export class EntrepreneursController {

  constructor(private readonly entrepreneursService: EntrepreneursService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener emprendedores',
    description:
      'Obtiene los emprendedores registrados en BuenOrigen. Opcionalmente permite limitar la cantidad de resultados.',
  })
  @ApiQuery({
    name: 'cantidad',
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
  findAll(@Query('cantidad') quantity?: string): EntrepreneurSummaryDto[] {
    if (quantity === undefined) {
      return this.entrepreneursService.findAll();
    }

    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      throw new BadRequestException(
        'La cantidad debe ser un número entero positivo.',
      );
    }

    return this.entrepreneursService.findAll(
      parsedQuantity,
    );
  }

  @Get(':emprendedorId')
  @ApiOperation({
    summary: 'Obtener perfil de un emprendedor',
    description:
      'Obtiene la información pública detallada de un emprendedor específico.',
  })
  @ApiParam({
    name: 'emprendedorId',
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
  findOne(@Param('emprendedorId', ParseIntPipe)entrepreneurId: number): EntrepreneurDetailDto {
    return this.entrepreneursService.findOne(
      entrepreneurId,
    );
  }

  @Get(':emprendedorId/productos')
  @ApiOperation({
    summary: 'Obtener productos de un emprendedor',
    description:
      'Obtiene los productos asociados a un emprendedor específico.',
  })
  @ApiParam({
    name: 'emprendedorId',
    type: Number,
    example: 1,
    description: 'Identificador único del emprendedor',
  })
  @ApiOkResponse({
    description:
      'Productos del emprendedor obtenidos correctamente.',
    type: ProductSummaryDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'Emprendedor no encontrado.',
  })
  findProductsByEntrepreneur(@Param('emprendedorId', ParseIntPipe)entrepreneurId: number): ProductSummaryDto[] {
    return this.entrepreneursService.findProductsByEntrepreneur(
      entrepreneurId,
    );
  }
}
