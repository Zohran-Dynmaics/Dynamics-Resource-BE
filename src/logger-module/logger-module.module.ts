import { Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              return `[${timestamp}] ${level}: ${message} ${JSON.stringify(meta)}`;
            })
          )
        }),

        new winston.transports.File({
          filename: "logs/app.log",
          level: "info",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        }),
        new winston.transports.File({
          filename: "logs/errors.log",
          level: "error",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        })
      ]
    })
  ],
  exports: [WinstonModule] // Export to make it available to other modules
})
export class LoggerModule {}
