import { Injectable } from '@nestjs/common';
import { SubCategoriaDto } from 'src/model/dtos/subcategoria.dto';

@Injectable()
export class SubcategoriasService {

  private readonly subcategorias: SubCategoriaDto[] = [
    {
      id: 1,
      nombre: 'Poleras',
      slug: 'poleras',
      imagenUrl: 'https://ejemplo.cl/imagenes/subcategorias/poleras.jpg',
    },
    {
      id: 2,
      nombre: 'Pantalones',
      slug: 'pantalones',
      imagenUrl: 'https://ejemplo.cl/imagenes/subcategorias/pantalones.jpg',
    },
  ];

  obtenerSubcategorias(categoriaId: number): SubCategoriaDto[] {
    return this.subcategorias;
  }

}
