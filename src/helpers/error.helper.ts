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

  static invalidCommision() {
    return new BaseError(403, "-117", "Hoa hồng không đúng");
  }
  static memberNotConnectedChatbot() {
    return new BaseError(403, "-118", "Chưa kết nối Fanpage");
  }
  static chatBotMessageError() {
    return new BaseError(403, "-119", "Chatbot gửi message bị lỗi xử lý");
  }
  static chatBotImageError() {
    return new BaseError(403, "-120", "Chatbot gửi ảnh bị lỗi xử lý");
  }
  static psIdNotfound() {
    return new BaseError(403, "-142", "Không có PsId");
  }
  static cannotEditOrder() {
    return new BaseError(403, "-126", "Không thay đổi đơn hàng này.");
  }
  static notConnectedInventory() {
    return new BaseError(500, "-127", "Kho chưa được kết nối với đơn vị giao hàng");
  }
  static cannotMatchShipMethod() {
    return new BaseError(403, "-126", "PTVC Không hổ trợ giao hàng VNPOST");
  }
}
