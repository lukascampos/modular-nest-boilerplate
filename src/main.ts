import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { EnvService } from './shared/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const envService = app.get(EnvService);
  const port = envService.get('PORT');

  await app.listen(port ?? 3333);
}
bootstrap();
