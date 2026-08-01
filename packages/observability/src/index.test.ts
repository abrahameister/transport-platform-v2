import { describe, it, expect, vi } from 'vitest';
import { Logger } from './index';

describe('Observability Logger', () => {
  it('sanitizes sensitive fields in log context', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = new Logger();

    logger.info('Test log', { password: 'my-secret-password', user: 'admin' });

    expect(consoleSpy).toHaveBeenCalled();
    const logArg = JSON.parse(consoleSpy.mock.calls[0]?.[0] as string);
    expect(logArg.context.password).toBe('[REDACTED]');
    expect(logArg.context.user).toBe('admin');

    consoleSpy.mockRestore();
  });
});
