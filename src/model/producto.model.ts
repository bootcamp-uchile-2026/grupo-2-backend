export class Producto {
  id: number;
  subcategoriaId: number;
  emprendedorId: number;
  marca: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOferta: number | null;
  imagenUrl: string;
  imagenes: string[];
  stock: number;
  puntuacion: number | null;
  ventasUltimoMes: number;
  fechaCreacion: Date;
  colores?: string[];
  tallas?: string[];

  constructor(){};
}