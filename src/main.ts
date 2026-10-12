import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging/logging.interceptor';
import { RecursoNoEncontradoFilter } from './filters/recurso-no-encontrado/recurso-no-encontrado.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Interceptor global de trazabilidad
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtro existente en develop
  app.useGlobalFilters(new RecursoNoEncontradoFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('BuenOrigen API')
    .setDescription('API de BuenOrigen')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
