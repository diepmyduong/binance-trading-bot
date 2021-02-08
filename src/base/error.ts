import dotenv from "dotenv";
import express from "express";
// import Raven from 'raven';

// import { config } from '..';

dotenv.config();

// let sentry: Raven.Client;
// if (config.enableSentry) {
//   if (!process.env.SENTRY_CONNECTSTRING) throw new Error('Missing config SENTRY_CONNECTSTRING');
//   sentry = Raven.config(process.env.SENTRY_CONNECTSTRING).install();
// }

export interface IErrorInfo {
  status: number;
  code: string;
  message: string;
  data?: any;
}

export class BaseError extends Error {
  constructor(status: number, code: string, message: string, data?: any) {
    super(message);
    this.info = { status, code, message, data };
  }
  info: IErrorInfo;
}
export class BaseErrorHelper {
  static handleError(func: (req: express.Request, rep: express.Response) => Promise<any>) {
    return (req: express.Request, res: express.Response) =>
      func
        .bind(this)(req, res)
        .catch((error: any) => {
          if (!error.info) {
            const err = this.somethingWentWrong();
            res.status(err.info.status).json(err.info);
            this.logUnknowError(error);
          } else {
            res.status(error.info.status).json(error.info);
          }
        });
  }
  static logUnknowError(error: Error) {
    console.log("*** UNKNOW ERROR ***");
    console.log(error);
    console.log("********************");
    // if (sentry) {
    //   try {
    //     sentry.captureException(error);
    //   } catch (err) {
    //     console.log('*** CANNOT CAPTURE EXCEPTION TO SENTRY ***');
    //     console.log(err.message);
    //     console.log('******************************************');
    //   }
    // }
  }
  static logError(prefix: string, logOption = true) {
    return (error: any) => {
      console.log(prefix, error.message || error, logOption ? error.options : "");
    };
  }
  // Unknow
  static somethingWentWrong(message?: string) {
    return new BaseError(500, "500", message || "Có lỗi xảy ra");
  }
  // Auth
  static unauthorized() {
    return new BaseError(401, "401", "Chưa xác thực");
  }
  static badToken() {
    return new BaseError(401, "-1", "Không có quyền truy cập");
  }
  static tokenExpired() {
    return new BaseError(401, "-2", "Mã truy cập đã hết hạn");
  }
  static permissionDeny() {
    return new BaseError(405, "-3", "Không đủ quyền để truy cập");
  }
  // Request
  static requestDataInvalid(message: string) {
    return new BaseError(403, "-4", "Dữ liệu gửi lên không hợp lệ " + message);
  }
  // External Request
  static externalRequestFailed(message: string) {
    return new BaseError(500, "-5", message);
  }
  // Mongo
  static mgRecoredNotFound(objectName: string = "dữ liệu yêu cầu") {
    return new BaseError(404, "-7", "Không tìm thấy " + objectName);
  }
  static mgQueryFailed(message: string) {
    return new BaseError(403, "-8", message || "Truy vấn không thành công");
  }
  static branchNotWorking() {
    return new BaseError(403, "-9", "Chi nhánh không làm việc vào ngày này");
  }
  static recoredNotFound(message: string) {
    return new BaseError(404, "-10", `Không tìm thấy dữ liệu yêu cầu: ${message}`);
  }
}

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
  static farmerPinNotCorrect() {
    return new BaseError(403, "-112", `Mã pin không đúng`);
  }
  static deliveryStatusWrong() {
    return new BaseError(403, "-113", `Trạng thái đơn hàng không đúng`);
  }
  static notEnoughtPoint() {
    return new BaseError(403, "-114", "Tài khoản không đủ điểm");
  }
  static spinError(message: string) {
    return new BaseError(403, "-115", message);
  }
  static invalidPin() {
    return new BaseError(403, "-116", "Mã pin phải là 6 số");
  }
  static validateJSONError(message: string = "") {
    return new BaseError(500, "-117", message);
  }
  static error(message: string) {
    return new BaseError(403, "-118", message);
  }

  static productNotExist() {
    return new BaseError(403, "-117", "Sản phẩm không tồn tại");
  }

}
