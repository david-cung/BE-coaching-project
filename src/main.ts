/* eslint-disable prettier/prettier */
import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ValidationConfig } from '@config/validation.config';
import { ResponseTransformInterceptor } from './interceptors/response.transform.interceptor';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.enableCors();
  const configService = app.get(ConfigService);

  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalPipes(new ValidationPipe(ValidationConfig));
  app.setGlobalPrefix(configService.get<string>('apiPrefix'));

  const port = configService.get<number>('port');
  await app.listen(port);
  console.log(`app running on port ${port}`)
}

bootstrap();
