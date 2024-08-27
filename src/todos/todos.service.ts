import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PageOptionsDto } from '../utils/pagination/page-options.dto';
import { PageMetaDto } from '../utils/pagination/page-meta.dto';
import { PageDto } from '../utils/pagination/page.dto';

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
    if(requestingUser !== createTodoDto.user)
      throw new BadRequestException("Trying to create todo for another user.");

    const user = await this.usersService.findOneById(createTodoDto.user);
    const todo = this.todosRepository.create({
      ...createTodoDto,
      user,
    });

    return await this.todosRepository.save(todo);
  }

  async findAllByUserId(
    pageOptionsDto: PageOptionsDto,
    userId: number,
    requestingUser: number): Promise<PageDto<Todo>> {
    if(requestingUser !== userId )
      throw new BadRequestException("Trying to see another user todos.");

    const queryBuilder = this.todosRepository.createQueryBuilder("todos")
    queryBuilder.
      orderBy(pageOptionsDto.orderBy, pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities()

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

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
