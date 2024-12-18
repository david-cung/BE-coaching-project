import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';
import { S3Module } from '../common/services/s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), S3Module],
  exports: [PostsService, TypeOrmModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
