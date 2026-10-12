import { Injectable } from '@nestjs/common';
import { ProductosService } from '../productos/productos.service';
import { SubcategoryNotFoundError } from '../common/errors/subcategory-not-found.error';
import { PopularSubCategoriaDto } from "src/model/dtos/popular-subcategoria.dto";
import { ProductoSubCategoriaDto } from "src/model/dtos/producto-subcategoria.dto";
import { SubCategoriaDto } from "src/model/dtos/subcategoria.dto";
import { SubCategoria } from "src/model/subcategoria.model";

@Injectable()
export class SubcategoriasService {

  constructor(private readonly productosService: ProductosService) { }

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



  validarExistenciaSubcategoria(subcategoriaId: number): void {
    const subcategoriaExiste = this.subcategorias.some(
      (subcategoria) => subcategoria.id === subcategoriaId,
    );

    if (!subcategoriaExiste) {
      throw new SubcategoryNotFoundError();
    }
  }

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

  obtenerProductosPorSubcategoria(subcategoriaId: number): ProductoSubCategoriaDto[] {
    this.validarExistenciaSubcategoria(subcategoriaId);

    return this.productosService.obtenerProductosPorSubcategoria(subcategoriaId)
      .map((producto) => ({
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagenUrl: producto.imagenUrl,
        stock: producto.stock,
      }));
  }

  obtenerProductosPopulares(subcategoriaId: number, cantidad = 4): PopularSubCategoriaDto[] {
    this.validarExistenciaSubcategoria(subcategoriaId);

    const cantidadMaxima = Math.min(cantidad, 4);

    return this.productosService.obtenerProductosPorSubcategoria(subcategoriaId)
      .filter((producto) => producto.stock > 0)
      .sort((a, b) => b.ventasUltimoMes - a.ventasUltimoMes)
      .slice(0, cantidadMaxima)
      .map((producto) => ({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagenUrl: producto.imagenUrl,
      }));
  }
}
