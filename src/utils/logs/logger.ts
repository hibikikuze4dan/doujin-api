import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import {
  COMBINED_LOG_AUDIT_FILEPATH,
  COMBINED_LOG_FILEPATH,
  ERROR_LOG_AUDIT_FILEPATH,
  ERROR_LOG_FILEPATH,
} from "../../constants";

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return stack
    ? `[${timestamp}] ${level}: ${message}\n${stack}` // includes stack trace for errors
    : `[${timestamp}] ${level}: ${message}`;
});

const rotationSettings = {
  datePattern: "YYYY-MM-DD",
  maxSize: "10m", // rotate after 10MB
  maxFiles: 5, // keep 5 archived files
  zippedArchive: true, // compress old logs to save space
};

export const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // capture stack traces on Error objects
    logFormat,
  ),
  transports: [
    // Console output (colored for readability)
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        logFormat,
      ),
    }),

    // General log file — all levels (info, warn, error, etc.)
    new DailyRotateFile({
      ...rotationSettings,
      filename: COMBINED_LOG_FILEPATH,
      auditFile: COMBINED_LOG_AUDIT_FILEPATH,
    }),

    // Error-only log file
    new DailyRotateFile({
      ...rotationSettings,
      filename: ERROR_LOG_FILEPATH,
      auditFile: ERROR_LOG_AUDIT_FILEPATH,
      level: "error",
    }),
  ],
});

const Logger = logger;

export default Logger;
