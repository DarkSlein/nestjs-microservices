import {
  LogLevel,
  ValidationPipeOptions,
} from "@nestjs/common";
import { ConnectOptions } from "mongoose";

export type RecursivePartial<T> = T extends object
  ? { [K in keyof T]?: RecursivePartial<T[K]> }
  : T;

/**
 * The config interface
 */
export interface Config {
  /**
   * App name
   */
  appName: string;

  /**
   * Connection
   */
  connection: {
    auth: {
      host: string,
      port: string
    },
    todo: {
      host: string,
      port: string
    }
  },
  auth: {
    key: string
  }
  /**
   * Is this is a production config
   */
  isProd: boolean;
  /**
   * The access to a database
   */
  dataAccess: {
    host: string;
    port: string;
    debug: boolean;
    options: ConnectOptions;
  };
  /**
   * The validation pipe options
   */
  validation: ValidationPipeOptions;

  logLevel: LogLevel[];
}
