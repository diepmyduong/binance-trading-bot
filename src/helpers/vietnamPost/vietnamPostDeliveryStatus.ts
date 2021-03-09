import { OrderStatus } from "../../graphql/modules/order/order.model"

export const VietnamPostDeliveryStatusDetail = {
  10: "Đơn hàng đã xóa",
  20: "Gửi sang hệ thống MyVNPOST thành công",
  60: "Đơn hàng đã hủy",

  70: "Bưu cục đã nhận đơn hàng và nhập vào hệ thống chuyển phát của VNPost",

  // giao hang ko dc
  91: "Đã đi phát hàng cho người nhận nhưng không thành công",
  
  100: "Hàng đã phát thành công cho người nhận",
  110: "Bưu tá đã nhận tiền COD của người nhận và nhập vào hệ thống Paypost/Chờ trả tiền",
  120: "Tiền COD đã trả cho người gửi",
  //
  61: "Báo hủy đơn hàng",
  62: "Đã nhận báo hủy",

  // chua co func
  161: "Phát hoàn cho người gửi thất bại",
  170: "Phát hoàn cho người gửi thành công",
};

export function GetVietnamPostDeliveryStatusText(status: string) {
  switch (true) { 
    case ["-1"].includes(status):
      return "Chưa duyệt";
    case ["20"].includes(status):
      return "Đã duyệt";
    case ["60", "62"].includes(status):
      return "Đã hủy đơn hàng";
    case ["70"].includes(status):
      return "Bưu cục đã nhận đơn hàng và đang giao hàng";
    case ["91"].includes(status):
      return "Giao hàng thất bại";
    case ["100"].includes(status):
      return "Giao hàng thành công";
    case ["161"].includes(status):
      return "Phát hoàn người gửi thất bại";
    case ["170"].includes(status):
      return "Phát hoàn người gửi thành công";
    case ["110"].includes(status):
      return "Nhận tiền COD và nhập vào hệ thống";
    case ["120"].includes(status):
      return "Đã nhận tiền COD. Hoàn tất đơn hàng.";
  }
}

export enum DeliveryStatus {
  DELIVERING = "DELIVERING", // Đang vận chuyển
  COMPLETED = "COMPLETED", // Đã duyệt
  FAILURE = "FAILURE"
}

// setting tu dong duyet
// setting 

export function GetOrderStatusByPostDeliveryStatus(status: string) {
  switch (true) {
    case ["20","70"].includes(status):
      return DeliveryStatus.DELIVERING;
    case ["100","120"].includes(status):
      return DeliveryStatus.COMPLETED;
    case ["91"].includes(status): // phát hoàn cho người gửi thành công
      return DeliveryStatus.FAILURE;
    default:
      return null;
  }
}

// setting tu dong duyet
// setting 

export function GetOrderStatus(status: string) {
  switch (true) {
    case ["20"].includes(status):
      return OrderStatus.CONFIRMED;
    case ["70"].includes(status):
      return OrderStatus.DELIVERING;
    case ["120"].includes(status): // giao hàng thành công + có COD
      return OrderStatus.COMPLETED;
    case ["100"].includes(status): // giao hang thanh cong khong co cod
      return OrderStatus.COMPLETED; 
    case ["170"].includes(status): // phát hoàn cho người gửi thành công
      return OrderStatus.RETURNED;
    default:
      return null;
  }
}
