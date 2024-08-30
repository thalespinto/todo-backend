import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Res() response: Response,
    @Body() createUserDto: CreateUserDto
  ) {
    const createdUser = await this.authService.register(createUserDto);
    return response.status(HttpStatus.CREATED).json(createdUser);
  }

  @Public()
  @Post('login')
  async signIn(
    @Res() response: Response,
    @Body() user: Pick<User, 'email' | 'password'>
  ) {
    const successResp = await this.authService.signIn(user);
    return response.status(HttpStatus.ACCEPTED).json(successResp);
  }
}
