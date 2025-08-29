import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors(); // MVP

  const swaggerCfg = new DocumentBuilder()
    .setTitle('Boxful API')
    .setDescription('Auth + Orders (MVP)')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerCfg);
  SwaggerModule.setup('docs', app, document);

  const cfg = app.get(ConfigService);
  const port = cfg.get<number>('PORT') ?? 3000;

  await app.listen(port);
  console.log(`API up on http://localhost:${port} | Swagger on /docs`);
}
bootstrap();
