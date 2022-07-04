import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import UserEntity from './user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/constants';

@Injectable()
export class UserService {
  async create({ email, password, name }) {
    const user = await UserEntity.findOne({
      where: { email: email.toLowerCase() },
    });
    if (user) throw new ConflictException('user exist with same email');
    const saltedPassword = bcrypt.hashSync(password, 10);
    const newUser = new UserEntity();
    newUser.email = email.toLowerCase();
    newUser.password = saltedPassword;
    newUser.name = name;
    await newUser.save();
    return newUser;
  }

  async login({ email, password }) {
    const user = await UserEntity.findOne({
      where: { email: email.toLowerCase() },
    });
    if (user && bcrypt.compareSync(password, user.password)) {
      return {
        ...user,
        password: undefined,
        token: jwt.sign({ userId: user.id }, JWT_SECRET),
      };
    } else {
      return new HttpException('Username and password do not match', 400);
    }
  }
}
