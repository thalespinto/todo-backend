import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { Public } from '../decorators/public.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { SignInSuccessResponseDto } from './dto/signin-success-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created.',
    type: User,
  })
  @Public()
  @Post('register')
  async register(
    @Res() response: Response,
    @Body() createUserDto: CreateUserDto
  ) {
    const createdUser = await this.authService.register(createUserDto);
    return response.status(HttpStatus.CREATED).json(createdUser);
  }

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'User logged.',
    type: SignInSuccessResponseDto,
  })
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
