import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальный префикс /api — все эндпоинты будут /api/...
  app.setGlobalPrefix('api');

  // Глобальный ValidationPipe — автоматически валидирует входящие DTO
  // whitelist: убирает лишние поля, которых нет в DTO
  // forbidNonWhitelisted: возвращает 400 если пришли неизвестные поля
  // transform: автоматически конвертирует строки в числа/булевы там, где нужно
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS — разрешаем запросы с фронтенда (URL берётся из переменной окружения)
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true, // нужно для передачи cookie с httpOnly JWT
  });

  // Swagger UI — автоматическая документация API
  // Доступна на /api/docs
  const config = new DocumentBuilder()
    .setTitle('Liora API')
    .setDescription('API платформы онлайн-записи Liora')
    .setVersion('1.0')
    .addBearerAuth() // кнопка "Authorize" для JWT токена в Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Запускаем сервер на порту из .env или 3001 по умолчанию
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend запущен: http://localhost:${port}/api`);
  console.log(`Swagger UI: http://localhost:${port}/api/docs`);
}

bootstrap();
