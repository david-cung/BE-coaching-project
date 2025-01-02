import {
  Body,
  Controller,
  Post,
  UseGuards,
  Query,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '@guard/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { AuthenticatedUser } from '../../src/shared/interfaces';
import { S3Service } from '../common/services/s3/s3.service';
import { plainToInstance } from 'class-transformer';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly s3Service: S3Service,
  ) {}

  @Get('upload-url')
  async getUploadUrl(@Query('fileName') fileName: string) {
    return this.s3Service.generateUploadUrl(fileName);
  }

  @Post()
  async createPost(
    @User() user: AuthenticatedUser,
    @Body() postData: CreatePostDto,
  ): Promise<string> {
    return this.postsService.createPost(user.userId, postData);
  }

  @Get()
  async getListPost(
    @User() user: AuthenticatedUser,
    @Query() postQuery: string,
  ): Promise<CreatePostDto[]> {
    const posts = await this.postsService.getListPost(user.userId, postQuery);
    return plainToInstance(CreatePostDto, posts);
  }

  @Delete('/:id')
  async deletePost(
    @User() user: AuthenticatedUser,
    @Param() id: string,
  ): Promise<string> {
    console.log('id1111', id);
    return this.postsService.deletePost(user.userId, id);
  }
}
