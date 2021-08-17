import BaseError from "../base/error";

export const authErrorPermissionDeny = new BaseError("auth-error", "Không đủ quyền truy cập", 401);
