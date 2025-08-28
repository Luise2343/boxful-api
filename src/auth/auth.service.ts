import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(email: string, password: string) {
    const exists = await this.users.findByEmail(email.toLowerCase());
    if (exists) throw new ConflictException('Email already registered');
    const passwordHash = await bcrypt.hash(password, 10);
    const safe = await this.users.create(email.toLowerCase(), passwordHash);
    const access_token = await this.jwt.signAsync({ sub: safe.id, email: safe.email });
    return { user: safe, access_token };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email.toLowerCase());
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const access_token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return { user: this.users.toSafe(user), access_token };
  }
}
