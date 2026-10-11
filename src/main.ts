import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RecursoNoEncontradoFilter } from './filters/recurso-no-encontrado/recurso-no-encontrado.filter';
import { LoggingInterceptor } from './interceptors/logging/logging.interceptor';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalFilters(new RecursoNoEncontradoFilter());

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
