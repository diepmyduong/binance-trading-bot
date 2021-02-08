export const ViettelDeliveryStatusDetail = {
    "-100":  "Đơn hàng mới tạo, chưa duyệt",
    "-108":  "Đơn hàng gửi tại bưu cục",
    "-109":  "Đơn hàng đã gửi tại điểm thu gom",
    "-110":  "Đơn hàng đang bàn giao qua bưu cục",
    "100":  "Tiếp nhận đơn hàng từ đối tác 'Viettelpost xử lý đơn hàng'",
    "101":  "ViettelPost yêu cầu hủy đơn hàng",
    "102":  "Đơn hàng chờ xử lý",
    "103":  "Giao cho bưu cục 'Viettelpost xử lý đơn hàng'",
    "104":  "Giao cho Bưu tá đi nhận",
    "105":  "Buu Tá đã nhận hàng",
    "106":  "Đối tác yêu cầu lấy lại hàng",
    "107":  "Đối tác yêu cầu hủy qua API",
    "200":  "Nhận từ bưu tá - Bưu cục gốc",
    "201":  "Hủy nhập phiếu gửi",
    "202":  "Sửa phiếu gửi",
    "300":  "Close delivery file",
    "301":  "Ðóng túi gói 'Vận chuyển đi từ'",
    "302":  "Đóng chuyến thư 'Vận chuyển đi từ'",
    "303":  "Đóng tuyến xe 'Vận chuyển đi từ'",
    "400":  "Nhận bảng kê đến 'Nhận tại'",
    "401":  "Nhận Túi gói 'Nhận tại'",
    "402":  "Nhận chuyến thư 'Nhận tại'",
    "403":  "Nhận chuyến xe 'Nhận tại'",
    "500":  "Giao bưu tá đi phát",
    "501":  "Thành công - Phát thành công",
    "502":  "Chuyển hoàn bưu cục gốc",
    "503":  "Hủy - Theo yêu cầu khách hàng",
    "504":  "Thành công - Chuyển trả người gửi",
    "505":  "Tồn - Thông báo chuyển hoàn bưu cục gốc",
    "506":  "Tồn - Khách hàng nghỉ, không có nhà",
    "507":  "Tồn - Khách hàng đến bưu cục nhận",
    "508":  "Phát tiếp",
    "509":  "Chuyển tiếp bưu cục khác",
    "510":  "Hủy phân công phát",
    "515":  "Bưu cục phát duyệt hoàn",
    "550":  "Đơn Vị Yêu Cầu Phát Tiếp",
}

export function GetViettelDeliveryStatusText(status:string) {
    switch(true) {
        case ["-100"].includes(status):
            return "Chưa duyệt"
        case ["100" ,"102","103", "104" , "-108"].includes(status):
            return "Đã duyệt";
        case ["-109" , "-110"].includes(status):
            return "Đã gửi tại cửa hàng tiện lợi";
        case ["107", "201"].includes(status):
            return "Đã hủy";
        case ["105"].includes(status):
            return "Đã lấy hàng";
        case ["200" ,"202" ,"300" ,"320", "400"].includes(status):
            return "Đang vận chuyển";    
        case ["500", "506", "570", "508", "509", "550"].includes(status):
            return "Đang giao hàng";
        case ["507"].includes(status):
            return "Giao hàng thất bại";   
        case ["505","502", "515"].includes(status):
            return "Duyệt hoàn";
        case ["503"].includes(status):
            return "Phát thành công tiêu hủy";
        case ["504"].includes(status):
            return "Hoàn thành công";
        case ["505"].includes(status):
            return "Chờ duyệt hoàn";
        case ["501"].includes(status):
            return "Giao hàng thành công";
    }
}

        