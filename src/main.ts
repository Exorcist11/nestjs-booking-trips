import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  const config = new DocumentBuilder()
    .setTitle('Booking Trips API')
    .setDescription('API documentation for Booking Trips')
    .setVersion('1.0')
    // .addTag('API')
    .addBearerAuth()
    .build();

  app.enableCors({
    origin: '*',
  });

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, documentFactory);

  app.useStaticAssets(join(__dirname, '..', 'node_modules', 'swagger-ui-dist'));

  await app.listen(port);

  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
