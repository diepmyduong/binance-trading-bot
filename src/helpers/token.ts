import config from "config";
import jwt from "jsonwebtoken";

export default class Token {
  constructor(
    readonly _id: string,
    readonly role: string,
    readonly payload: any = {},
    readonly expiresIn: string | number = "30d"
  ) {}

  get sign() {
    return jwt.sign({ ...this.payload, role: this.role, _id: this._id }, config.get("secret"), {
      expiresIn: this.expiresIn,
    });
  }

  static decode(token: string) {
    const { _id, role, ...payload }: any = jwt.verify(token, config.get("secret"));
    return new Token(_id, role, payload);
  }
}
