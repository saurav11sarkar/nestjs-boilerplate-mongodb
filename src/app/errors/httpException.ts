import { HttpException } from '@nestjs/common';
import { TErrorSource } from '../middlewares/globalErrors.filter';

export function handleHttpException(err: HttpException): {
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
} {
  const statusCode = err.getStatus();
  const response = err.getResponse() as
    | string
    | { message: string | string[]; error?: string };

  if (
    typeof response === 'object' &&
    Array.isArray((response as any).message)
  ) {
    const messages: string[] = (response as any).message;
    return {
      statusCode,
      message: 'Validation Error',
      errorSources: messages.map((msg) => ({ path: '', message: msg })),
    };
  }

  const message =
    typeof response === 'string'
      ? response
      : ((response as any).message ?? err.message);

  return { statusCode, message, errorSources: [{ path: '', message }] };
}
