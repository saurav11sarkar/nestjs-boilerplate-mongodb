import { AppService } from './app.service';
import config from './app/config';

describe('AppService', () => {
  it('returns API health metadata', () => {
    const service = new AppService();

    expect(service.getHello()).toEqual({
      name: `${config.appName} API`,
      status: 'ok',
      databaseEnabled: true,
      swaggerUrl: '/api/docs',
      version: '1.0.0',
    });
  });
});
