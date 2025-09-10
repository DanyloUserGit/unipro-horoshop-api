import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

const logDir = path.join(__dirname, '../../logs');

const transport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, 'import-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf((info) => JSON.stringify(info)), // записуємо у форматі JSON
  ),
  transports: [transport, new winston.transports.Console()],
});
