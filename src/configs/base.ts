import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { compact, get } from "lodash";
const pjson = require("../../package.json");

if (fs.existsSync(path.join(__dirname, "../../.env"))) {
  console.log(".env exists");
  dotenv.config({ path: path.join(__dirname, "../../.env") });
} else if (fs.existsSync(path.join(__dirname, "../../.env.example"))) {
  console.log(".env not exists");
  dotenv.config({ path: path.join(__dirname, "../../.env.example") }); // you can delete this after you create your own .env file!
} else {
  console.log(".env.example not exists");
}

// if (!process.env.FIREBASE) throw new Error("Chưa config firebase");
if (!process.env.FIREBASE_VIEW) throw new Error("Chưa config firebase views");
if (!process.env.MONGODB_URI) throw new Error("Missing Config MONGODB_URI");

export default {
  name: pjson.name,
  version: pjson.version,
  description: pjson.description,
  port: process.env.PORT || 3000,
  basicAuth: {
    users: { mcom: "mcom@123" },
  },
  winston: {
    db: process.env.MONGO_LOG || "",
    level: process.env.LOG_LEVEL || `silly`,
  },
  query: {
    limit: 10,
  },
  secretKey: process.env.SECRET || "HkQlTCrDfYWezqEp494TjDUqBhSzQSnn",
  timezone: "Asia/Ho_Chi_Minh",
  domain: "http://localhost:" + process.env.PORT || 3000,
  firebase: JSON.parse(
    process.env.FIREBASE || `{"credential":{},"databaseURL":"https://mshop-1506c.firebaseio.com"}`
  ),
  firebaseView: process.env.FIREBASE_VIEW,
  redis: {
    enable: false,
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASS,
    prefix: process.env.REDIS_PREFIX || pjson.name,
  },
  chatbot: {
    host: process.env.CHATBOT_HOST || "https://bot-server.mcom.app",
  },
  viettelPost: {
    host: "https://partner.viettelpost.vn/v2",
    token: process.env.VIETTEL_TOKEN,
    secret: process.env.VIETTEL_SECRET || "delivery@Secret123",
    printToken: process.env.VIETTEL_PRINT_TOKEN,
  },
  vietnamPost: {
    host: "https://donhang.vnpost.vn/api/api",
    token: process.env.VIETNAM_POST_TOKEN,
    publicKey:
      "3G3hLSrPwF4FBBA/0yEZkNwX2++SSCIaGKeb8TBb6loc3NRSvo0oDR0dO7c6bk/CgizQ7ZT0d/rlZunV4UbP2gzVl3p6VN2ykoDhnmdGClk1+js6EqWIWztZrcF2mAq0s3OHIH4tLnLIGWbMws1nQNRUoJDwfGVSZcLzFnWRWb21kYjpSbu44Y2IiQX6y3n2YR9VPyxI9VMYkrTvdzN/cTFyRhrPaH15pXzkQ8zQl561mSYGcucJl56GX9hRaho5zuNSNWq+oVXdIBE6UOVVX4TXJJJw+iKlLYO/2OryJ3fNLKWajBaYGzxZ6QLjpfr/HYtAPGLARLtDtean7JjE5Q==",
  },
  nextDev: (process.env.NEXT_DEV || "FALSE").toUpperCase() == "TRUE",
  ahamove: {
    apiKey: process.env.AHAMOVE_API_KEY || "4cd543d3e4e4fbe97db216828c18644f77558275",
  },
  scheduler: {
    includes: compact(get(process.env, "SCHEDULER_INCLUDES", "").split(",")),
    excludes: compact(get(process.env, "SCHEDULER_EXCLUDES", "").split(",")),
  },
};
