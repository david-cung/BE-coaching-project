import {
  Body,
  Controller,
  Post,
  UseGuards,
  Query,
  Get,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from '@guard/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { AuthenticatedUser } from '../shared/interfaces';
import { S3Service } from '../common/services/s3/s3.service';
import { GetServiceDto } from './dto/get-service.dto';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
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
    @Body() ServiceData: CreateServiceDto,
  ): Promise<string> {
    return this.servicesService.createService(user.userId, ServiceData);
  }

  @Get()
  async getListService(
    @User() user: AuthenticatedUser,
    @Query() ServiceQuery: GetServiceDto,
  ) {
    const services = await this.servicesService.getListService(
      ServiceQuery,
      user?.userId,
    );
    return services;
  }

  @Get('/:id')
  async getDetailService(
    @User() user: AuthenticatedUser,
    @Param() param,
  ): Promise<any> {
    return this.servicesService.getServiceById(param.id, user?.userId);
  }

  @Put('/:id')
  async updateService(
    @User() user: AuthenticatedUser,
    @Param() param,
    @Body() serviceData: CreateServiceDto,
  ): Promise<any> {
    return this.servicesService.updateService(
      param.id,
      serviceData,
      user?.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteService(
    @User() user: AuthenticatedUser,
    @Param() param,
  ): Promise<string> {
    return this.servicesService.deleteService(user.userId, param.id);
  }
}
