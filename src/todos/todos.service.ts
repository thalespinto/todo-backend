import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

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

  async findAllByUserId(userId: number, requestingUser: number): Promise<Todo[]> {
    if(requestingUser !== userId )
      throw new BadRequestException("Trying to see another user todos.");

    return await this.todosRepository.find({
      where: { user: { id: userId } },
    });
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
