import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../utils/pagination/page-options.dto';
import { ParseOptionalBoolean } from '../../decorators/parse-optional-boolean.decorator';

export class TodoQueryOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @ParseOptionalBoolean()
  @IsOptional()
  readonly done?: boolean;
}