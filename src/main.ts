import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable requests from other origins (To be disabled in static files serving )
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
