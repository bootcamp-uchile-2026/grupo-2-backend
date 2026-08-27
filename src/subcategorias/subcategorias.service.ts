import { Injectable } from "@nestjs/common";
import { PopularSubCategoriaDto } from "src/model/dtos/popular-subcategoria.dto";
import { ProductoSubCategoriaDto } from "src/model/dtos/producto-subcategoria.dto";
import { SubCategoriaDto } from "src/model/dtos/subcategoria.dto";
import { Producto } from "src/model/producto.model";
import { SubCategoria } from "src/model/subcategoria.model";

@Injectable()
export class SubcategoriasService {
  private readonly subcategorias: SubCategoria[] = [
    {
      id: 1,
      categoriaId: 3,
      nombre: 'Poleras',
      slug: 'poleras',
      imagenUrl:
        'https://ejemplo.cl/imagenes/subcategorias/poleras.jpg',
    },
    {
      id: 2,
      categoriaId: 3,
      nombre: 'Pantalones',
      slug: 'pantalones',
      imagenUrl:
        'https://ejemplo.cl/imagenes/subcategorias/pantalones.jpg',
    },
    {
      id: 3,
      categoriaId: 3,
      nombre: 'Polerones',
      slug: 'polerones',
      imagenUrl:
        'https://ejemplo.cl/imagenes/subcategorias/polerones.jpg',
    },
  ];

  private readonly productos: Producto[] = [
  {
    id: 1,
    subcategoriaId: 1,
    marca: 'EcoWear',
    nombre: 'Polera de algodón',
    descripcion: 'Polera confeccionada con algodón.',
    precio: 12990,
    precioOferta: 9990,
    imagenUrl: 'https://ejemplo.cl/productos/polera.jpg',
    imagenes: [
      'https://ejemplo.cl/productos/polera.jpg',
    ],
    stock: 25,
    puntuacion: 4.7,
    ventasUltimoMes: 50,
    fechaCreacion: new Date('2026-08-20'),
    colores: ['Blanco', 'Negro'],
    tallas: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 2,
    subcategoriaId: 1,
    marca: 'EcoWear',
    nombre: 'Polera orgánica',
    descripcion: 'Polera de algodón orgánico.',
    precio: 15990,
    precioOferta: null,
    imagenUrl: 'https://ejemplo.cl/productos/polera-organica.jpg',
    imagenes: [
      'https://ejemplo.cl/productos/polera-organica.jpg',
    ],
    stock: 15,
    puntuacion: 4.5,
    ventasUltimoMes: 35,
    fechaCreacion: new Date('2026-08-18'),
    colores: ['Verde', 'Blanco'],
    tallas: ['S', 'M', 'L'],
  },
  {
    id: 3,
    subcategoriaId: 2,
    marca: 'VerdeVida',
    nombre: 'Pantalón cargo',
    descripcion: 'Pantalón cargo de algodón.',
    precio: 29990,
    precioOferta: 24990,
    imagenUrl: 'https://ejemplo.cl/productos/pantalon.jpg',
    imagenes: [
      'https://ejemplo.cl/productos/pantalon.jpg',
    ],
    stock: 10,
    puntuacion: 4.3,
    ventasUltimoMes: 40,
    fechaCreacion: new Date('2026-08-15'),
    colores: ['Beige', 'Negro', 'Verde'],
    tallas: ['S', 'M', 'L', 'XL'],
  },
];

  obtenerSubcategorias(categoriaId: number): SubCategoriaDto[] {
    return this.subcategorias
      .filter(
        (subcategoria) => subcategoria.categoriaId === categoriaId,
      )
      .map((subcategoria) => ({
        id: subcategoria.id,
        nombre: subcategoria.nombre,
        slug: subcategoria.slug,
        imagenUrl: subcategoria.imagenUrl,
      }));
  }

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
