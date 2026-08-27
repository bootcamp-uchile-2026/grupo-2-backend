import { Injectable } from '@nestjs/common';
import { PopularSubCategoriaDto } from 'src/model/dtos/popular-subcategoria.dto';
import { ProductoSubCategoriaDto } from 'src/model/dtos/producto-subcategoria.dto';
import { Producto } from 'src/model/producto.model';

@Injectable()
export class ProductosService {
  private readonly productos: Producto[] = [
    {
      id: 1,
      subcategoriaId: 5,
      nombre: 'Polera de algodón orgánico',
      descripcion: 'Polera confeccionada con algodón orgánico.',
      precio: 12990,
      imagenUrl: 'https://ejemplo.cl/imagenes/productos/polera.jpg',
      stock: 25,
      ventasUltimoMes: 50,
    },
    {
      id: 2,
      subcategoriaId: 5,
      nombre: 'Polera manga larga',
      descripcion: 'Polera de algodón de manga larga.',
      precio: 15990,
      imagenUrl:
        'https://ejemplo.cl/imagenes/productos/polera-larga.jpg',
      stock: 15,
      ventasUltimoMes: 35,
    },
    {
      id: 3,
      subcategoriaId: 5,
      nombre: 'Polera básica',
      descripcion: 'Polera básica de algodón.',
      precio: 9990,
      imagenUrl:
        'https://ejemplo.cl/imagenes/productos/polera-basica.jpg',
      stock: 20,
      ventasUltimoMes: 25,
    },
    {
      id: 4,
      subcategoriaId: 5,
      nombre: 'Polera deportiva',
      descripcion: 'Polera para actividades deportivas.',
      precio: 18990,
      imagenUrl:
        'https://ejemplo.cl/imagenes/productos/polera-deportiva.jpg',
      stock: 10,
      ventasUltimoMes: 20,
    },
    {
      id: 5,
      subcategoriaId: 5,
      nombre: 'Polera estampada',
      descripcion: 'Polera estampada de algodón.',
      precio: 14990,
      imagenUrl:
        'https://ejemplo.cl/imagenes/productos/polera-estampada.jpg',
      stock: 8,
      ventasUltimoMes: 15,
    },
  ];

  obtenerProductosPorSubcategoria(
    subcategoriaId: number,
  ): ProductoSubCategoriaDto[] {
    return this.productos
      .filter(
        (producto) => producto.subcategoriaId === subcategoriaId,
      )
      .map((producto) => ({
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagenUrl: producto.imagenUrl,
        stock: producto.stock,
      }));
  }

  obtenerProductosPopulares(
    subcategoriaId: number,
    cantidad = 4,
  ): PopularSubCategoriaDto[] {
    const cantidadMaxima = Math.min(cantidad, 4);

    return this.productos
      .filter(
        (producto) =>
          producto.subcategoriaId === subcategoriaId &&
          producto.stock > 0,
      )
      .sort(
        (a, b) => b.ventasUltimoMes - a.ventasUltimoMes,
      )
      .slice(0, cantidadMaxima)
      .map((producto) => ({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagenUrl: producto.imagenUrl,
      }));
  }
}