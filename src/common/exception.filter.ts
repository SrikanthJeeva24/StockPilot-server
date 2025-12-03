import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Ignore Chrome DevTools probe requests
    if (request.url.startsWith('/.well-known')) {
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract readable message
    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message || 'Internal Server Error';

    // Normalize message (Swagger-friendly + consistent)
    if (typeof message === 'object' && message.message) {
      message = message.message;
    }

    this.logger.error(
      `[${request.method}] ${request.url} → ${status} | ${JSON.stringify(
        message,
      )}`,
    );

    return response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });
  }
}
