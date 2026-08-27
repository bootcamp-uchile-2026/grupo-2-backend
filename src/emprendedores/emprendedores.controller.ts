import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmprendedoresService } from './emprendedores.service';
import { EmprendedorResumenDto } from '../model/dtos/EmprendedorResumen.dto';
import { EmprendedorDetalleDto } from 'src/model/dtos/EmprendedorDetalle.dto';
import { ProductoResumenDto } from 'src/model/dtos/ProductoResumen.dto';

@ApiTags('Emprendedores')
@Controller('emprendedores')
export class EmprendedoresController {
    constructor(
        private readonly emprendedoresService: EmprendedoresService,
    ) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener emprendedores',
        description:
            'Obtiene los emprendedores registrados en EcoTienda. Opcionalmente permite limitar la cantidad de resultados.',
    })
    @ApiQuery({
        name: 'cantidad',
        required: false,
        type: Number,
        example: 4,
        description: 'Cantidad máxima de emprendedores que se desea obtener',
    })
    @ApiOkResponse({
        description: 'Emprendedores obtenidos correctamente.',
        type: EmprendedorResumenDto,
        isArray: true,
    })
    obtenerEmprendedores(
        @Query('cantidad') cantidad?: string): EmprendedorResumenDto[] {
        return this.emprendedoresService.obtenerEmprendedores(cantidad)}


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
        type: EmprendedorDetalleDto,
    })
    @ApiNotFoundResponse({
        description: 'Emprendedor no encontrado.',
    })
    obtenerEmprendedorPorId(
        @Param('emprendedorId', ParseIntPipe) emprendedorId: number,
    ): EmprendedorDetalleDto {
        return this.emprendedoresService.obtenerEmprendedorPorId(emprendedorId);
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
        description: 'Productos del emprendedor obtenidos correctamente.',
        type: ProductoResumenDto,
        isArray: true,
    })
    @ApiNotFoundResponse({
        description: 'Emprendedor no encontrado.',
    })
    obtenerProductosPorEmprendedor(
        @Param('emprendedorId', ParseIntPipe) emprendedorId: number): ProductoResumenDto[] {
        return this.emprendedoresService.obtenerProductosPorEmprendedor(emprendedorId);
    }
}