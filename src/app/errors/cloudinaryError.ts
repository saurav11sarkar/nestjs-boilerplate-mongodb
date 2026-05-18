import { TErrorSource } from '../middlewares/globalErrors.filter';

export interface CloudinaryError {
  http_code?: number;
  message: string;
  name?: string;
}

export function isCloudinaryError(err: unknown): err is CloudinaryError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'http_code' in err &&
    typeof (err as any).message === 'string'
  );
}

const CLOUDINARY_HTTP_MESSAGES: Record<number, string> = {
  400: 'Invalid file or upload parameters',
  401: 'Cloudinary authentication failed — check API credentials',
  403: 'Upload not allowed — check your upload preset or account limits',
  404: 'Cloudinary resource not found',
  420: 'Cloudinary rate limit exceeded — try again later',
  500: 'Cloudinary server error — try again later',
};

export function handleCloudinaryError(err: CloudinaryError): {
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
} {
  const statusCode =
    err.http_code && err.http_code >= 400 && err.http_code < 600
      ? err.http_code
      : 502;
  const message =
    CLOUDINARY_HTTP_MESSAGES[statusCode] ??
    err.message ??
    'Cloudinary upload failed';

  return {
    statusCode,
    message: 'File Upload Error',
    errorSources: [{ path: 'file', message }],
  };
}
