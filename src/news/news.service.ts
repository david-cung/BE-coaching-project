/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateNewsDto } from './dto/create-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from '../entity/news.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { GetServiceDto } from 'src/services/dto/get-service.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newRepository: Repository<News>,
  ) {}

  async getListNews(
    newsQuery: GetServiceDto,
    userId?: string,
  ): Promise<{
    data: News[];
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
  }> {
    const { limit = 10, offset = 0, category } = newsQuery;

    // Build base query conditions
    const whereConditions: any = { isDeleted: false };
    
    if (userId) {
      whereConditions.userId = userId;
    }
    
    if (category) {
      whereConditions.category = category;
    }

    // Query for data with pagination
    const [data, total] = await Promise.all([
      this.newRepository.find({
        where: whereConditions,
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      }),
      this.newRepository.count({
        where: whereConditions,
      })
    ]);

    return {
      data,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit)
    };
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

  async updateNews(id: string, serviceData: CreateNewsDto, userId?: string) {
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
  try {
    // Lấy thông tin service trước khi xóa để có được đường dẫn ảnh
    const service = await this.newRepository.findOne({ where: { id: serviceId } });
    
    if (!service) {
      throw new Error('Service not found');
    }
    
    // Xóa record trong database
    await this.newRepository.delete(serviceId);
    
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
