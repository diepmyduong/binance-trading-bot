import * as admin from "firebase-admin";
import config from "config";
import BaseError from "../base/error";

export default class Firebase {
  private static _instance: Firebase;
  static get instance() {
    if (!this._instance) {
      this._instance = new Firebase();
    }
    return this._instance;
  }
  static get auth() {
    return this.instance.app.auth();
  }
  static get messaging() {
    return this.instance.app.messaging();
  }
  public app: admin.app.App;
  constructor() {
    this.app = admin.initializeApp({
      credential: admin.credential.cert(config.get("firebase.credential")),
      databaseURL: `https://${config.get("firebase.credential.project_id")}.firebaseio.com`,
    });
  }

  async uploadBuffer(buffer: any, filename: string) {
    const bucket = this.app.storage().bucket();
    const file = bucket.file(filename);
    // var buff = Buffer.from(buffer, 'binary').toString('utf-8');
    try {
      const stream = file.createWriteStream({
        metadata: {
          contentType: "application/pdf",
        },
      });
      stream.on("error", (err) => {
        console.log("err", err);
      });
      stream.on("finish", () => {
        console.log(filename);
      });
      stream.end(buffer);
    } catch (error) {
      throw new BaseError("firebase-error", error.message);
    }
  }
  async getFile(filename: string) {
    const file = this.app.storage().bucket().file(filename);
    try {
      return await file.download().catch(() => {
        console.log(`File ${filename} không tồn tại.`);
      });
    } catch (error) {
      throw new BaseError("firebase-error", error.message);
    }
  }
}
