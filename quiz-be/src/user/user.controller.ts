import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import UserEntity from './user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: any) {
    return this.userService.login(body);
  }

  @Post('signup')
  async signup(@Body() body): Promise<UserEntity> {
    return this.userService.create(body);
  }
}
