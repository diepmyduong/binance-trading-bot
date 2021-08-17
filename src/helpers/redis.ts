import Redis from "redis";
import config from "config";

const redis = Redis.createClient({
  host: config.get<string>("redis.host"),
  port: config.get<number>("redis.port"),
  password: config.get<string>("redis.password"),
  prefix: config.get<string>("redis.prefix"),
});

export default redis;
