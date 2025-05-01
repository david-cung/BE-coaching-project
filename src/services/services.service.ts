import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateServiceDto } from './dto/create-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from '../entity/services.entity';
import { DataSource, Repository } from 'typeorm';
import { GetServiceDto } from './dto/get-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly dataSource: DataSource,
  ) {}

  async getListService(
    serviceQuery: GetServiceDto,
    userId?: string,
  ): Promise<CreateServiceDto[] | []> {
    const { limit, offset, category } = serviceQuery;
    const query = this.dataSource.createQueryBuilder(Service, 'service');

    if (userId) {
      const data = await query
        .where('service.isDeleted IS NOT TRUE')
        .orderBy('service.updatedAt DESC')
        .limit(limit)
        .offset(offset)
        .getMany();
      return data;
    }

    if (category) {
      query
        .where('service.isDeleted IS NOT TRUE')
        .andWhere('service.category = :category', { category })
        .orderBy('service.updatedAt DESC');
    }

    return query.limit(limit).offset(offset).getMany();
  }

  async getServiceById(id: string, userId?: string) {
    if (!userId) {
      return this.serviceRepository.findOne({
        where: { id, isDeleted: false, userId },
      });
    }
    return this.serviceRepository.findOne({
      where: { id, isDeleted: false, userId },
    });
  }

  async updateService(
    id: string,
    serviceData: CreateServiceDto,
    userId?: string,
  ) {
    if (!userId) {
      return this.serviceRepository.update(id, {
        ...serviceData,
      });
    }
    return this.serviceRepository.findOne({
      where: { id, isDeleted: false, userId },
    });
  }

  async createService(
    userId: string,
    ServiceData: CreateServiceDto,
  ): Promise<any> {
    const id = uuidv4();
    await this.serviceRepository.insert({ ...ServiceData, userId, id });
    return id;
  }

  async deleteService(userId: string, ServiceId: string): Promise<any> {
    await this.serviceRepository.update(ServiceId, { isDeleted: true, userId });
    return 'Service deleted successfully';
  }
}
