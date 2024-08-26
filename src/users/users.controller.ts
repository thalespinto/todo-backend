import {
  Body,
  Controller,
  Get, HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Response, response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<Response<User[]>> {
    const users = this.usersService.findAll();
    return response.status(HttpStatus.ACCEPTED).json(users);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<Response<User>> {
    const user = await this.usersService.findOneById(+id);
    return response.status(HttpStatus.ACCEPTED).json(user)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<Response> {
    await this.usersService.update(+id, updateUserDto);
    return response.status(HttpStatus.ACCEPTED);
  }

}
