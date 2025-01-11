import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../entity/news.entity';
import { S3Module } from '../common/services/s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([News]), S3Module],
  exports: [NewsService, TypeOrmModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
