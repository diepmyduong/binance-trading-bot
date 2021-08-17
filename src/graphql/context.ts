import { Request } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { get } from "lodash";

import BaseError from "../base/error";
import Token from "../helpers/token";
import { UserRole } from "./modules/user/user.model";

export class Context {
  public meta: any = {};
  public req: Request;
  public isAuth: boolean = false;
  public isTokenExpired: boolean = false;
  public token: Token;
  constructor(props: { req?: Request; connection?: any }) {
    this.parseToken(props);
  }

  get id() {
    return this.token._id;
  }
  get isAdmin() {
    return this.token.role == UserRole.ADMIN;
  }

  parseToken(params: any) {
    try {
      const { req, connection } = params;
      let token;

      if (req) {
        token = get(req, "headers.x-token") || get(req, "query.x-token");
      }

      if (connection && connection.context) {
        token = connection.context["x-token"];
      }

      if (token === "null") token = null;
      if (token) {
        this.token = Token.decode(token);
        this.isAuth = true;
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
    if (!this.isAuth) throw new BaseError("auth-error", "Chưa xác thực", 401);
    if (roles.indexOf(this.token.role) !== -1) {
      return;
    } else {
      if (this.isTokenExpired) throw new BaseError("auth-error", "Token hết hạn", 401);
      throw new BaseError("auth-error", "Không đủ quyền truy cập", 401);
    }
  }
}

export async function onContext(params: any) {
  let context: Context = new Context(params);
  return context;
}
