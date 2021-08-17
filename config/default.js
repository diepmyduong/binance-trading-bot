const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "tz": "Asia/Ho_Chi_Minh",
  "secret": "my-secret",
  "port": 5555,
  "firebase": {
    "credential": {},
    "webConfig": {}
  },
  "redis": {
    "host": "redis",
    "port": 6379,
    "pass": null,
    "prefix": null
  },
  "next": {
    "enable": true,
    "devMode": false
  },
  "job": {
    "defines": "ALL",
    "skips": "NONE"
  },
  "mongo": {
    "main": "mongodb://db:27017/dev"
  },
  "format": {
    "date": "YYYY-MM-DD",
    "datetime": "YYYY-MM-DD HH:mm:ss",
  }
}
