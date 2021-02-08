import mongoose from "mongoose";
import { configs } from "../configs";

const connect = mongoose.createConnection(configs.maindb, {
  useNewUrlParser: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

export const MainConnection = connect;
