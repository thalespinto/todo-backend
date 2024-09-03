import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTodoDto {

  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  readonly done?: boolean;

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  readonly deadline: Date;
}
