import { ServiceSchema } from "moleculer";
import redis from "../../helpers/redis";
import { CounterModel } from "./counter.model";

export default {
  name: "counter",
  settings: {
    client: redis,
    initedCodes: [],
  },
  actions: {
    async trigger(name: string, initValue: number = 10000, step = 1) {
      if (!this.settings.initedCodes.includes(name)) {
        await CounterModel.updateOne(
          { name },
          { $setOnInsert: { value: initValue } },
          { upsert: true }
        );
        this.initedCodes.push(name);
      }
      return await CounterModel.findOneAndUpdate(
        { name },
        { $inc: { value: step } },
        { new: true }
      ).then((res) => res.value);
    },
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
