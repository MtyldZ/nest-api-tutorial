import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignInModel, SignUpModel } from './models';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService) {
  }

  async signUp(args: SignUpModel) {
    const { email, password } = args;
    const userWithSameEmail = await this.prisma.user.findUnique({ where: { email } });
    if (userWithSameEmail) throw new ConflictException(`Credentials are taken, email:${email}`);

    const hash = await argon.hash(password);
    const user = await this.prisma.user.create({
      data: { email, password: hash },
    });

    delete user.password;
    return user;
  }

  async signIn(args: SignInModel) {
    const { email, password } = args;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new HttpException('Credentials are incorrect', 400);

    if (!await argon.verify(user.password, password)) throw new HttpException('Credentials are incorrect', 400);

    return { token: await this.signToken({ id: user.id, email: user.email }) };
  }

  async signToken(args: { id: number, email: string }): Promise<string> {
    const { id, email } = args;
    return this.jwt.signAsync({
      id, email,
    }, {
      expiresIn: '14d', secret: this.config.get('AUTH_JWT_SECRET'),
    });
  }
}
