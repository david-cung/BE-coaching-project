import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateServiceDto } from './dto/create-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from '../entity/services.entity';
import { DataSource, Repository } from 'typeorm';
import { GetServiceDto } from './dto/get-service.dto';
import * as fs from 'fs';
import * as path from 'path';

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
        .andWhere('service.category = :category', { category });
    }

    return query
      .limit(limit)
      .offset(offset)
      .orderBy('service.createdAt', 'DESC')
      .getMany();
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

  async deleteService(userId: string, serviceId: string): Promise<any> {
    try {
      // Lấy thông tin service trước khi xóa để có được đường dẫn ảnh
      const service = await this.serviceRepository.findOne({
        where: { id: serviceId },
      });

      if (!service) {
        throw new Error('Service not found');
      }

      // Xóa record trong database
      await this.serviceRepository.delete(serviceId);

      // Xóa file ảnh nếu có
      if (service.image) {
        try {
          // Trích xuất tên file từ URL
          // Giả sử URL có dạng: https://intest.vn/uploads/filename.jpg
          const imageUrl = service.image;
          const filename = imageUrl.split('/').pop(); // Lấy tên file cuối cùng

          if (filename) {
            const filePath = path.join('/intest/uploads', filename);

            // Kiểm tra file có tồn tại không trước khi xóa
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Image file deleted: ${filePath}`);
            }
          }
        } catch (fileError) {
          console.error('Error deleting image file:', fileError);
          // Không throw error ở đây vì record đã được xóa thành công
          // Chỉ log lỗi để theo dõi
        }
      }

      return 'Service deleted successfully';
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
}
