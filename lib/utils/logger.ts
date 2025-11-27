/**
 * Centralized Logging Utility
 * Provides structured logging across the application
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
  };
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatLog(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error
        ? {
            message: error.message,
            stack: this.isDevelopment ? error.stack : undefined,
          }
        : undefined,
    };
  }

  private output(entry: LogEntry): void {
    const logString = JSON.stringify(entry, null, this.isDevelopment ? 2 : 0);

    switch (entry.level) {
      case "error":
        console.error(logString);
        break;
      case "warn":
        console.warn(logString);
        break;
      case "info":
        console.info(logString);
        break;
      case "debug":
        if (this.isDevelopment) {
          console.debug(logString);
        }
        break;
    }

    // In production, you might want to send this to a logging service
    // e.g., Sentry, LogRocket, Datadog, etc.
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.output(this.formatLog("debug", message, context));
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.output(this.formatLog("info", message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.output(this.formatLog("warn", message, context));
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.output(this.formatLog("error", message, context, error));
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const log = {
  debug: (message: string, context?: Record<string, unknown>) => logger.debug(message, context),
  info: (message: string, context?: Record<string, unknown>) => logger.info(message, context),
  warn: (message: string, context?: Record<string, unknown>) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: Record<string, unknown>) =>
    logger.error(message, error, context),
};



