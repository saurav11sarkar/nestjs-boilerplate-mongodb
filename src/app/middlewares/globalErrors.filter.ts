import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';

import { ValidationError } from 'class-validator';
import { handleClassValidatorErrors } from '../errors/classValidatorErrors';
import { handleHttpException } from '../errors/httpException';
import { MulterError } from 'multer';
import { handleMulterError } from '../errors/multerError';
import {
  handleCloudinaryError,
  isCloudinaryError,
} from '../errors/cloudinaryError';
import { ZodError } from 'zod';
import { handleZodError } from '../errors/zodError';
import { handleMongooseValidationError } from '../errors/mongooseValidationError';
import { handleCastError } from '../errors/castError';
import { handleDuplicateKeyError } from '../errors/duplicateKeyError';
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import { handleJwtError } from '../errors/jwtError';
import { handleSyntaxError } from '../errors/syntaxError';
import { handleProgrammerError } from '../errors/programmerError';
import { AxiosError } from 'axios';
import { handleAxiosError } from '../errors/axiosError';
import config from '../config';

// Types
export interface TErrorSource {
  path: string | number;
  message: string;
}

export interface TErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
  stack?: string | null;
}

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(err: T, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const isDev = config.env === 'development';

    this.logger.error(
      `[${request.method}] ${request.url}`,
      err instanceof Error ? err.stack : String(err),
    );

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong!';
    let errorSources: TErrorSource[] = [
      { path: '', message: 'Something went wrong' },
    ];

    // 1️ Raw class-validator ValidationError[]
    if (
      Array.isArray(err) &&
      err.length > 0 &&
      err[0] instanceof ValidationError
    ) {
      statusCode = HttpStatus.BAD_REQUEST;
      ({ message, errorSources } = handleClassValidatorErrors(
        err as ValidationError[],
      ));
    }

    // 2  NestJS HttpException
    else if (err instanceof HttpException) {
      const res = err.getResponse() as any;
      if (
        typeof res === 'object' &&
        Array.isArray(res.message) &&
        res.message[0] instanceof ValidationError
      ) {
        statusCode = err.getStatus();
        ({ message, errorSources } = handleClassValidatorErrors(
          res.message as ValidationError[],
        ));
      } else {
        ({ statusCode, message, errorSources } = handleHttpException(err));
      }
    }

    // 3  Multer Error
    else if (err instanceof MulterError) {
      ({ statusCode, message, errorSources } = handleMulterError(err));
    }

    // 4  Cloudinary Error
    else if (isCloudinaryError(err)) {
      ({ statusCode, message, errorSources } = handleCloudinaryError(err));
    }

    // 5  ZodError
    else if (err instanceof ZodError) {
      ({ statusCode, message, errorSources } = handleZodError(err));
    }

    // 6 Mongoose ValidationError
    else if (
      err instanceof Error &&
      err.name === 'ValidationError' &&
      'errors' in err
    ) {
      ({ statusCode, message, errorSources } = handleMongooseValidationError(
        err as unknown as MongooseError.ValidationError,
      ));
    }

    // 7  Mongoose CastError
    else if (err instanceof MongooseError.CastError) {
      ({ statusCode, message, errorSources } = handleCastError(err));
    }

    // 8  MongoDB Duplicate Key
    else if (err instanceof MongoError && (err as any).code === 11000) {
      ({ statusCode, message, errorSources } = handleDuplicateKeyError(
        err as MongoError & { keyValue?: Record<string, unknown> },
      ));
    }

    // 9 JWT Errors
    else if (
      err instanceof TokenExpiredError ||
      err instanceof NotBeforeError ||
      err instanceof JsonWebTokenError
    ) {
      ({ statusCode, message, errorSources } = handleJwtError(err));
    }

    // 1️0  SyntaxError (bad JSON body)
    else if (err instanceof SyntaxError && 'body' in err) {
      ({ statusCode, message, errorSources } = handleSyntaxError());
    }

    // 11  TypeError / RangeError
    else if (err instanceof TypeError || err instanceof RangeError) {
      ({ statusCode, message, errorSources } = handleProgrammerError(err));
    }

    // 12  Axios Error (external API call)
    else if (err instanceof AxiosError || (err as any)?.isAxiosError === true) {
      ({ statusCode, message, errorSources } = handleAxiosError(
        err as AxiosError,
      ));
    }

    // 13  Generic JS Error
    else if (err instanceof Error) {
      message = err.message;
      errorSources = [{ path: '', message: err.message }];
    }

    const body: TErrorResponse = {
      success: false,
      statusCode,
      message,
      errorSources,
      stack: isDev && err instanceof Error ? err.stack : null,
    };

    httpAdapter.reply(response, body, statusCode);
  }
}
