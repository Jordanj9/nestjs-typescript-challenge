import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
import { CreateUserDto } from '../../auth/controllers/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import {UpdateUserDto} from "../controllers/dto/update-user.dto";

// @ts-ignore
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({
      where: {
        email,
      },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.encryptPassword(createUserDto.password);
    const user: User = await this.repository.create(createUserDto);
    return await this.repository.save(user);
  }

  async encryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
  async findOneById(id: number): Promise<User | undefined> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    return this.repository.findOne({ where: { id } });
  }
  async assignRole(user: User, role: string) {
    user.role = role;
    return await this.repository.save(user);
  }
}
