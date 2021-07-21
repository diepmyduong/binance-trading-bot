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
        "100": "Request đã được nhận và xử lý thành công.",
        "104": "Brandname không tồn tại hoặc đã bị hủy",
        "118": "Loại tin nhắn không hợp lệ",
        "119": "Brandname quảng cáo phải gửi ít nhất 20 số điện thoại",
        "131": "Tin nhắn brandname quảng cáo độ dài tối đa 422 kí tự",
        "132": "Không có quyền gửi tin nhắn đầu số cố định 8755",
        "99": "Lỗi không xác định",
        "177":
          "Brandname không có hướng ( Viettel - The Network Viettel have not registry.<br>VinaPhone - The Network VinaPhone have not registry.<br>Mobifone - The Network Mobifone have not registry.<br>Gtel - The Network Gtel have not registry.<br>Vietnammobile - The Network Vietnammoile have not registry.)",
        "159": "RequestId quá 120 ký tự",
        "145": "Sai template mạng xã hội",
        "146": "Sai template Brandname CSKH",
      };
      return data[code] || "Lỗi không xác định";
    },
  },
} as ServiceSchema;
