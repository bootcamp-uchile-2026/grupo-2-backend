export class EmprendedorNoEncontradoError extends Error {

  constructor() {
    super('Emprendedor no encontrado');

    this.name = 'EmprendedorNoEncontradoError';
  }
}