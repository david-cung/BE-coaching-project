import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() data: LoginUserDto): Promise<{ accessToken: string }> {
    return this.authService.login(data);
  }

  // @UseGuards(LocalAuthGuard)
  @Post('/google')
  google(@Body() user): Promise<any> {
    return this.authService.google(user);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get("/me")
  // async myProfile(@Request() request, @AuthUser() authUser): Promise<any> {
  //   const user = await this.userService.findById(authUser.sub);

  //   return {
  //     ...plainToClass(User, user),
  //     authUser,
  //   };
  // }
}
