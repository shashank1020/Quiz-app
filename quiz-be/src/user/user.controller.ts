import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';

import {
  createUserSchema,
  joiValidate,
  loginUserSchema,
} from '../lib/validator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: any) {
    joiValidate(loginUserSchema, body);
    return this.userService.login(body);
  }

  @Post('signup')
  async signup(@Body() body) {
    joiValidate(createUserSchema, body);
    return this.userService.create(body);
  }
}
