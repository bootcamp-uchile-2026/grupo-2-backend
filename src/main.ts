import { NestFactory } from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  ///////////////////////////////////
  // Validación global de los DTOs //
  ///////////////////////////////////
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }), 

  );

  //////////////////////////////////////////////////////////////
  // Configuración de Swagger para la documentación de la API //
  //////////////////////////////////////////////////////////////

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
