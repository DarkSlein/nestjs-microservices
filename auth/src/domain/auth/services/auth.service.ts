import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';
import config from '../../../infrastructure/config/config';
import { SignUpDto } from '../../../application/auth/dtos/signup.dto';
import { AuthDto } from '../../../application/auth/dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<{ id: string; token: string }> {
    const { password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userModel.create({ password: hashedPassword });
    await newUser.save();

    const token = this.jwtService.sign({ sub: newUser._id }, {secret: `${config.auth.key}`});

    return { id: newUser._id, token };
  }

  async signin(authDto: AuthDto): Promise<{ token: string }> {
    const { id, password } = authDto;
    const user = await this.userModel.findById(id);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Bad id or password');
    }

    const token = this.jwtService.sign({ sub: user._id }, {secret: `${config.auth.key}`});

    return { token };
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }
}
