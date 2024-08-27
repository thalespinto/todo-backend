import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTodoDto {

  @IsNumber()
  readonly user: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsBoolean()
  @IsOptional()
  readonly done?: boolean;

  @IsDate()
  @Type(() => Date)
  readonly deadline: Date;

}
