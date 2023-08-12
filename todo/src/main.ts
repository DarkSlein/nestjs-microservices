/* eslint-disable import/first */
// Loads .env file into process.env
import * as dotenv from "dotenv";

dotenv.config();

import { NestFactory } from "@nestjs/core";
import AppModule from "./app.module";
import config from "./infrastructure/config/config";
import { LoggerService } from "./domain/common/serivces/logger.service";

const logger: LoggerService = LoggerService.createLogger("BootstrapApp");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.listen(config.connection.todo.port);

  logger.debug(`Service '${config.appName}' started...`);
  logger.debug(`Server listen on ${config.connection.todo.port} port`);
}

/**
 * calling main bootstrap function
 */
bootstrap();
