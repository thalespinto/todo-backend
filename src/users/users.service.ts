import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const emailAlreadyCreated = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (emailAlreadyCreated) {
      throw new BadRequestException('Email already exists!');
    }

    return await this.usersRepository.save(createUserDto);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    return plainToClass(User, user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const updateResult = await this.usersRepository.update(id, updateUserDto);
    if (!updateResult) throw new NotFoundException('User not found');

    return;
  }
}
