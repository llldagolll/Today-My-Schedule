import { createLogger, transports, format } from "winston";
import dotenv from "dotenv";
import { DateTime } from "luxon";

dotenv.config();

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: () => {
        return DateTime.now().setZone("Asia/Tokyo").toString();
      },
    }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  defaultMeta: {
    service: "Today-My-Schedule",
  },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new transports.Console(),
    new transports.File({
      level: "error",
      dirname: "logs",
      filename: `error.log`,
      maxsize: 10 * 1024 * 1024,
    }),
    new transports.File({
      dirname: "logs",
      filename: "combined.log",
      maxsize: 10 * 1024 * 1024,
    }),
  ],
});

export default logger;
