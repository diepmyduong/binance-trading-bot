import winston from "winston";
import moment from "moment-timezone";

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({ level: "error", filename: "logs/error.log" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf((info) => {
      let message = `[${moment(info.timestamp).format("YYYY-MM-DD HH:mm:ss")}][${info.level}] ${
        info.message
      }`;
      if (info.stack) {
        message += `\n${info.stack.split("\n")[1]}\n`;
      }
      return message;
    })
  ),
  // format:
  // level: configs.winston.level,
  // levels: { ...winston.config.npm.levels, vnpost: 10 },
  // format: winston.format.combine(
  //   winston.format.timestamp({
  //     format: "YYYY-MM-DD HH:mm:ss",
  //   }),
  //   winston.format.errors({ stack: true }),
  //   winston.format.splat(),
  //   winston.format.json()
  // ),
});

export default logger;

// let transports: any = [
//   new winston.transports.File({
//     filename: `logs/error.log`,
//     level: "error",
//     options: { flags: "a", mode: 0o755 },
//   }),
//   new winston.transports.File({
//     filename: `logs/combined.log`,
//     options: { flags: "a", mode: 0o755 },
//   }),
//   new winston.transports.File({ filename: "logs/vnpost-error.log", level: "vnpost" }),
// ];
// if (process.env.NODE_ENV !== "development") {
//   transports.push(new winston.transports.Console());
// } else {
//   // transports.push(new MongoTransport.MongoDB({ db: configs.winston.db }));
//   transports.push(
//     new MongoTransport.MongoDB({
//       db: configs.winston.db,
//       collection: "errorlog",
//       level: "error",
//       tryReconnect: true,
//     })
//   );
//   transports.push(
//     new winston.transports.Console({
//       format: winston.format.combine(winston.format.cli(), winston.format.splat()),
//     })
//   );
// }

// if (process.env.NODE_ENV === "testing") {
//   transports = [];
// }

// const Logger = winston.createLogger({
//   level: configs.winston.level,
//   levels: { ...winston.config.npm.levels, vnpost: 10 },
//   format: winston.format.combine(
//     winston.format.timestamp({
//       format: "YYYY-MM-DD HH:mm:ss",
//     }),
//     winston.format.errors({ stack: true }),
//     winston.format.splat(),
//     winston.format.json()
//   ),
//   transports,
// });

// const simpleTimestampFormat = winston.format.combine(
//   timestampFormat,
//   winston.format.printf(({ level, message, timestamp, stack }) => {
//     if (stack) {
//       // print log trace
//       return `${timestamp} ${level}: ${message} - ${stack}`;
//     }
//     return `[${timestamp}] ${level}: ${message}`;
//   })
// );
// const errorFormat = winston.format.combine(
//   winston.format.errors({ stack: true }),
//   timestampFormat,
//   winston.format.prettyPrint()
// );
// export { Logger, simpleTimestampFormat, timestampFormat, errorFormat };
