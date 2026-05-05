import { requireEnv } from './env';

describe('env utils', () => {
  const originalEnv = process.env.TEST_REQUIRED_ENV;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.TEST_REQUIRED_ENV;
    } else {
      process.env.TEST_REQUIRED_ENV = originalEnv;
    }
  });

  it('returns configured environment variables', () => {
    process.env.TEST_REQUIRED_ENV = 'configured';

    expect(requireEnv('TEST_REQUIRED_ENV')).toBe('configured');
  });

  it('throws when required environment variables are missing', () => {
    delete process.env.TEST_REQUIRED_ENV;

    expect(() => requireEnv('TEST_REQUIRED_ENV')).toThrow(
      'Missing required environment variable: TEST_REQUIRED_ENV',
    );
  });
});
