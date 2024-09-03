import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully retrieved.',
    type: User,
  })
  @Get(':id')
  async findOneById(
    @Res() response: Response,
    @Param('id') id: string
  ): Promise<Response<User>> {
    const user = await this.usersService.findOneById(+id);
    return response.status(HttpStatus.OK).json(user);
  }

  @Patch(':id')
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<Response> {
    await this.usersService.update(+id, updateUserDto);
    return response.status(HttpStatus.ACCEPTED).send();
  }
}
