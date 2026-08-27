import { Injectable, NotFoundException } from '@nestjs/common';
import { Emprendedor } from '../model/emprendedor.model';
import { EmprendedorResumenDto } from 'src/model/dtos/EmprendedorResumen.dto';
import { EmprendedorDetalleDto } from 'src/model/dtos/EmprendedorDetalle.dto';
import { ProductosService } from 'src/productos/productos.service';
import { ProductoResumenDto } from 'src/model/dtos/ProductoResumen.dto';

@Injectable()
export class EmprendedoresService {

    constructor(private readonly productosService: ProductosService) { };

    private readonly emprendedores: Emprendedor[] = [
        {
            id: 1,
            nombre: 'EcoRaíz',
            descripcion:
                'Emprendimiento dedicado a la elaboración de productos sustentables.',
            imagenUrl: 'https:ecoraiz.jpg',
            historia:
                'EcoRaíz nació con el objetivo de crear alternativas sustentables para el uso cotidiano.',
        },
        {
            id: 2,
            nombre: 'Verde Hogar',
            descripcion:
                'Emprendimiento enfocado en productos ecológicos para el hogar.',
            imagenUrl: 'https:verdehogar.jpg',
            historia:
                'Verde Hogar surge como una iniciativa familiar orientada a reducir el uso de productos desechables.',
        },
        {
            id: 3,
            nombre: 'Naturaleza Viva',
            descripcion:
                'Emprendimiento dedicado al bienestar y cuidado personal sustentable.',
            imagenUrl:
                'https:naturaleza.jpg',
            historia:
                'Naturaleza Viva desarrolla productos de cuidado personal utilizando materiales y procesos de bajo impacto ambiental.',
        },
    ];

    obtenerEmprendedores(cantidad?: string): EmprendedorResumenDto[] {
        let emprendedoresSeleccionados = this.emprendedores;

        if (cantidad !== undefined) {
            const cantidadNumero = Number(cantidad);

            emprendedoresSeleccionados = this.emprendedores.slice(0,cantidadNumero);
        }

        const emprendedoresDto = emprendedoresSeleccionados.map((emprendedor) => ({
                id: emprendedor.id,
                nombre: emprendedor.nombre,
                descripcion: emprendedor.descripcion,
                imagenUrl: emprendedor.imagenUrl,
            }),
        );

        return emprendedoresDto;
    }

    obtenerEmprendedorPorId(emprendedorId: number): EmprendedorDetalleDto {
        const emprendedorEncontrado = this.emprendedores.find(
            (emprendedor) => emprendedor.id === emprendedorId);

        if (!emprendedorEncontrado) {
            throw new NotFoundException('Emprendedor no encontrado');
        }

        const emprendedorDto: EmprendedorDetalleDto = {
            id: emprendedorEncontrado.id,
            nombre: emprendedorEncontrado.nombre,
            descripcion: emprendedorEncontrado.descripcion,
            imagenUrl: emprendedorEncontrado.imagenUrl,
            historia: emprendedorEncontrado.historia
        };

        return emprendedorDto;
    }

    obtenerProductosPorEmprendedor(emprendedorId: number): ProductoResumenDto[] {
        const emprendedorEncontrado = this.emprendedores.find(
            (emprendedor) => emprendedor.id === emprendedorId);

        if (!emprendedorEncontrado) {
            throw new NotFoundException('Emprendedor no encontrado');
        }

        const productosDto =
            this.productosService.obtenerProductosPorEmprendedor(emprendedorId);

        return productosDto;
    }
}