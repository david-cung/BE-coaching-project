/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateNewsDto } from './dto/create-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from '../entity/news.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newRepository: Repository<News>,
  ) {}

  async getListService(
    serviceQuery: string,
    userId?: string,
  ): Promise<News[] | []> {
    if (userId) {
      return this.newRepository.find({
        where: { userId, isDeleted: false },
      });
    }
    return this.newRepository.find({ where: { isDeleted: false } });
  }

  async getServiceById(id: string, userId?: string) {
    if (!userId) {
      return this.newRepository.findOne({
        where: { id, isDeleted: false },
      });
    }
    return this.newRepository.findOne({
      where: { id, isDeleted: false, userId },
    });
  }

  async updateService(id: string, serviceData: CreateNewsDto, userId?: string) {
    if (!userId) {
      return this.newRepository.update(id, {
        ...serviceData,
      });
    }
    return this.newRepository.findOne({
      where: { id, isDeleted: false, userId },
    });
  }

  async createNews(
    userId: string,
    serviceData: CreateNewsDto,
  ): Promise<any> {
    const id = uuidv4();
    await this.newRepository.insert({ ...serviceData, userId, id });
    return id;
  }

  async deleteService(userId: string, serviceId: string): Promise<any> {
    await this.newRepository.update(serviceId, { isDeleted: true, userId });
    return 'Service deleted successfully';
  }
}
