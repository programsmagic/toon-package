/**
 * Structured logging utility for production use
 * Supports different log levels and can be extended with external loggers
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, error?: Error | unknown, ...args: unknown[]): void;
}

class DefaultLogger implements Logger {
  private level: LogLevel;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    if (this.level <= LogLevel.ERROR) {
      const errorDetails = error instanceof Error 
        ? { message: error.message, stack: error.stack, name: error.name }
        : error;
      console.error(`[ERROR] ${message}`, errorDetails, ...args);
    }
  }
}

// Create default logger instance
let logger: Logger = new DefaultLogger(
  process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.INFO
);

/**
 * Get the current logger instance
 */
export function getLogger(): Logger {
  return logger;
}

/**
 * Set a custom logger instance
 */
export function setLogger(customLogger: Logger): void {
  logger = customLogger;
}

/**
 * Set log level for default logger
 */
export function setLogLevel(level: LogLevel): void {
  if (logger instanceof DefaultLogger) {
    logger.setLevel(level);
  }
}

// Export default logger methods
export const log = {
  debug: (message: string, ...args: unknown[]) => logger.debug(message, ...args),
  info: (message: string, ...args: unknown[]) => logger.info(message, ...args),
  warn: (message: string, ...args: unknown[]) => logger.warn(message, ...args),
  error: (message: string, error?: Error | unknown, ...args: unknown[]) => 
    logger.error(message, error, ...args),
};

