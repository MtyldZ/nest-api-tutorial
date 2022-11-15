import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { GetUser } from '../auth/decorator/user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {

  @Get('me')
  async getMe(@GetUser() user: User) {
    return user;
  }

}
