export class Producto {
  id: number;
  subcategoriaId: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl?: string;
  stock: number;
  ventasUltimoMes: number;
}