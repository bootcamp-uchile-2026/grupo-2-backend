import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { EmprendedorNoEncontradoError } from '../../errors/emprendedor-no-encontrado.error';
import { ProductoNoEncontradoError } from '../../errors/producto-no-encontrado.error';
import { SubcategoriaNoEncontradaError } from '../../errors/subcategoria-no-encontrada.error';

@Catch(EmprendedorNoEncontradoError,ProductoNoEncontradoError,SubcategoriaNoEncontradaError)
export class RecursoNoEncontradoFilter implements ExceptionFilter {

  catch(exception: Error, host: ArgumentsHost) {

    const res = host.switchToHttp().getResponse<Response>();

    res.status(404).json({
      statusCode: 404,
      message: exception.message,
    });
  }
}