import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Like, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PageMetaDto } from '../utils/pagination/page-meta.dto';
import { PageDto } from '../utils/pagination/page.dto';
import { TodoQueryOptionsDto } from './dto/query-options.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
    private readonly usersService: UsersService
  ) {
  }

  async create(
    createTodoDto: CreateTodoDto,
    requestingUser: number
  ): Promise<Todo> {

    const user = await this.usersService.findOneById(requestingUser);
    const todo = this.todosRepository.create({
      ...createTodoDto,
      user,
    });

    return await this.todosRepository.save(todo);
  }

  async findAllByUserId(
    queryOptions: TodoQueryOptionsDto,
    requestingUser: number): Promise<PageDto<Todo>> {

    const queryBuilder = this.todosRepository.createQueryBuilder("todos")
    const filters = {
      user: requestingUser,
    }
    if ('done' in queryOptions) filters['done'] = queryOptions.done;
    if ('title' in queryOptions) {
      const title = queryOptions.title;
      queryBuilder.where({ title: Like(`%${title}%`)  });
    }
    queryBuilder
      .andWhere(filters)
      .orderBy(queryOptions.orderBy, queryOptions.order)
      .skip(queryOptions.skip)
      .take(queryOptions.take)

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities()

    const pageMetaDto =
      new PageMetaDto({ itemCount, pageOptionsDto: queryOptions });

    return new PageDto(entities, pageMetaDto)
  }

  async update(
    id: number,
    updateTodoDto: UpdateTodoDto,
    requestingUser: number
  ): Promise<void> {
    const todo = await this.todosRepository.findOne({
      where: { id },
      relations: ['user']
    });
    if(!todo) throw new NotFoundException("Todo not found!")
    if(todo.user.id !== requestingUser)
      throw new BadRequestException("Trying to modifies todo from another user.")

    const updatedTodo = {
      ...updateTodoDto,
      user: todo.user
    }
    await this.todosRepository.update(id, updatedTodo);
    return;
  }

  async remove(id: number, requestingUser: number): Promise<void> {
    const todo = await this.todosRepository.findOne({
      where: { id },
      relations: ['user']
    })
    if(!todo) throw new NotFoundException('Todo not found');
    if(requestingUser !== todo.user.id)
      throw new BadRequestException("Trying to delete another user todo.")

    await this.todosRepository.remove(todo);
    return;
  }
}
