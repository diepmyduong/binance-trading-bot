import { ServiceSchema } from "moleculer";
import { RedisClient } from "redis";
import { configs } from "../../configs";

export default {
  name: "counter",
  settings: {
    client: new RedisClient({
      host: configs.redis.host,
      port: configs.redis.port,
      password: configs.redis.password,
      prefix: configs.redis.prefix,
    }),
  },
  actions: {
    incr: {
      params: { key: { type: "string" } },
      async handler(ctx) {
        const { key } = ctx.params;
        return new Promise((resv, rej) => {
          this.settings.client.incr(key, (err: Error, res: number) => {
            resv(res);
          });
        });
      },
    },
    test: {
      params: { key: { type: "string" }, c: { type: "number" } },
      async handler(ctx) {
        const { key, c } = ctx.params;
        for (var i = 0; i < c; i++) {
          const index = i;
          this.broker
            .call("counter.incr", { key })
            .then((res) => console.log(`${index}: ${res}`))
            .catch((err) => console.log("err", err.message));
        }
      },
    },
  },
} as ServiceSchema;
