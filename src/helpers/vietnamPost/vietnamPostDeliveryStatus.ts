export const VietnamPostDeliveryStatusDetail = {
  10: "Đơn hàng đã xóa",
  20: "Gửi sang hệ thống MyVNPOST thành công",
  60: "Đơn hàng đã hủy",
  61: "Báo hủy đơn hàng",
  62: "Đã nhận báo hủy",
  70: "Bưu cục đã nhận đơn hàng và nhập vào hệ thống chuyển phát của VNPost",
  91: "Đã đi phát hàng cho người nhận nhưng không thành công",
  100: "Hàng đã phát thành công cho người nhận",
  110: "Bưu tá đã nhận tiền COD của người nhận và nhập vào hệ thống Paypost/Chờ trả tiền",
  120: "Tiền COD đã trả cho người gửi",
  161: "Phát hoàn cho người gửi thất bại",
  170: "Phát hoàn cho người gửi thành công",
};

export function GetVietnamPostDeliveryStatusText(status: number) {
  switch (
    true
    // case [].includes(status):
    //   return "Chưa duyệt";
    // case ["100", "102", "103", "104", "-108"].includes(status):
    //   return "Đã duyệt";
    // case ["-109", "-110"].includes(status):
    //   return "Đã gửi tại cửa hàng tiện lợi";
    // case ["107", "201"].includes(status):
    //   return "Đã hủy";
    // case ["105"].includes(status):
    //   return "Đã lấy hàng";
    // case ["200", "202", "300", "320", "400"].includes(status):
    //   return "Đang vận chuyển";
    // case ["500", "506", "570", "508", "509", "550"].includes(status):
    //   return "Đang giao hàng";
    // case ["507"].includes(status):
    //   return "Giao hàng thất bại";
    // case ["505", "502", "515"].includes(status):
    //   return "Duyệt hoàn";
    // case ["503"].includes(status):
    //   return "Phát thành công tiêu hủy";
    // case ["504"].includes(status):
    //   return "Hoàn thành công";
    // case ["505"].includes(status):
    //   return "Chờ duyệt hoàn";
    // case ["501"].includes(status):
    //   return "Giao hàng thành công";
  ) {
  }
}
