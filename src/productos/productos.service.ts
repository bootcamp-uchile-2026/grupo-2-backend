import { Injectable, NotFoundException } from '@nestjs/common';
import { HuellaVerdeProductoDto } from 'src/model/dtos/HuellaVerdeProducto.dto';
import { PopularSubCategoriaDto } from 'src/model/dtos/popular-subcategoria.dto';
import { ProductoSubCategoriaDto } from 'src/model/dtos/producto-subcategoria.dto';
import { ProductoBusquedaDto } from 'src/model/dtos/ProductoBusqueda.dto';
import { ProductoDetalleDto } from 'src/model/dtos/ProductoDetalle.dto';
import { ProductoMasVendidoDto } from 'src/model/dtos/ProductoMasVendido.dto';
import { ProductoOfertaDto } from 'src/model/dtos/ProductoOferta.dto';
import { ProductoRelacionadoDto } from 'src/model/dtos/ProductoRelacionado.dto';
import { ProductoResumenNuevosDto } from 'src/model/dtos/ProductoResumenNuevos.dto';
import { ValoracionDetalleDto } from 'src/model/dtos/ValoracionDetalleProducto.dto';
import { HuellaVerde } from 'src/model/huella-verde.model';
import { Producto } from 'src/model/producto.model';
import { Valoracion } from 'src/model/valoracion.model';

@Injectable()
export class ProductosService {
 private readonly productos: Producto[] = [
  {
    id: 1,
    subcategoriaId: 1,
    marca: 'EcoWear',
    nombre: 'Polera de algodón orgánico',
    descripcion: 'Polera confeccionada con algodón orgánico.',
    precio: 12990,
    precioOferta: 9990,
    imagenUrl:
      'https://ejemplo.cl/imagenes/productos/polera.jpg',
    imagenes: [
      'https://ejemplo.cl/imagenes/productos/polera.jpg',
      'https://ejemplo.cl/imagenes/productos/polera-2.jpg',
    ],
    stock: 25,
    puntuacion: 4.7,
    ventasUltimoMes: 50,
    fechaCreacion: new Date('2026-08-20'),
    colores: ['Blanco', 'Negro', 'Verde'],
    tallas: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 2,
    subcategoriaId: 1,
    marca: 'EcoWear',
    nombre: 'Polera manga larga',
    descripcion: 'Polera de algodón de manga larga.',
    precio: 15990,
    precioOferta: null,
    imagenUrl:
      'https://ejemplo.cl/imagenes/productos/polera-larga.jpg',
    imagenes: [
      'https://ejemplo.cl/imagenes/productos/polera-larga.jpg',
    ],
    stock: 15,
    puntuacion: 4.5,
    ventasUltimoMes: 35,
    fechaCreacion: new Date('2026-08-18'),
    colores: ['Negro', 'Gris'],
    tallas: ['S', 'M', 'L'],
  },
  {
    id: 3,
    subcategoriaId: 2,
    marca: 'VerdeVida',
    nombre: 'Polera básica',
    descripcion: 'Polera básica de algodón.',
    precio: 9990,
    precioOferta: 7990,
    imagenUrl:
      'https://ejemplo.cl/imagenes/productos/polera-basica.jpg',
    imagenes: [
      'https://ejemplo.cl/imagenes/productos/polera-basica.jpg',
    ],
    stock: 20,
    puntuacion: 4.2,
    ventasUltimoMes: 25,
    fechaCreacion: new Date('2026-08-15'),
    colores: ['Blanco', 'Negro'],
    tallas: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 4,
    subcategoriaId: 2,
    marca: 'NaturalFit',
    nombre: 'Polera deportiva',
    descripcion: 'Polera para actividades deportivas.',
    precio: 18990,
    precioOferta: null,
    imagenUrl:
      'https://ejemplo.cl/imagenes/productos/polera-deportiva.jpg',
    imagenes: [
      'https://ejemplo.cl/imagenes/productos/polera-deportiva.jpg',
    ],
    stock: 10,
    puntuacion: 4.8,
    ventasUltimoMes: 20,
    fechaCreacion: new Date('2026-08-10'),
    colores: ['Negro', 'Azul'],
    tallas: ['M', 'L', 'XL'],
  },
  {
    id: 5,
    subcategoriaId: 3,
    marca: 'VerdeVida',
    nombre: 'Polera estampada',
    descripcion: 'Polera estampada de algodón.',
    precio: 14990,
    precioOferta: 11990,
    imagenUrl:
      'https://ejemplo.cl/imagenes/productos/polera-estampada.jpg',
    imagenes: [
      'https://ejemplo.cl/imagenes/productos/polera-estampada.jpg',
      'https://ejemplo.cl/imagenes/productos/polera-estampada-2.jpg',
    ],
    stock: 8,
    puntuacion: null,
    ventasUltimoMes: 15,
    fechaCreacion: new Date('2026-08-05'),
    colores: ['Blanco', 'Verde'],
    tallas: ['S', 'M', 'L'],
  },
];

private readonly huellasVerdes: HuellaVerde[] = [
  {
    productoId: 1,
    calificacionSustentable: 4.8,
    materiales: ['Algodón orgánico', 'Tintes naturales'],
    elaboracion:
      'Producto confeccionado utilizando algodón orgánico y procesos de bajo impacto ambiental.',
  },
  {
    productoId: 2,
    calificacionSustentable: 4.5,
    materiales: ['Algodón orgánico'],
    elaboracion:
      'Producto elaborado con materiales de origen sustentable.',
  },
  {
    productoId: 3,
    calificacionSustentable: null,
    materiales: ['Algodón'],
    elaboracion: null,
  },
];

private readonly valoraciones: Valoracion[] = [
  {
    id: 1,
    productoId: 1,
    autor: 'María',
    comentario: 'Muy buen producto y excelente calidad.',
    puntuacion: 5,
    publicada: true,
  },
  {
    id: 2,
    productoId: 1,
    autor: 'Carlos',
    comentario: 'Buena calidad y materiales.',
    puntuacion: 4,
    publicada: true,
  },
  {
    id: 3,
    productoId: 1,
    autor: 'Andrea',
    comentario: 'Comentario pendiente de moderación.',
    puntuacion: 3,
    publicada: false,
  },
  {
    id: 4,
    productoId: 2,
    autor: 'Pedro',
    comentario: 'Producto cómodo y de buena terminación.',
    puntuacion: 4,
    publicada: true,
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

 buscarProductos(buscar: string): ProductoBusquedaDto[] {
  const productosFiltrados = this.productos.filter((producto) =>
    producto.nombre
      .toLowerCase()
      .includes(buscar.toLowerCase()),
  );

  const productosDto = productosFiltrados.map((producto) => ({
    id: producto.id,
    marca: producto.marca,
    nombre: producto.nombre,
    precio: producto.precio,
    imagenUrl: producto.imagenUrl ?? '',
  }));

  return productosDto;
}

obtenerProductosEnOferta(): ProductoOfertaDto[] {
  const productosEnOferta = this.productos.filter(
    (producto) => producto.precioOferta !== null,
  );

  const productosDto = productosEnOferta.map((producto) => ({
    id: producto.id,
    marca: producto.marca,
    nombre: producto.nombre,
    precioOriginal: producto.precio,
    precioDescuento: producto.precioOferta as number,
    descuentoPorcentaje: Math.round(
      ((producto.precio - (producto.precioOferta as number)) /
        producto.precio) *
        100,
    ),
    imagenUrl: producto.imagenUrl ?? '',
  }));

  return productosDto;
}

obtenerProductosMasVendidos(
  cantidad: number,
): ProductoMasVendidoDto[] {
  const productosOrdenados = this.productos.sort(
    (a, b) => b.ventasUltimoMes - a.ventasUltimoMes,
  );

  const productosLimitados = productosOrdenados.slice(
    0,
    cantidad,
  );

  const productosDto = productosLimitados.map((producto) => ({
    id: producto.id,
    marca: producto.marca,
    nombre: producto.nombre,
    precio: producto.precio,
    puntuacion: producto.puntuacion,
    imagenUrl: producto.imagenUrl,
  }));

  return productosDto;
}

obtenerProductosNuevos(): ProductoResumenNuevosDto[] {
  const productosOrdenados = this.productos.sort(
    (a, b) =>
      b.fechaCreacion.getTime() - a.fechaCreacion.getTime(),
  );

  const productosDto = productosOrdenados.map((producto) => ({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    precioOferta: producto.precioOferta,
    imagenUrl: producto.imagenUrl,
  }));

  return productosDto;
}

obtenerProductoPorId(productoId: number): ProductoDetalleDto {
  const productoEncontrado = this.productos.find(
    (producto) => producto.id === productoId,
  );

  if (!productoEncontrado) {
    throw new NotFoundException(
      'Producto no encontrado',
    );
  }

  const productoDto: ProductoDetalleDto = {
    id: productoEncontrado.id,
    nombre: productoEncontrado.nombre,
    precio: productoEncontrado.precio,
    descripcion: productoEncontrado.descripcion,
    imagenes: productoEncontrado.imagenes,
    colores: productoEncontrado.colores,
    tallas: productoEncontrado.tallas,
  };

  return productoDto;
}

obtenerHuellaVerde(
  productoId: number,
): HuellaVerdeProductoDto {
  const productoEncontrado = this.productos.find(
    (producto) => producto.id === productoId,
  );

  if (!productoEncontrado) {
    throw new NotFoundException(
      'Producto no encontrado',
    );
  }

  const huellaEncontrada = this.huellasVerdes.find(
    (huella) => huella.productoId === productoId,
  );

  if (!huellaEncontrada) {
    const huellaVacia: HuellaVerdeProductoDto = {
      calificacionSustentable: null,
      materiales: [],
      elaboracion: null,
    };

    return huellaVacia;
  }

  const huellaDto: HuellaVerdeProductoDto = {
    calificacionSustentable:
      huellaEncontrada.calificacionSustentable,
    materiales: huellaEncontrada.materiales,
    elaboracion: huellaEncontrada.elaboracion,
  };

  return huellaDto;
}

obtenerValoraciones(productoId: number): ValoracionDetalleDto[] {
  const productoEncontrado = this.productos.find(
    (producto) => producto.id === productoId);

  if (!productoEncontrado) {
    throw new NotFoundException(
      'Producto no encontrado',
    );
  }

  const valoracionesProducto = this.valoraciones.filter(
    (valoracion) =>
      valoracion.productoId === productoId &&
      valoracion.publicada === true);

  const valoracionesDto = valoracionesProducto.map(
    (valoracion) => ({
      id: valoracion.id,
      autor: valoracion.autor,
      comentario: valoracion.comentario,
      puntuacion: valoracion.puntuacion}),
  );

  return valoracionesDto;
}

obtenerProductosRelacionados(productoId: number,cantidad: number): ProductoRelacionadoDto[] {
  const productoEncontrado = this.productos.find(
    (producto) => producto.id === productoId,
  );

  if (!productoEncontrado) {
    throw new NotFoundException(
      'Producto no encontrado',
    );
  }

  const productosRelacionados = this.productos.filter(
    (producto) =>
      producto.subcategoriaId === productoEncontrado.subcategoriaId &&
      producto.id !== productoId,
  );

  const productosOrdenados = productosRelacionados.sort(
    (a, b) => b.ventasUltimoMes - a.ventasUltimoMes,
  );

  const productosLimitados = productosOrdenados.slice(
    0,
    cantidad,
  );

  const productosDto = productosLimitados.map(
    (producto) => ({
      id: producto.id,
      marca: producto.marca,
      nombre: producto.nombre,
      precio: producto.precio,
      imagenUrl: producto.imagenUrl,
    }),
  );

  return productosDto;
}

}