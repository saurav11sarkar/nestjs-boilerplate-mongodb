import { Injectable } from '@nestjs/common';
import config from './app/config';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: `${config.appName} API`,
      status: 'ok',
      databaseEnabled: config.isMongoEnabled,
      swaggerUrl: `/api/docs`,
      version: '1.0.0',
    };
  }
}
