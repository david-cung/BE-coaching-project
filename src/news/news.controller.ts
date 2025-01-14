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
import { NewsService } from './news.service';
import { CreateServiceDto } from './dto/create-news.dto';
import { JwtAuthGuard } from '@guard/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { AuthenticatedUser } from '../shared/interfaces';
import { S3Service } from '../common/services/s3/s3.service';
import { plainToInstance } from 'class-transformer';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly s3Service: S3Service,
  ) {}

  @Get('upload-url')
  async getUploadUrl(@Query('fileName') fileName: string) {
    return this.s3Service.generateUploadUrl(fileName);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createService(
    @User() user: AuthenticatedUser,
    @Body() serviceData: CreateServiceDto,
  ): Promise<string> {
    return this.newsService.createService(user.userId, serviceData);
  }

  @Get()
  async getListService(
    @User() user: AuthenticatedUser,
    @Query() serviceQuery: string,
  ): Promise<CreateServiceDto[]> {
    const news = await this.newsService.getListService(
      serviceQuery,
      user?.userId,
    );
    return plainToInstance(CreateServiceDto, news);
  }

  @Get('/:id')
  async getDetailService(
    @User() user: AuthenticatedUser,
    @Param() param,
  ): Promise<any> {
    return this.newsService.getServiceById(param.id, user?.userId);
  }

  @Delete('/:id')
  async deleteService(
    @User() user: AuthenticatedUser,
    @Param() param,
  ): Promise<string> {
    return this.newsService.deleteService(user.userId, param.id);
  }
}
