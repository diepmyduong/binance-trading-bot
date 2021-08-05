import { ServiceSchema } from "moleculer";
import { MainConnection } from "../../loaders/database";
import { playLuckyWheelQueue } from "../../queues/playLuckyWheel.queue";

export default {
  name: "luckyWheel",
  actions: {
    play: {
      params: { wheelId: { type: "string" }, customerId: { type: "string" } },
      async handler(ctx) {
        const { wheelId, customerId } = ctx.params;
        const job = await playLuckyWheelQueue
          .queue(wheelId)
          .createJob({ wheelId, customerId })
          .timeout(30000)
          .save();
        console.log("created Job", job.id);

        const timeout = setTimeout(() => {
          job.remove();
          job.emit("failed", new Error("Vui lòng thử lại."));
        }, 30000);
        return new Promise((resolve, reject) => {
          job.on("succeeded", (result) => {
            console.log(`Job ${job.id} succeeded with result: ${result}`);
            resolve(result);
            clearTimeout(timeout);
          });
          job.on("retrying", (err) => {
            console.log(`Job ${job.id} failed with error ${err.message} but is being retried!`);
          });
          job.on("failed", (err) => {
            console.log(`Job ${job.id} failed with error ${err.message}`);
            reject(err);
            clearTimeout(timeout);
          });
          job.on("progress", (progress) => {
            console.log(`Job ${job.id} reported progress: ${progress}%`);
          });
        });
      },
    },
    test: {
      params: {
        wheelId: { type: "string" },
        customerId: { type: "string" },
        c: { type: "number" },
      },
      handler(ctx) {
        const { wheelId, customerId, c } = ctx.params;
        for (var i = 0; i < c; i++) {
          const index = i;
          this.broker.call("luckyWheel.play", { wheelId, customerId }).catch((err) => {
            console.log("Task ", index, "error: ", err.message);
          });
        }
      },
    },
  },
} as ServiceSchema;
