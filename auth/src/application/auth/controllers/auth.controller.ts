import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SignUpDto } from '../dtos/signup.dto';
import { AuthDto } from '../dtos/auth.dto';
import { JwtAuthGuard } from '../../../domain/common/guards/jwtAuth.guard';
import { AuthService } from '../../../domain/auth/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() signUpDto: SignUpDto): Promise<{ id: string; token: string }> {
    return this.authService.signup(signUpDto);
  }

  @Post('/signin')
  async signin(@Body() authDto: AuthDto): Promise<{ token: string }> {
    return this.authService.signin(authDto);
  }

  @Get('/user')
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() request): Promise<{ id: string }> {
    return { id: request.user.id };
  }
}