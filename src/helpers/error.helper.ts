import { BaseErrorHelper, BaseError } from "../base/error";

export class ErrorHelper extends BaseErrorHelper {
  static userNotExist() {
    return new BaseError(403, "-103", "Người dùng không tồn tại");
  }
  static userExisted() {
    return new BaseError(403, "-104", "Người dùng đã tồn tại");
  }
  static userRoleNotSupported() {
    return new BaseError(401, "-105", "Người dùng không được cấp quyền");
  }
  static userError(message: string) {
    return new BaseError(403, "-106", "Lỗi người dùng: " + message);
  }
  static duplicateError(key: string) {
    return new BaseError(403, "-107", `${key} đã bị trùng.`);
  }
  static readOnlyError(key: string) {
    return new BaseError(403, "-108", `${key} chỉ được phép xem.`);
  }
  static createUserError(message: string) {
    return new BaseError(401, "-109", `Lỗi tạo người dùng: ${message}`);
  }
  static updateUserError(message: string) {
    return new BaseError(401, "-110", `Lỗi cập nhật người dùng: ${message}`);
  }
  static userPasswordNotCorrect() {
    return new BaseError(403, "-111", `Mật khẩu không đúng.`);
  }
}
