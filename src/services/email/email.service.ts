import dotenv from "dotenv";
import { ServiceSchema } from "moleculer";
import nodemailer from "nodemailer";

dotenv.config();

export default {
  name: "email",
  settings: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || "465",
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
  actions: {
    send: {
      params: {
        from: { type: "string" },
        to: { type: "string" },
        subject: { type: "string" },
        html: { type: "string" },
        text: { type: "string", optional: true },
        host: { type: "string", optional: true },
        port: { type: "string", optional: true },
        username: { type: "string", optional: true },
        password: { type: "string", optional: true },
      },
      async handler(ctx) {
        const { from, to, subject, html, text, host, port, username, password } = ctx.params;
        const emailTransport = await nodemailer.createTransport({
          host: host || this.settings.host,
          port: port || this.settings.port,
          secure: parseInt(port || this.settings.port) === 465 ? true : false, // true for 465, false for other ports
          auth: {
            user: username || this.settings.username, // generated ethereal user
            pass: password || this.settings.password, // generated ethereal password
          },
        });
        return await emailTransport.sendMail({ from, to, subject, html, text });
      },
    },
  },
  methods: {},
  events: {
    "email.send": {
      async handler(ctx: any) {
        const { from, to, subject, html, text, host, port, username, password } = ctx.params;
        const emailTransport = await nodemailer.createTransport({
          host: host || this.settings.host,
          port: port || this.settings.port,
          secure: parseInt(port || this.settings.port) === 465 ? true : false, // true for 465, false for other ports
          auth: {
            user: username || this.settings.username, // generated ethereal user
            pass: password || this.settings.password, // generated ethereal password
          },
        });
        return await emailTransport.sendMail({ from, to, subject, html, text });
      },
    },
  },
} as ServiceSchema;
