import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(@Body() createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
    const user = await this.usersService.createUser(createUserDto);
    return plainToClass(User, user);
  }

  async signIn(user: Pick<User, 'email' | 'password'>) {
    const _user = await this.usersService.findOneByEmail(user.email);
    if (!(await bcrypt.compare(user.password, _user.password))) {
      throw new UnauthorizedException();
    }

    const jwt = await this.jwtService.signAsync({ id: _user.id });

    return { access_token: jwt };
  }
}
