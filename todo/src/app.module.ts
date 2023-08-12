import { Global, Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";

import config from "./infrastructure/config/config";
import { LoggerInterceptor } from "./domain/common/interceptors/logger.interceptor";
import { TodoModule } from "./domain/modules/todo.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./domain/common/strategies/jwt.strategy";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb://${config.dataAccess.options.user}:${config.dataAccess.options.pass}@${config.dataAccess.host}:${config.dataAccess.port}`),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: `${config.auth.key}`,
      signOptions: { expiresIn: '1h' },
    }),
    TodoModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(config.validation),
    },
  ],
})
export default class AppModule {}
