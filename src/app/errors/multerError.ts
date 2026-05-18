import { MulterError } from 'multer';
import { TErrorSource } from '../middlewares/globalErrors.filter';

const MULTER_ERROR_MESSAGES: Record<string, string> = {
  LIMIT_PART_COUNT: 'Too many parts in the request',
  LIMIT_FILE_SIZE: 'File is too large. Please upload a smaller file',
  LIMIT_FILE_COUNT: 'Too many files uploaded at once',
  LIMIT_FIELD_KEY: 'Field name is too long',
  LIMIT_FIELD_VALUE: 'Field value is too long',
  LIMIT_FIELD_COUNT: 'Too many fields in the request',
  LIMIT_UNEXPECTED_FILE: 'Unexpected file field received',
  MISSING_FIELD_NAME: 'File field name is missing',
};

export function handleMulterError(err: MulterError): {
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
} {
  const message =
    MULTER_ERROR_MESSAGES[err.code] ?? `File upload error: ${err.message}`;
  return {
    statusCode: 400,
    message: 'File Upload Error',
    errorSources: [{ path: err.field ?? 'file', message }],
  };
}
