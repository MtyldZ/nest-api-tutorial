import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInModel, SignUpModel } from './models';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('sign-up')
  signUp(@Body() body: SignUpModel) {
    return this.authService.signUp(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() body: SignInModel) {
    return this.authService.signIn(body);
  }

}
