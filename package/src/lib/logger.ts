import pino from "pino";

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isDevelopment ? "debug" : "info"),
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});

/**
 * Server action logging wrapper
 */
export function withServerActionLogging<T extends unknown[], R>(
  actionName: string,
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    logger.info({ action: actionName, args: args.length }, `Starting ${actionName}`);
    
    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      logger.info({ action: actionName, duration }, `Completed ${actionName}`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(
        { action: actionName, duration, error: error instanceof Error ? error.message : String(error) },
        `Failed ${actionName}`
      );
      throw error;
    }
  };
}
