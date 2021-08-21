import { EventEmitter } from "events";
import { Dictionary } from "lodash";
import Queue, { Job, QueueSettings } from "bee-queue";
import redis from "../helpers/redis";

export abstract class BaseQueue extends EventEmitter {
  private _queues: Dictionary<Queue> = {};

  constructor(
    public name: string,
    public concurrency: number = 1,
    public options: QueueSettings = {}
  ) {
    super();
  }

  queue(id: string) {
    if (!this._queues[id]) {
      this._queues[id] = new Queue(this.name, {
        prefix: id,
        removeOnSuccess: true,
        removeOnFailure: true,
        redis: redis,
        ...this.options,
      });
      this._queues[id].process(this.concurrency, this.process.bind(this));
    }
    return this._queues[id];
  }

  protected abstract process(job: Job<any>): Promise<any>;
}
