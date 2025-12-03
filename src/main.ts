import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as http from 'node:http';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './common/exception.filter';
import { ResponseInterceptor } from './common/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server = app.getHttpServer() as http.Server;

  // Set server timeout and keep-alive settings
  server.setTimeout(60000); // 60 seconds
  server.keepAliveTimeout = 60000; // 60 seconds
  server.headersTimeout = 65000; // 65 seconds, must be greater than

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Swagger Setup
  const options = new DocumentBuilder()
    .setTitle('Stock Pilot')
    .setDescription('Stock Pilot API Description')
    .setVersion('1.0')
    .addTag('Stock Pilot')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
