import { TErrorSource } from '../middlewares/globalErrors.filter';

export function handleSyntaxError(): {
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
} {
  return {
    statusCode: 400,
    message: 'Invalid JSON',
    errorSources: [
      {
        path: 'body',
        message:
          'Request body contains malformed JSON. Please check your request',
      },
    ],
  };
}
