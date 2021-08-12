import { Request } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import _, { get } from "lodash";

import { AuthHelper } from "../helpers";
import { TokenHelper } from "../helpers/token.helper";

export type TokenData = {
  role: string;
  _id: string;
  [name: string]: string;
};
export type SignedRequestPayload = {
  psid: string;
  algorithm: string;
  thread_type: string;
  tid: string;
  issued_at: number;
  page_id: number;
};

export class Context {
  public meta: any = {};
  public req: Request;
  public isAuth: boolean = false;
  public isTokenExpired: boolean = false;
  public tokenData: TokenData;
  public token: string = null;
  constructor(props: { req?: Request; connection?: any }) {
    this.parseToken(props);
  }

  get id() {
    return get(this.tokenData, "_id");
  }

  parseToken(params: any) {
    try {
      const { req, connection } = params;
      let token;

      if (req) {
        token = _.get(req, "headers.x-token") || _.get(req, "query.x-token");
      }

      if (connection && connection.context) {
        token = connection.context["x-token"];
      }

      if (token === "null") token = null;
      if (token) {
        const decodedToken: any = TokenHelper.decodeToken(token);
        this.isAuth = true;
        this.tokenData = decodedToken;
        this.token = token;
      }
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        this.isTokenExpired = true;
      }
      this.isAuth = false;
    } finally {
      return this;
    }
  }

  auth(roles: string[]) {
    AuthHelper.acceptRoles(this, roles);
  }
}

export async function onContext(params: any) {
  let context: Context = new Context(params);
  return context;
}
