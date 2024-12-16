import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login.user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(data: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = data;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect');
    }
    const hash = await bcrypt.hash(password, 10);
    const compareResult = await bcrypt.compare(password, hash);

    if (!compareResult) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    return {
      accessToken: await this.jwtService.signAsync(
        { email, userId: user.id },
        {
          expiresIn: `${this.configService.get<string>('jwtExpiresIn')}d`,
        },
      ),
    };
  }

  async google(user: User): Promise<any> {
    const payload = {
      email: user.email,
      userName: user.userName,
      photoURL: user.photoURL,
      password: '123',
    };
    const userExisted = await this.userService.findByEmail(user.email);
    if (userExisted) {
      return {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: this.configService.get<string>('jwtExpiresIn'),
        }),
        ...userExisted,
      };
    }
    await this.userService.createUser(payload);

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('jwtExpiresIn'),
      }),
    };
  }
}
