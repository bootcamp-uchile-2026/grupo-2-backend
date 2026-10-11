import { Controller, Get, Param, ParseIntPipe, Query, BadRequestException } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiBadRequestResponse } from '@nestjs/swagger';
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
        description: 'Cantidad máxima de emprendedores. Debe ser un número entero positivo.',
    })
    @ApiOkResponse({
        description: 'Emprendedores obtenidos correctamente.',
        type: EmprendedorResumenDto,
        isArray: true,
    })
    @ApiBadRequestResponse({
        description: 'El parámetro cantidad debe ser un número entero positivo.',
    })
    obtenerEmprendedores(
        @Query('cantidad') cantidad?: string,
    ): EmprendedorResumenDto[] {

        if (cantidad === undefined) {
            return this.emprendedoresService.obtenerEmprendedores();
        }

        const cantidadNumero = Number(cantidad);

        if (!Number.isInteger(cantidadNumero) || cantidadNumero <= 0) {
            throw new BadRequestException(
                'La cantidad debe ser un número entero positivo.',
            );
        }

        return this.emprendedoresService.obtenerEmprendedores(cantidadNumero);
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