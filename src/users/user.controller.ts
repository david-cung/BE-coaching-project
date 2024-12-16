import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userData: CreateUserDto): Promise<string> {
    console.log('userData', userData);
    await this.userService.createUser(userData);

    return 'Sign up successfully';
  }

  // @Put("/:id")
  // update(
  //   @Param("id") id: EntityId,
  //   @Body() userData: UpdateUserDto
  // ): Promise<User> {
  //   return this.userService.update(id, userData);
  // }

  // @Delete("/:id")
  // destroy(@Param("id") id: EntityId): Promise<DeleteResult> {
  //   return this.userService.delete(id);
  // }
}
