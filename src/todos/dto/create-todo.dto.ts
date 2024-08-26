import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class CreateTodoDto {

  @IsNumber()
  readonly user: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsBoolean()
  readonly done: boolean;

  @IsDate()
  readonly deadline: Date;

}
