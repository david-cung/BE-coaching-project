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

  async getListPost(
    postQuery: string,
    userId?: string,
  ): Promise<CreatePostDto[] | []> {
    if (userId) {
      return this.postRepository.find({ where: { userId, isDeleted: false } });
    }
    const a = await this.postRepository.find({ where: { isDeleted: false } });
    console.log('a', a);
    return a;
  }

  async getPostById(id: string, userId?: string) {
    console.log('userId', userId, id);
    if (!userId) {
      return this.postRepository.findOne({ where: { id, isDeleted: false } });
    }
    return this.postRepository.findOne({
      where: { id, isDeleted: false, userId },
    });
  }

  async createPost(userId: string, postData: CreatePostDto): Promise<any> {
    const id = uuidv4();
    await this.postRepository.insert({ ...postData, userId, id });
    return id;
  }

  async deletePost(userId: string, postId: string): Promise<any> {
    await this.postRepository.update(postId, { isDeleted: true, userId });
    return 'Post deleted successfully';
  }
}
