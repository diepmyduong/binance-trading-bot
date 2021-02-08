import { Context } from "../graphql/context";
import { ErrorHelper } from "../base/error";

export class AuthHelper {
  constructor() {}

  static acceptRoles(context: Context, roles: String[]) {
    if (!context.isAuth) throw ErrorHelper.unauthorized();
    if (roles.indexOf(context.tokenData.role) !== -1) {
      return;
    } else {
      if (context.isTokenExpired) throw ErrorHelper.tokenExpired();
      throw ErrorHelper.permissionDeny();
    }
  }
  static checkValidAuth(context: Context, throwError = true) {
    if (context.isTokenExpired) {
      if (!throwError) return false;
      throw ErrorHelper.tokenExpired();
    }
    if (!context.isAuth) {
      if (!throwError) return false;
      throw ErrorHelper.unauthorized();
    }
    return true;
  }
  static isOwner(context: Context, _id: string, throwError = true) {
    const validAuth = this.checkValidAuth(context, throwError);
    if (!validAuth) return false;
    if (context.tokenData!._id.toString() != _id.toString()) {
      if (!throwError) return false;
      throw ErrorHelper.permissionDeny();
    }
    return true;
  }
}
