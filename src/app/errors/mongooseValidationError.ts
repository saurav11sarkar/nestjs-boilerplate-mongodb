import { Error as MongooseError } from 'mongoose';
import { TErrorSource } from '../middlewares/globalErrors.filter';

export function handleMongooseValidationError(
  err: MongooseError.ValidationError,
): {
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
} {
  return {
    statusCode: 400,
    message: 'Validation Error',
    errorSources: Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    })),
  };
}
