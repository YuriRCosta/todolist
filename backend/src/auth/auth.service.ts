import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    const isValid = await bcrypt.compare(pass, user.password);
    if (user && isValid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async validateUserByUsername(username: string): Promise<User | null> {
    return this.userService.findOne(username);
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.validateUserByUsername(decoded.username);
      return !!user;
    } catch (error) {
      return false;
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.create(username, hashedPassword);
  }
}
