import { ApiProperty } from '@nestjs/swagger';

export class SignInSuccessResponseDto {
  @ApiProperty()
  access_token: string;
}
