import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async getListPost(userId: string, postQuery: string): Promise<Post[] | []> {
    if (postQuery.length) {
      console.log('postQuery');
    }
    return this.postRepository.find({ where: { userId } });
  }

  // async getPostById(id: number) {
  //   // Implement your logic to fetch a single post by ID
  //   return null;
  // }

  async createPost(userId: string, postData: CreatePostDto): Promise<any> {
    const id = uuidv4();
    await this.postRepository.insert({ ...postData, userId, id });
    return id;
  }
}
