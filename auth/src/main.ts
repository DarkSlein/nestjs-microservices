/* eslint-disable import/first */
// Loads .env file into process.env
import * as dotenv from "dotenv";

dotenv.config();

import { NestFactory } from "@nestjs/core";
import AppModule from "./app.module";
import config from "src/infrastructure/config/config";
import { LoggerService } from "./domain/common/services/logger.service";

const logger: LoggerService = LoggerService.createLogger("BootstrapApp");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

/*  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: config.connection.todo.host,
      port: config.connection.todo.port,
    },
  });

  await app.startAllMicroservices();*/
  app.listen(config.connection.auth.port);

  logger.debug(`Service '${config.appName}' started...`);
  logger.debug(`Server listen on ${config.connection.auth.port} port`);
}

/**
 * calling main bootstrap function
 */
bootstrap();
