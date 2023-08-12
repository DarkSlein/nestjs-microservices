import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { LoggerService } from "../services/logger.service";

/**
 * Logs the requests
 */
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  /**
   * The logger
   */
  private readonly logger: LoggerService = new LoggerService(
    LoggerInterceptor.name,
  );

  /**
   * The intercept handler
   * @param context Context
   * @param next Next call
   * @returns Handler
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();
    const contextType = context.getType();
    this.logRpcMessage(context, 0);
    return next.handle().pipe(
      tap(
        async (responsePromise?) => {
          const response = await responsePromise;
          if (response) this.logger.debug(JSON.stringify(response));
          if (contextType === "rpc") {
            this.logRpcMessage(context, startTime);
          }
        },
        (error: Error) => {
          const reqTime = Date.now() - startTime;
          this.logger.error(`[${error.name}] ${error.message} ${reqTime}ms`);
          this.logger.error(JSON.stringify(error));
        },
      ),
    );
  }

  /**
   * Logs kafka messages
   * @param context Context
   * @param startTime Start time
   * @returns Handler
   */
  private logRpcMessage(context: ExecutionContext, startTime: number) {
    if (context.getType() !== "rpc") return;
    const reqTime = Date.now() - startTime;
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;
    const args = context.getArgs();
    for (const arg of args) {
      if (!arg.args) {
        this.logger.log(
          `${arg.partition} ${arg.topic} [${controllerName}:${handlerName}] ${reqTime}ms`,
        );
      }
    }
  }
}
