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
    private readonly ServiceRepository: Repository<Service>,
    private readonly dataSource: DataSource,
  ) {}

  async getListService(
    ServiceQuery: GetServiceDto,
    userId?: string,
  ): Promise<CreateServiceDto[] | []> {
    const { limit, offset } = ServiceQuery;

    if (userId) {
      const data = await this.dataSource
        .createQueryBuilder(Service, 'service')
        .where('service.isDeleted IS NOT TRUE')
        .orderBy('service.updatedAt DESC')
        .limit(limit)
        .offset(offset)
        .getMany();
      return data;
    }
    return this.ServiceRepository.find({ where: { isDeleted: false } });
  }

  async getServiceById(id: string, userId?: string) {
    if (!userId) {
      return this.ServiceRepository.findOne({
        where: { id, isDeleted: false, userId },
      });
    }
    return this.ServiceRepository.findOne({
      where: { id, isDeleted: false, userId },
    });
  }

  async updateService(
    id: string,
    serviceData: CreateServiceDto,
    userId?: string,
  ) {
    if (!userId) {
      return this.ServiceRepository.update(id, {
        ...serviceData,
      });
    }
    return this.ServiceRepository.findOne({
      where: { id, isDeleted: false, userId },
    });
  }

  async createService(
    userId: string,
    ServiceData: CreateServiceDto,
  ): Promise<any> {
    const id = uuidv4();
    await this.ServiceRepository.insert({ ...ServiceData, userId, id });
    return id;
  }

  async deleteService(userId: string, ServiceId: string): Promise<any> {
    await this.ServiceRepository.update(ServiceId, { isDeleted: true, userId });
    return 'Service deleted successfully';
  }
}
