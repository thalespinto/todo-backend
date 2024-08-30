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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
