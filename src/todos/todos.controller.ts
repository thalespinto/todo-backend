import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from '../decorators/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { Response } from 'express';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(
    @Res() response: Response,
    @Body() createTodoDto: CreateTodoDto,
    @User() user: UserEntity,
  ) {
    const createdTodo = await this.todosService.create(createTodoDto, user.id);
    return response.status(HttpStatus.CREATED).json(createdTodo);
  }

  @Get(':userId')
  async findAllByUserId(
    @Res() response: Response,
    @Param('userId') id: string,
    @User() user: UserEntity,
  ) {
    const todos = await this.todosService.findAllByUserId(+id, user.id);
    return response.status(HttpStatus.OK).json(todos);
  }

  @Patch(':id')
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @User() user: UserEntity
  ) :Promise<Response> {
    await this.todosService.update(+id, updateTodoDto, user.id);
    return response.status(HttpStatus.ACCEPTED).send()
  }

  @Delete(':id')
  async remove(
    @Res() response: Response,
    @Param('id') id: string,
    @User() user: UserEntity
  ):Promise<Response> {
    await this.todosService.remove(+id, user.id);
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
