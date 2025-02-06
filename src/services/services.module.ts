import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../entity/services.entity';
import { S3Module } from '../common/services/s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), S3Module],
  exports: [ServicesService, TypeOrmModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
