import { ConflictException, Injectable } from '@nestjs/common';
import UserEntity from './entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  async getAll() {
    return await UserEntity.find();
  }

  async getOne(email) {
    return await UserEntity.findOne({ where: { email } });
  }

  async create(user: UserEntity) {
    const { email, password } = user;
    const foundOne = await this.getOne(email);
    if (foundOne) throw new ConflictException('user exist');

    const salt = await bcrypt.genSalt();
    const saltedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserEntity();
    newUser.email = email.toLowerCase();
    newUser.password = saltedPassword;
    await newUser.save();
    return newUser;
  }

  async login(userData: UserEntity) {
    const foundOne = await this.getOne(userData.email);
    if (foundOne) {
      if (await bcrypt.compare(userData.password, foundOne.password)) {
        return { id: foundOne.id, email: userData.email };
      }
    }
  }
}
