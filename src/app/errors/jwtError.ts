import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import { TErrorSource } from '../middlewares/globalErrors.filter';

export function handleJwtError(err: JsonWebTokenError): {
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
} {
  let message = 'Invalid token';

  if (err instanceof TokenExpiredError) {
    message = 'Token has expired. Please login again';
  } else if (err instanceof NotBeforeError) {
    message = `Token not active until: ${err.date.toISOString()}`;
  } else if (err.message === 'invalid signature') {
    message = 'Token signature is invalid';
  } else if (err.message === 'jwt malformed') {
    message = 'Token is malformed';
  } else if (err.message === 'jwt must be provided') {
    message = 'Token must be provided';
  } else if (err.message?.startsWith('invalid algorithm')) {
    message = 'Token algorithm is not supported';
  }

  return {
    statusCode: 401,
    message: 'Authentication Error',
    errorSources: [{ path: 'token', message }],
  };
}
