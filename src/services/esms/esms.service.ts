import axios from "axios";
import dotenv from "dotenv";
import { get } from "lodash";
import { ServiceSchema } from "moleculer";

dotenv.config();

export default {
  name: "ESMS",
  settings: {
    host: "http://rest.esms.vn",
    apiKey: process.env.ESMS_APIKEY,
    secret: process.env.ESMS_SECRET,
    resType: "JSON",
    brandName: process.env.ESMS_BRANDNAME,
    smsType: 2,
  },
  actions: {
    send: {
      params: {
        phone: { type: "string" },
        content: { type: "string" },
        brandName: { type: "string", optional: true },
        smsType: { type: "number", optional: true },
        callbackUrl: { type: "string", optional: true },
        sandbox: { type: "boolean", optional: true, default: false },
      },
      async handler(ctx) {
        const { host, apiKey, secret, resType } = this.settings;
        const { phone, content, brandName, smsType, callbackUrl, sandbox } = ctx.params;
        const payload = {
          Phone: phone,
          Content: content,
          Brandname: brandName || this.settings.brandName,
          SmsType: smsType || this.settings.smsType,
          CallBackUrl: callbackUrl,
          ApiKey: apiKey,
          SecretKey: secret,
          sandbox: sandbox ? 1 : 0,
        };
        const result = await axios
          .get(`${host}/MainService.svc/${resType}/SendMultipleMessage_V4_get`, { params: payload })
          .catch((err) => {
            console.log("err", err.message);
            throw err;
          });

        const codeResult = get(result, "data.CodeResult");
        return {
          success: codeResult == "100",
          message: this.getCodeText(codeResult),
          data: result.data,
        };
      },
    },
    brandNames: {
      cache: true,
      async handler(ctx) {
        const { host, apiKey, secret, resType } = this.settings;
        return await axios
          .get(`${host}/MainService.svc/${resType}/GetListBrandname/${apiKey}/${secret}`)
          .then((res) => res.data);
      },
    },
  },
  methods: {
    getCodeText(code: string) {
      const data: { [x: string]: string } = {
        "100": "Request ???? ???????c nh???n v?? x??? l?? th??nh c??ng.",
        "104": "Brandname kh??ng t???n t???i ho???c ???? b??? h???y",
        "118": "Lo???i tin nh???n kh??ng h???p l???",
        "119": "Brandname qu???ng c??o ph???i g???i ??t nh???t 20 s??? ??i???n tho???i",
        "131": "Tin nh???n brandname qu???ng c??o ????? d??i t???i ??a 422 k?? t???",
        "132": "Kh??ng c?? quy???n g???i tin nh???n ?????u s??? c??? ?????nh 8755",
        "99": "L???i kh??ng x??c ?????nh",
        "177":
          "Brandname kh??ng c?? h?????ng ( Viettel - The Network Viettel have not registry.<br>VinaPhone - The Network VinaPhone have not registry.<br>Mobifone - The Network Mobifone have not registry.<br>Gtel - The Network Gtel have not registry.<br>Vietnammobile - The Network Vietnammoile have not registry.)",
        "159": "RequestId qu?? 120 k?? t???",
        "145": "Sai template m???ng x?? h???i",
        "146": "Sai template Brandname CSKH",
      };
      return data[code] || "L???i kh??ng x??c ?????nh";
    },
  },
} as ServiceSchema;
