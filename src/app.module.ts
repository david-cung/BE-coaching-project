import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './filter/exception.filter';
import appConfig from '@config/app.config';
import authConfig from '@config/auth.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { PostsModule } from './posts/posts.module';
import { PostsService } from './posts/posts.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import configurations from './config';
import { S3Service } from './s3/s3.service';

const { NODE_ENV } = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig],
    }),
    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
      envFilePath: [`.env${NODE_ENV ? `.${NODE_ENV}` : ''}`],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<TypeOrmModuleOptions>('db');
        if (!config) {
          throw new Error('Cannot start app without ORM config');
        }
        return config;
      },
      inject: [ConfigService],
    }),
    AuthModule,
    PostsModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    PostsService,
    S3Service,
  ],
})
export class AppModule {}
