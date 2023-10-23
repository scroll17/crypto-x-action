import { AxiosError, AxiosRequestConfig } from 'axios';

const REMOVE_CONFIG_PROPERTIES: Array<keyof AxiosRequestConfig> = [
  'httpAgent',
  'httpsAgent',

  'transformRequest',
  'transformResponse',
  'paramsSerializer',
  'adapter',
  'auth',
  'onUploadProgress',
  'onDownloadProgress',
  'validateStatus',
  'beforeRedirect',
  'socketPath',
  'transport',
  'proxy',
  'cancelToken',
  'transitional',
  'signal',
  'env',
  'formSerializer',
  'lookup',
];

export function getLeanError(
  error: Error | AxiosError | Record<string, unknown>,
) {
  const isAxiosError = error instanceof AxiosError;

  if (isAxiosError || 'config' in error) {
    const config = error['config'] as AxiosRequestConfig;
    if (config) {
      // Note: we are clearing huge error info that contains bytes and makes problems to read and understand error

      REMOVE_CONFIG_PROPERTIES.forEach((key) => {
        if (key in config) delete config[key];
      });
    }
  }

  if (error?.['response'] && typeof error['response'] === 'object') {
    const response = error['response'];

    if ('config' in response) delete response.config;
    if ('request' in response) delete response.request;
  }

  if (error?.['request'] && typeof error['request'] === 'object') {
    delete error['request'];
  }

  return error;
}
