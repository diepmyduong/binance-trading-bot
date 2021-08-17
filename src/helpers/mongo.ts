import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

const connect = mongoose.createConnection(config.get("mongo.main"), {
  useNewUrlParser: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

connect.on("connect", () => {
  logger.info("Database connected");
});

connect.on("error", (err) => {
  logger.error("Mongo Database Connection Error " + err.message);
});

export const MainConnection = connect;
