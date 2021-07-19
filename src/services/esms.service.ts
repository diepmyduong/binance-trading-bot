import { ServiceBroker } from "moleculer";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const broker = new ServiceBroker();

broker.createService({
  name: "ESMS",
  settings: {
    host: "http://rest.esms.vn",
    apiKey: process.env.ESMS_APIKEY,
    secret: process.env.ESMS_SECRET,
    resType: "JSON",
  },
  actions: {
    send: {
      params: {
        phone: { type: "string", require: true },
        content: { type: "string", require: true },
        brandName: { type: "string", require: true },
        smsType: { type: "number" },
        callbackUrl: { type: "string" },
      },
      async handler(ctx) {
        const { host, apiKey, secret, resType } = this.settings;
        const { phone, content, brandName, smsType, callbackUrl } = ctx.params;
        const result = await axios.get(
          `${host}/MainService.svc/${resType}/SendMultipleMessage_V4_get`,
          {
            params: {
              Phone: phone,
              Content: content,
              Brandname: brandName,
              SmsType: smsType,
              CallBackUrl: callbackUrl,
              ApiKey: apiKey,
              SecretKey: secret,
            },
          }
        );
      },
    },
  },
});
