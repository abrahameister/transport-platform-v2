export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  application?: string;
  environment?: string;
  requestId?: string;
  traceId?: string;
  [key: string]: unknown;
}

const SENSITIVE_KEYS = ['password', 'token', 'secret', 'key', 'auth', 'cookie'];

function sanitize(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);

  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const isSensitive = SENSITIVE_KEYS.some((sk) => key.toLowerCase().includes(sk));
    clean[key] = isSensitive ? '[REDACTED]' : sanitize(value);
  }
  return clean;
}

export class Logger {
  constructor(private defaultContext: LogContext = {}) {}

  private log(level: LogLevel, message: string, context?: LogContext) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: sanitize({ ...this.defaultContext, ...context }),
    };
    const output = JSON.stringify(entry);

    if (level === 'error') {
      console.error(output);
    } else if (level === 'warn') {
      console.warn(output);
    } else {
      console.log(output);
    }
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }
}

export const logger = new Logger({
  application: 'transport-platform',
  environment: process.env.NODE_ENV || 'development',
});
