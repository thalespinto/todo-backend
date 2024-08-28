import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus, Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from '../decorators/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { Response } from 'express';
import { PageDto } from '../utils/pagination/page.dto';
import { Todo } from './entities/todo.entity';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../decorators/api-tags.decorator';
import { TodoQueryOptionsDto } from './dto/query-options.dto';

@Controller('todos')
@ApiTags('Todos')
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

  @Get()
  @ApiPaginatedResponse(Todo)
  async findAllByUserId(
    @Res() response: Response,
    @Query() QueryDto: TodoQueryOptionsDto,
    @User() user: UserEntity,
  ): Promise<Response<PageDto<Todo>>> {
    const todos =
      await this.todosService.findAllByUserId(QueryDto, user.id);
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
