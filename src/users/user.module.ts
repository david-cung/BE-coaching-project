import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscriber } from './subscriber/user.subscriber';
import { UserService } from './user.service';
import { User } from '../entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserSubscriber, UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
