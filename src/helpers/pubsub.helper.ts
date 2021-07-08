import { PubSub } from "apollo-server-express";

export class PubSubHelper {
  static pubsub = new PubSub();

  static publish(tag: string, payload: any) {
    this.pubsub.publish(tag, payload);
  }
}
