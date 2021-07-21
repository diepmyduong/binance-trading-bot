import dotenv from "dotenv";
import { ServiceSchema } from "moleculer";
import moment from "moment-timezone";
import shortHash from "short-hash";

import { ShortLinkModel } from "./shortLink.model";

dotenv.config();

export default {
  name: "shortLink",
  settings: {
    ttl: 30, // 30 phút
  },
  actions: {
    encode: {
      params: {
        url: { type: "string" },
        ttl: { type: "number", optional: true },
      },
      async handler(ctx) {
        const { url, ttl } = ctx.params;
        const code = shortHash(url);
        const expiredAt = moment()
          .add(ttl || this.settings.ttl, "minutes")
          .toDate();
        const result = await ShortLinkModel.findOneAndUpdate(
          { code },
          { $set: { url, expiredAt } },
          { upsert: true, new: true }
        );
        return result.code;
      },
    },
    decode: {
      cache: true,
      params: {
        code: { type: "string" },
      },
      async handler(ctx) {
        const { code } = ctx.params;
        const shortLink = await ShortLinkModel.findOne({ code });
        if (!shortLink) throw Error("Mã không còn tồn tại.");
        if (moment().isAfter(shortLink.expiredAt)) {
          await shortLink.remove();
          throw Error("Mã hết hiệu lực");
        }
        return shortLink.url;
      },
    },
  },
  methods: {},
} as ServiceSchema;
