import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

const loggerOptions: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
};

if (isDevelopment) {
  loggerOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  };
}

export const logger = pino(loggerOptions);

export function withServerActionLogging<T extends unknown[], R>(
  actionName: string,
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    logger.info({ action: actionName, args }, 'Server action started');
    
    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      logger.info({ action: actionName, duration }, 'Server action completed');
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error({ action: actionName, duration, error }, 'Server action failed');
      throw error;
    }
  };
}
