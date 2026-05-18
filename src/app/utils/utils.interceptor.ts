import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class UtilsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((response) => {
        if (
          response &&
          typeof response === 'object' &&
          ('data' in response || 'message' in response)
        ) {
          return {
            statusCode: res.statusCode,
            success: res.statusCode >= 200 && res.statusCode < 300,
            message: response.message || null,
            meta: response.meta,
            data: response.data,
          };
        }

        return {
          statusCode: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          message: response.meta ?? `Request successfully completed`,
          meta: response.data,
          data: response,
        };
      }),
      catchError((error) => throwError(() => error)),
    );
  }
}
