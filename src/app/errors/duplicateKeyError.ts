import { MongoError } from 'mongodb';
import { TErrorSource } from '../middlewares/globalErrors.filter';

export function handleDuplicateKeyError(
  err: MongoError & { keyValue?: Record<string, unknown> },
): {
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
} {
  const field = err.keyValue ? Object.keys(err.keyValue)[0] : '';
  const value = err.keyValue ? String(Object.values(err.keyValue)[0]) : '';
  return {
    statusCode: 409,
    message: 'Duplicate Entry',
    errorSources: [
      {
        path: field,
        message: `'${value}' already exists for field '${field}'`,
      },
    ],
  };
}
