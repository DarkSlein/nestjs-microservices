import { Injectable, Logger, LoggerService as NestLoggerService } from "@nestjs/common";
import { formatWithOptions } from "util";
/// ///////////////////////////////////////////

/**
 * The service for logging
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  /**
   * The logger
   */
  private readonly logger: Logger;

  /**
   * The context
   */
  private readonly context: string;

  //= ============================================================================================================
  /**
   * The constructor for the logger
   * @param context
   */
  constructor(context?: string) {
    this.logger = new Logger(context, {timestamp: true});
    this.context = context;
  }

  //= ============================================================================================================
  /**
   * Creates the logger
   * @param context The context
   * @returns The logger
   */
  static createLogger(context?: string): LoggerService {
    return new LoggerService(context);
  }

  //= ============================================================================================================
  /**
   * Logs the message
   * @param message The message
   * @param args The arguments
   */
  public log(message: string, ...args: any[]) {
    this.logger.log(this.format(message, args));
  }

  //= ============================================================================================================
  /**
   * Logs the error message
   * @param message The message
   * @param error The error
   * @param args The arguments
   */
  public error(message: string, error?: string | Error, ...args: any[]) {
    this.logger.error(this.format(message, args), error instanceof Error ? error.stack : error);
  }

  //= ============================================================================================================
  /**
   * Logs the warning message
   * @param message The message
   * @param args The arguments
   */
  public warn(message: string, ...args: any[]) {
    this.logger.warn(this.format(message, args));
  }

  //= ============================================================================================================
  /**
   * Logs the debug message
   * @param message The message
   * @param args The arguments
   */
  public debug(message: string, ...args: any[]) {
    this.logger.debug(this.format(message, args));
  }

  //= ============================================================================================================
  /**
   * Logs the verbose message
   * @param message The message
   * @param args The arguments
   */
  public verbose(message: string, ...args: any[]) {
    this.logger.verbose(this.format(message, args));
  }

  //= ============================================================================================================
  /**
   * Formats the message
   * @param message The message
   * @param args The arguments
   * @returns The formatted message
   */
  private format(message: string, args?: string[]) {
    if (!args.length) return message;

    return formatWithOptions({ colors: true, depth: 5 }, message, ...args);
  }
  //= ============================================================================================================
}
