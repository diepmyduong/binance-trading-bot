import winston from "winston";
import MongoTransport from "winston-mongodb";
import { configs } from "../configs";

let transports: any = [
  new winston.transports.File({
    filename: `log/error.log`,
    level: "error",
    options: { flags: "a", mode: 0o755 },
  }),
  new winston.transports.File({
    filename: `log/combined.log`,
    options: { flags: "a", mode: 0o755 },
  }),
];
if (process.env.NODE_ENV !== "development") {
  transports.push(new winston.transports.Console());
} else {
  // transports.push(new MongoTransport.MongoDB({ db: configs.winston.db }));
  transports.push(
    new MongoTransport.MongoDB({
      db: configs.winston.db,
      collection: "errorlog",
      level: "error",
      tryReconnect: true,
    })
  );
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.cli(), winston.format.splat()),
    })
  );
}

if (process.env.NODE_ENV === "testing") {
  transports = [];
}

const Logger = winston.createLogger({
  level: configs.winston.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
});

export { Logger };
