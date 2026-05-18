import { AxiosError } from 'axios';
import { TErrorSource } from '../middlewares/globalErrors.filter';

export function handleAxiosError(err: AxiosError): {
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
} {
  // No response — network / timeout issue
  if (!err.response) {
    const isTimeout = err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT';
    const isNetwork = err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED';
    return {
      statusCode: 503,
      message: 'External Service Error',
      errorSources: [
        {
          path: err.config?.url ?? 'external_api',
          message: isTimeout
            ? 'External service request timed out'
            : isNetwork
              ? 'Cannot reach external service — check network or URL'
              : `Network error: ${err.message}`,
        },
      ],
    };
  }

  const statusCode =
    err.response.status >= 400 && err.response.status < 600
      ? err.response.status
      : 502;

  const responseData = err.response.data as any;
  const remoteMessage =
    responseData?.message ??
    responseData?.error ??
    err.message ??
    'External API error';

  return {
    statusCode,
    message: 'External Service Error',
    errorSources: [
      {
        path: err.config?.url ?? 'external_api',
        message: remoteMessage,
      },
    ],
  };
}
