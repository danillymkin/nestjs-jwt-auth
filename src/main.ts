import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальная настройка приложения
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  // OpenAPI
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Application')
    .setDescription('description')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('/api/docs', app, document);

  // Доступ к .env переменным
  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT') || 5000;

  await app.listen(PORT, () => {
    console.log(`Server started on ${PORT} port.`);
  });
}
bootstrap();
