import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import config from '../../infrastructure/config/config';
import { AuthController } from '../../application/auth/controllers/auth.controller';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { AuthService } from './services/auth.service';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: `${config.auth.key}`,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}