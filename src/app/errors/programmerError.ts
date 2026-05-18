import { TErrorSource } from '../middlewares/globalErrors.filter';

export function handleProgrammerError(err: TypeError | RangeError): {
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
} {
  return {
    statusCode: 500,
    message: 'Internal Server Error',
    errorSources: [
      {
        path: '',
        message:
          process.env.NODE_ENV === 'development'
            ? err.message
            : 'An unexpected error occurred',
      },
    ],
  };
}
