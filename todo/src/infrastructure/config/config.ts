import { BadRequestException, LogLevel } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { readFileSync } from "fs";
import { Config } from "./config.interface";

const { name: appName } = JSON.parse(
  readFileSync("package.json", { encoding: "utf-8" }),
);

const config: Config = {
  appName,
  isProd: process.env.NODE_ENV === "production",
  connection: {
    auth: {
      host: process.env.AUTH_HOST,
      port: process.env.AUTH_PORT
    },
    todo: {
      host: process.env.TODO_HOST,
      port: process.env.TODO_PORT
    }
  },
  dataAccess: {
    host: process.env.MONGO_HOST || "",
    port: process.env.MONGO_PORT || "",
    options: {
      user: process.env.MONGO_USERNAME || "",
      pass: process.env.MONGO_PASSWORD || "",
      dbName: process.env.MONGO_DB_NAME || ""
    },
    debug: process.env.MONGO_DEBUG !== "false" || true,
  },
  auth: {
    key: process.env.AUTH_KEY || ""
  },
  validation: {
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    validationError: { target: false },
    exceptionFactory: (validationErrors: ValidationError[] = []) =>
      new BadRequestException(JSON.stringify(validationErrors)),
  },
  logLevel: getLogLevelConfig(),
};
export default config;

function getLogLevelConfig(): LogLevel[] {
  const levels: LogLevel[] = ["log", "error", "warn", "debug", "verbose"];
  const levelIndex = levels.indexOf(process.env.LOG_LEVEL as LogLevel);
  return levelIndex > -1
    ? levels.slice(0, levelIndex + 1)
    : levels.slice(0, levels.length);
}
