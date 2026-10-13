export class DuplicateEmailError extends Error {
  constructor() {
    super('El correo electrónico ya está registrado');

    this.name = 'DuplicateEmailError';
  }
}