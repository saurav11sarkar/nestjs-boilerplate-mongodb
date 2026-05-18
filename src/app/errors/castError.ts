import { Error as MongooseError } from 'mongoose';
import { TErrorSource } from '../middlewares/globalErrors.filter';

export function handleCastError(err: MongooseError.CastError): {
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
} {
  return {
    statusCode: 400,
    message: 'Invalid ID',
    errorSources: [{ path: err.path, message: err.message }],
  };
}
