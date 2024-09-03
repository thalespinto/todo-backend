import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Todo } from '../../todos/entities/todo.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'name', length: 255, nullable: false })
  name: string;

  @ApiProperty()
  @Column({ name: 'email', length: 100, unique: true, nullable: false })
  email: string;

  @ApiProperty()
  @Exclude()
  @Column({ name: 'password', length: 255, nullable: false })
  password: string;

  @ApiProperty()
  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];

  @ApiProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: Date;
}
