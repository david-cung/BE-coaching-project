import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateServiceDto } from './dto/create-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from '../entity/news.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly serviceRepository: Repository<News>,
  ) {}

  async getListService(
    serviceQuery: string,
    userId?: string,
  ): Promise<News[] | []> {
    if (userId) {
      return this.serviceRepository.find({
        where: { userId, isDeleted: false },
      });
    }
    return this.serviceRepository.find({ where: { isDeleted: false } });
  }

  async getServiceById(id: string, userId?: string) {
    console.log('userId', userId, id);
    if (!userId) {
      return this.serviceRepository.findOne({
        where: { id, isDeleted: false },
      });
    }
    return this.serviceRepository.findOne({
      where: { id, isDeleted: false, userId },
    });
  }

  async createService(
    userId: string,
    serviceData: CreateServiceDto,
  ): Promise<any> {
    const id = uuidv4();
    await this.serviceRepository.insert({ ...serviceData, userId, id });
    return id;
  }

  async deleteService(userId: string, serviceId: string): Promise<any> {
    await this.serviceRepository.update(serviceId, { isDeleted: true, userId });
    return 'Service deleted successfully';
  }
}
