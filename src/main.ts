import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import dotenv from 'dotenv';
import { UtilsInterceptor } from './app/utils/utils.interceptor';
import { GlobalExceptionFilter } from './app/middlewares/globalErrors.filter';
import express from 'express';
import config from './app/config';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  app.use('/api/v1/webhook', express.raw({ type: 'application/json' }));

  app.use(cookieParser());
  app.enableCors({
    origin: config.corsOrigin === '*' ? true : config.corsOrigin,
    credentials: true,
  });

  app.setGlobalPrefix('api/v1', {
    exclude: [''],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new UtilsInterceptor());
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${config.appName} API`)
    .setDescription(`${config.appName} API Documentation`)
    .setVersion('1.0')
    .addTag(`${config.appName} API`)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
    console.log(`Swagger: http://localhost:${config.port}/api/docs`);
  });
}
bootstrap().catch(console.error);
