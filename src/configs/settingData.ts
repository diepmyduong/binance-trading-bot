import { DeliveryServices, ServiceCode } from "../helpers";
import { SettingType } from "../graphql/modules/setting/setting.model";

export enum SettingGroupSlug {
  CAU_HINH_CHUNG = "CAU_HINH_CHUNG",
  THONG_BAO_CHATBOT = "THONG_BAO_CHATBOT",
  KICH_BAN_BAT_DAU = "KICH_BAN_BAT_DAU",
  CAU_HINH_VAN_CHUYEN = "CAU_HINH_VAN_CHUYEN",
}
export enum SettingKey {
  // CAU_HINH_CHUNG
  TITLE = "TITLE",
  LOGO = "LOGO",
  UNIT_PRICE = "UNIT_PRICE",
  CHATBOT_API_KEY = "CHATBOT_API_KEY",
  // THONG_BAO_CHATBOT
  REGIS_SERVICE_COMMISSION_MSG = "REGIS_SERVICE_COMMISSION_MSG",
  REGIS_SERVICE_BONUS_POINT_MSG = "REGIS_SERVICE_BONUS_POINT_MSG",

  SMS_COMMISSION_MSG = "SMS_COMMISSION_MSG",
  SMS_BONUS_POINT_MSG = "SMS_BONUS_POINT_MSG",

  ORDER_COMMISSION_MSG_FOR_PRESENTER = "ORDER_COMMISSION_MSG_FOR_PRESENTER",

  ORDER_COMPLETED_MSG = "ORDER_COMPLETED_MSG",

  ORDER_CANCELED_MSG = "ORDER_CANCELED_MSG",
  ORDER_CANCELED_CUSTOMER_MSG = "ORDER_CANCELED_CUSTOMER_MSG",
  ORDER_CANCELED_CUSTOMER_MOBI_MSG = "ORDER_CANCELED_CUSTOMER_MOBI_MSG",
  ORDER_CANCELED_SELLER_MSG = "ORDER_CANCELED_SELLER_MSG",
  ORDER_CANCELED_SELLER_CROSSSALE_MSG = "ORDER_CANCELED_SELLER_CROSSSALE_MSG",

  SMS_COMPLETED_MSG_FOR_CUSTOMER = "SMS_COMPLETED_MSG_FOR_CUSTOMER",
  SMS_COMPLETED_MSG_FOR_MOBIFONE = "SMS_COMPLETED_MSG_FOR_MOBIFONE",
  SMS_COMPLETED_MSG_FOR_SELLER = "SMS_COMPLETED_MSG_FOR_SELLER",
  SMS_CANCELED_MSG = "SMS_CANCELED_MSG",
  SMS_COMMISSION_MSG_FOR_PRESENTER = "SMS_COMMISSION_MSG_FOR_PRESENTER",

  REGIS_SERVICE_COMPLETED_MSG_MOBIFONE = "REGIS_SERVICE_COMPLETED_MSG_MOBIFONE",
  REGIS_SERVICE_COMPLETED_MSG_CUSTOMER = "REGIS_SERVICE_COMPLETED_MSG_CUSTOMER",
  REGIS_SERVICE_COMPLETED_MSG_SELLER = "REGIS_SERVICE_COMPLETED_MSG_SELLER",
  REGIS_SERVICE_COMMISSION_MSG_FOR_PRESENTER = "REGIS_SERVICE_COMMISSION_MSG_FOR_PRESENTER",
  REGIS_SERVICE_CANCELED_MSG = "REGIS_SERVICE_CANCELED_MSG",

  //////////////////////////////////////////////////////////////////////////
  ORDER_PENDING_MSG_FOR_SHOPPER = "ORDER_PENDING_MSG_FOR_SHOPPER",
  ORDER_PENDING_MSG_FOR_CUSTOMER = "ORDER_PENDING_MSG_FOR_CUSTOMER",
  ORDER_PENDING_MSG_FOR_CROSSALE_SHOPPER = "ORDER_PENDING_MSG_FOR_CROSSALE_SHOPPER",
  ORDER_PENDING_MSG_FOR_MOBIFONE = "ORDER_PENDING_MSG_FOR_MOBIFONE",
  //////////////////////////////////////////////////////////////////////////

  ORDER_COMPLETED_MSG_FOR_SHOPPER = "ORDER_COMPLETED_MSG_FOR_SHOPPER",
  ORDER_COMPLETED_MSG_FOR_CROSSALE_SHOPPER = "ORDER_COMPLETED_MSG_FOR_CROSSALE_SHOPPER",
  ORDER_COMPLETED_MSG_FOR_CUSTOMER = "ORDER_COMPLETED_MSG_FOR_CUSTOMER",
  ORDER_COMPLETED_MSG_FOR_MOBIPHONE = "ORDER_COMPLETED_MSG_FOR_MOBIPHONE",
  LUCKYWHEEL_WIN_CUMMULATIVE_POINT_MSG_FOR_MOBIFONE = "LUCKYWHEEL_WIN_CUMMULATIVE_POINT_MSG_FOR_MOBIFONE",
  LUCKYWHEEL_WIN_CUMMULATIVE_POINT_MSG_FOR_CUSTOMER = "LUCKYWHEEL_WIN_CUMMULATIVE_POINT_MSG_FOR_CUSTOMER",
  LUCKYWHEEL_WIN_PRESENT_MSG_FOR_MOBIFONE = "LUCKYWHEEL_WIN_PRESENT_MSG_FOR_MOBIFONE",
  LUCKYWHEEL_WIN_EVOUCHER_MSG_FOR_MOBIFONE = "LUCKYWHEEL_WIN_EVOUCHER_MSG_FOR_MOBIFONE",

  LUCKYWHEEL_WIN_PRESENT_MSG_FOR_CUSTOMER = "LUCKYWHEEL_WIN_PRESENT_MSG_FOR_CUSTOMER",
  LUCKYWHEEL_WIN_EVOUCHER_MSG_FOR_CUSTOMER = "LUCKYWHEEL_WIN_EVOUCHER_MSG_FOR_CUSTOMER",
  LUCKYWHEEL_LOSE_MSG_FOR_CUSTOMER = "LUCKYWHEEL_LOSE_MSG_FOR_CUSTOMER",

  // KICH_BAN_BAT_DAU
  STORY_NAME = "STORY_NAME",
  STORY_REF = "STORY_REF",
  STORY_MESSAGE = "STORY_MESSAGE",
  STORY_BTN_TITLE = "STORY_BTN_TITLE",
  WEBAPP_DOMAIN = "WEBAPP_DOMAIN",
  ADMIN_DOMAIN = "ADMIN_DOMAIN",
  APP_DOMAIN = "APP_DOMAIN",
  CAMPAIGN_HEADER_MSG_FOR_SHOPPER = "CAMPAIGN_HEADER_MSG_FOR_SHOPPER",
  CAMPAIGN_IMAGE_MSG_FOR_SHOPPER = "CAMPAIGN_IMAGE_MSG_FOR_SHOPPER",
  CAMPAIGN_CONTENT_MSG_FOR_SHOPPER = "CAMPAIGN_CONTENT_MSG_FOR_SHOPPER",

  //DELIVERY
  DELIVERY_ENABLED_VNPOST = "DELIVERY_ENABLED_VNPOST",
  DELIVERY_VNPOST_INNER_SHIP_FEE = "DELIVERY_VNPOST_INNER_SHIP_FEE",
  DELIVERY_POST_FEE = "DELIVERY_POST_FEE",
  DELIVERY_ORDER_SHIP_FEE = "DELIVERY_ORDER_SHIP_FEE",
  DELIVERY_ENABLED_AUTO_APPROVE_ORDER = "DELIVERY_ENABLED_AUTO_APPROVE_ORDER",
  VNPOST_DEFAULT_SHIP_SERVICE_METHOD_CODE = "VNPOST_DEFAULT_SHIP_SERVICE_METHOD_CODE",
  DELIVERY_STATUS_CUSTOMER_ALERT = "DELIVERY_STATUS_CUSTOMER_ALERT",
  DELIVERY_STATUS_MEMBER_ALERT = "DELIVERY_STATUS_MEMBER_ALERT",

  DELIVERY_COMPLETED_MSG_FOR_CUSTOMER = "DELIVERY_COMPLETED_MSG_FOR_CUSTOMER",
  DELIVERY_FAILURE_MSG_FOR_CUSTOMER = "DELIVERY_FAILURE_MSG_FOR_CUSTOMER",
  DELIVERY_PENDING_MSG_FOR_CUSTOMER = "DELIVERY_PENDING_MSG_FOR_CUSTOMER",

  DELIVERY_COMPLETED_MSG_FOR_MEMBER = "DELIVERY_COMPLETED_MSG_FOR_MEMBER",
  DELIVERY_FAILURE_MSG_FOR_MEMBER = "DELIVERY_FAILURE_MSG_FOR_MEMBER",
  DELIVERY_PENDING_MSG_FOR_MEMBER = "DELIVERY_PENDING_MSG_FOR_MEMBER",
}
export const SETTING_DATA = [
  {
    slug: SettingGroupSlug.CAU_HINH_CHUNG,
    name: "Cấu hình chung",
    desc: "Các cấu hình chung",
    readOnly: true,
    settings: [
      {
        type: SettingType.string,
        name: "Tiêu đề ứng dụng",
        key: SettingKey.TITLE,
        value: `Mobifone - AShop`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.string,
        name: "Logo ứng dụng",
        key: SettingKey.LOGO,
        value: `https://mb-ashop.web.app/assets/img/logo.png`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.number,
        name: "Đơn giá",
        key: SettingKey.UNIT_PRICE,
        value: 1000,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.string,
        name: "Chatbot API Key của Fanpage chính",
        key: SettingKey.CHATBOT_API_KEY,
        value: "",
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
    ],
  },
  {
    slug: SettingGroupSlug.THONG_BAO_CHATBOT,
    name: "Thông báo chatbot",
    desc: "Nội dung thông báo chatbot",
    readOnly: true,
    settings: [
      {
        type: SettingType.richText,
        name: "Thông báo khi nhận hoa hồng người giới thiệu từ đơn hàng bán lẻ",
        key: SettingKey.ORDER_COMMISSION_MSG_FOR_PRESENTER,
        value: `[Thông báo tự động cho thành viên]
Chủ shop {{shopper.shopName}} do bạn giới thiệu đã duyệt thành công đơn hàng {{code}}.
Hoa hồng bạn nhận được là: {{$money(commission)}} đồng, tổng hoa hồng hiện tại là {{$money(myCommission)}} đồng.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo khi duyệt đơn hàng cho khách hàng",
        key: SettingKey.ORDER_COMPLETED_MSG_FOR_CUSTOMER,
        value: `[Thông báo tự động cho khách hàng]
Đơn hàng {{order.code}} đã được duyệt. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
{{commission ? \`Hoa hồng tích lũy quý khách nhận được là: \${$money(commission)} đồng, tổng điểm hiện tại là \${$money(Mycommission)} đồng.\`: \`\` }}
{{point ? \`Điểm tích lũy quý khách nhận được là: \${$money(point)} điểm, tổng điểm hiện tại là \${$money(myPoint)} điểm.\`: \`\` }}
Nếu quý khách có thắc mắc vui lòng liên hệ với chủ shop để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },

      {
        type: SettingType.richText,
        name: "Thông báo khi duyệt đơn hàng cho chủ shop",
        key: SettingKey.ORDER_COMPLETED_MSG_FOR_SHOPPER,
        value: `[Thông báo tự động cho chủ shop]
Đơn hàng {{order.code}} đã được duyệt. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
Nếu bạn có thắc mắc vui lòng liên hệ với chủ shop để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo khi duyệt đơn hàng cho chủ shop bán chéo",
        key: SettingKey.ORDER_COMPLETED_MSG_FOR_CROSSALE_SHOPPER,
        value: `[Thông báo tự động cho chủ shop bán chéo]
Đơn hàng {{order.code}} đã được duyệt. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
{{commission ? \`Shop đã được tích \${$money(commission)} đồng, tổng tiền hoa hồng hiện tại là \${$money(myCommission)} đồng.\`: \`\`  }}
{{point ? \`Điểm tích lũy shop nhận được là: \${$money(point)} điểm, tổng điểm hiện tại là \${$money(myPoint)} điểm.\`: \`\` }}
Nếu bạn có thắc mắc vui lòng liên hệ với chủ shop để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo khi duyệt đơn hàng cho mobifone",
        key: SettingKey.ORDER_COMPLETED_MSG_FOR_MOBIPHONE,
        value: `[Thông báo tự động cho Mobifone]
Đơn hàng {{order.code}} đã được duyệt. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
{{commission ? \`Hoa hồng mobifone nhận được là: \${$money(commission)} đồng.\`: \`\`  }}
`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo cho chủ shop khi hủy đơn hàng",
        key: SettingKey.ORDER_CANCELED_MSG,
        value: `[Thông báo tự động cho chủ shop]
Đơn hàng {{order.code}} đã huỷ. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo cho khách khi hủy đơn hàng (Chủ shop)",
        key: SettingKey.ORDER_CANCELED_CUSTOMER_MSG,
        value: `[Thông báo tự động]
Đơn hàng {{order.code}} đã huỷ. Thông tin đơn hàng:
+ Danh sách sản phẩm:
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
Nếu bạn có thắc mắc vui lòng liên hệ với chủ shop để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      //////////////////////////////////////////////////////////////////////////////////////
      // ORDER_PENDING_MSG_FOR_SHOPPER = "ORDER_PENDING_MSG_FOR_SHOPPER",
      {
        type: SettingType.richText,
        name: "Thông báo cho chủ shop khi có đơn hàng",
        key: SettingKey.ORDER_PENDING_MSG_FOR_SHOPPER,
        value: `[Thông báo tự động]
Đơn hàng {{order.code}} đặt thành công. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
Nếu bạn có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      // ORDER_PENDING_MSG_FOR_CUSTOMER = "ORDER_PENDING_MSG_FOR_CUSTOMER",
      {
        type: SettingType.richText,
        name: "Thông báo cho khách hàng khi đặt hàng thành công",
        key: SettingKey.ORDER_PENDING_MSG_FOR_CUSTOMER,
        value: `[Thông báo tự động]
Đơn hàng {{order.code}} đặt thành công. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
Nếu bạn có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      // ORDER_PENDING_MSG_FOR_CROSSALE_SHOPPER = "ORDER_PENDING_MSG_FOR_CROSSALE_SHOPPER",
      {
        type: SettingType.richText,
        name: "Thông báo cho chủ shop bán chéo khi đặt hàng thành công",
        key: SettingKey.ORDER_PENDING_MSG_FOR_CROSSALE_SHOPPER,
        value: `[Thông báo tự động dành cho Mobifone]
Đơn hàng {{order.code}} đặt thành công. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
Nếu bạn có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      // ORDER_PENDING_MSG_FOR_MOBIFONE = "ORDER_PENDING_MSG_FOR_MOBIFONE",
      {
        type: SettingType.richText,
        name: "Thông báo cho mobifone khi đặt hàng thành công",
        key: SettingKey.ORDER_PENDING_MSG_FOR_MOBIFONE,
        value: `[Thông báo tự động dành cho Mobifone]
Đơn hàng {{order.code}} đặt thành công. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
Nếu bạn có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      ///////////////////////////////////////////////////////////////////////
      {
        type: SettingType.richText,
        name: "Thông báo cho khách khi hủy đơn hàng (Mobifone)",
        key: SettingKey.ORDER_CANCELED_CUSTOMER_MOBI_MSG,
        value: `[Thông báo tự động]
Đơn hàng {{order.code}} đã huỷ. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
Nếu bạn có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo cho chủ shop khi hủy đơn hàng (Tự huỷ)",
        key: SettingKey.ORDER_CANCELED_SELLER_MSG,
        value: `[Thông báo tự động]
Đơn hàng {{order.code}} đã huỷ. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo cho chủ shop khi hủy đơn hàng (Bán chéo)",
        key: SettingKey.ORDER_CANCELED_SELLER_CROSSSALE_MSG,
        value: `[Thông báo tự động]
Đơn hàng {{order.code}} đã huỷ. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo khi duyệt đăng ký SMS cho khách hàng",
        key: SettingKey.SMS_COMPLETED_MSG_FOR_CUSTOMER,
        value: `[Thông báo tự động cho khách hàng]
Quý khách đăng ký SMS - mã số {{code}} thành công.
{{myPoint ? \`Điểm tích lũy quý khách nhận được là: \${$money(point)} điểm, tổng điểm hiện tại là \${$money(myPoint)} điểm.\`: \`\` }}
Cảm ơn quý khách đã sử dụng dịch vụ.
Nếu quý khách có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo khi duyệt đăng ký SMS cho mobifone",
        key: SettingKey.SMS_COMPLETED_MSG_FOR_MOBIFONE,
        value: `[Thông báo tự động cho Mobifone]
Khách hàng {{registerName}} đăng ký SMS - mã số {{code}} thành công.
{{commission ? \`Hoa hồng mobifone nhận được là: \${$money(commission)} đồng.\`: \`\`  }}
`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo khi duyệt đăng ký SMS cho seller",
        key: SettingKey.SMS_COMPLETED_MSG_FOR_SELLER,
        value: `[Thông báo tự động cho chủ shop]
Khách hàng {{registerName}} đăng ký SMS - mã số {{code}} thành công.
{{myCommission ? \`Hoa hồng bạn nhận được là: \${$money(commission)} đồng, tổng hoa hồng hiện tại là \${$money(myCommission)} điểm.\`: \`\`  }}
{{myPoint ? \`Điểm tích lũy shop nhận được là: \${$money(point)} điểm, tổng điểm hiện tại là \${$money(myPoint)} điểm.\`: \`\` }}
`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo khi nhận hoa hồng người giới thiệu từ SMS",
        key: SettingKey.SMS_COMMISSION_MSG_FOR_PRESENTER,
        value: `[Thông báo tự động cho thành viên]
Chủ shop {{shopper.shopName}} do bạn giới thiệu đã được duyệt thành công đơn đăng ký SMS {{code}}.
Hoa hồng bạn nhận được là: {{$money(commission)}} đồng, tổng hoa hồng hiện tại là {{$money(myCommission)}} đồng.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo khi hủy đăng ký SMS",
        key: SettingKey.SMS_CANCELED_MSG,
        value: `[Thông báo tự động cho khách hàng]
Quý khách đăng ký SMS - mã số {{code}} bị từ chối do không hợp lệ.
Cảm ơn quý khách đã sử dụng dịch vụ.
Nếu quý khách có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo duyệt đăng ký dịch vụ cho khách hàng",
        key: SettingKey.REGIS_SERVICE_COMPLETED_MSG_CUSTOMER,
        value: `[Thông báo tự động cho khách hàng]
Quý khách đăng ký dịch vụ - mã số {{code}} thành công.
{{point ? \`Điểm tích lũy quý khách nhận được là: \${$money(point)} điểm, tổng điểm hiện tại là \${$money(myPoint)} điểm.\`: \`\` }}
Cảm ơn quý khách đã sử dụng dịch vụ.
Nếu quý khách có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      ///////////////////////////////////////////////////////////
      {
        type: SettingType.richText,
        name: "Thông báo khi duyệt đăng ký dịch vụ cho mobifone",
        key: SettingKey.REGIS_SERVICE_COMPLETED_MSG_MOBIFONE,
        value: `[Thông báo tự động cho Mobifone]
Khách hàng {{registerName}} đăng ký dịch vụ - mã số {{code}} thành công.
{{commission ? \`Hoa hồng mobifone nhận được là: \${$money(commission)} đồng.\`: \`\`  }}
`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo khi duyệt đăng ký dịch vụ cho seller",
        key: SettingKey.REGIS_SERVICE_COMPLETED_MSG_SELLER,
        value: `[Thông báo tự động cho chủ shop]
Khách hàng {{registerName}} đăng ký dịch vụ - mã số {{code}} thành công.
{{commission ? \`Hoa hồng bạn nhận được là: \${$money(commission)} đồng, tổng hoa hồng hiện tại là \${$money(myCommission)} điểm.\`: \`\`  }}
{{point ? \`Điểm tích lũy shop nhận được là: \${$money(point)} điểm, tổng điểm hiện tại là \${$money(myPoint)} điểm.\`: \`\` }}
`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo khi nhận hoa hồng người giới thiệu từ đăng ký dịch vụ",
        key: SettingKey.REGIS_SERVICE_COMMISSION_MSG_FOR_PRESENTER,
        value: `[Thông báo tự động cho thành viên]
Chủ shop {{shopper.shopName}} do bạn giới thiệu đã được duyệt thành công đơn đăng ký dịch vụ {{code}}.
Hoa hồng bạn nhận được là: {{$money(commission)}} đồng, tổng hoa hồng hiện tại là {{$money(myCommission)}} đồng.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      //////////////////////////////////////////////////////////
      {
        type: SettingType.richText,
        name: "Thông báo khi hủy đăng ký dịch vụ",
        key: SettingKey.REGIS_SERVICE_CANCELED_MSG,
        value: `[Thông báo tự động cho khách hàng]
Quý khách đăng ký dịch vụ - mã số {{code}} bị từ chối do không hợp lệ.
Cảm ơn quý khách đã sử dụng dịch vụ.
Nếu quý khách có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      //////////////////////////////////////////////////////////
      // LUCKYWHEEL_WIN_CUMMULATIVE_POINT_MSG_FOR_MOBIFONE = "LUCKYWHEEL_WIN_CUMMULATIVE_POINT_MSG_FOR_MOBIFONE",
      // LUCKYWHEEL_WIN_CUMMULATIVE_POINT_MSG_FOR_CUSTOMER = "LUCKYWHEEL_WIN_CUMMULATIVE_POINT_MSG_FOR_CUSTOMER",
      // LUCKYWHEEL_WIN_PRESENT_MSG_FOR_MOBIFONE = "LUCKYWHEEL_WIN_PRESENT_MSG_FOR_MOBIFONE",
      // LUCKYWHEEL_WIN_PRESENT_MSG_FOR_CUSTOMER = "LUCKYWHEEL_WIN_PRESENT_MSG_FOR_CUSTOMER",
      {
        type: SettingType.richText,
        name: "Thông báo khách hàng trúng thưởng [Điểm thưởng] cho Mobifone",
        key: SettingKey.LUCKYWHEEL_WIN_CUMMULATIVE_POINT_MSG_FOR_MOBIFONE,
        value: `[Thông báo tự động khách hàng trúng thưởng cho Mobifone]
Khách hàng {{tenKhachHang}} đã trúng thưởng [{{diem}} điểm] sau khi quay vòng quay {{maVongQuay}}.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo khách hàng trúng thưởng [Hiện vật] cho Mobifone",
        key: SettingKey.LUCKYWHEEL_WIN_PRESENT_MSG_FOR_MOBIFONE,
        value: `[Thông báo tự động khách hàng trúng thưởng cho Mobifone]
Quý khách {{tenKhachHang}} đã trúng thưởng [{{tenQua}} - {{maQua}}] sau khi quay vòng quay {{maVongQuay}}.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo khách hàng trúng thưởng [Hiện vật] cho Mobifone",
        key: SettingKey.LUCKYWHEEL_WIN_EVOUCHER_MSG_FOR_MOBIFONE,
        value: `[Thông báo tự động khách hàng trúng thưởng cho Mobifone]
Quý khách {{tenKhachHang}} đã trúng thưởng [{{tenQua}} - {{maQua}}] sau khi quay vòng quay {{maVongQuay}}. Chi tiết voucher : {{chiTiet}}`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name:
          "Thông báo cho khách hàng trúng thưởng [Điểm thưởng] vòng quay may mắn",
        key: SettingKey.LUCKYWHEEL_WIN_CUMMULATIVE_POINT_MSG_FOR_CUSTOMER,
        value: `[Thông báo tự động cho khách hàng]
Quý khách đã may mắn trúng thưởng [{{diem}} điểm] - mã quà [{{maQua}}] sau khi quay vòng quay {{maVongQuay}}. 
Điểm tích lũy hiện tại của quý khách là {{tongDiem}} điểm.
Cảm ơn quý khách đã tham gia chương trình.
Nếu quý khách có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name:
          "Thông báo cho khách hàng trúng thưởng [Hiện vật] vòng quay may mắn",
        key: SettingKey.LUCKYWHEEL_WIN_PRESENT_MSG_FOR_CUSTOMER,
        value: `[Thông báo tự động cho khách hàng]
Quý khách đã may mắn trúng giải thưởng [{{tenQua}} - MS:{{maQua}}] sau khi quay vòng quay {{maVongQuay}}.
Chi tiết - {{chiTiet}} 
Cảm ơn quý khách đã tham gia chương trình.
Nếu quý khách có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name:
          "Thông báo cho khách hàng trúng thưởng [Voucher] vòng quay may mắn",
        key: SettingKey.LUCKYWHEEL_WIN_EVOUCHER_MSG_FOR_CUSTOMER,
        value: `[Thông báo tự động cho khách hàng]
Quý khách đã may mắn trúng giải thưởng [{{tenQua}}] sau khi quay vòng quay {{maVongQuay}}.
Mã voucher - {{chiTiet}}
Cảm ơn quý khách đã tham gia chương trình.
Nếu quý khách có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo cho khách hàng thua vòng quay may mắn",
        key: SettingKey.LUCKYWHEEL_LOSE_MSG_FOR_CUSTOMER,
        value: `[Thông báo tự động cho khách hàng]
Cảm ơn quý khách đã tham gia vòng quay {{maVongQuay}}.
Chúc quý khách may mắn lần sau.
Nếu quý khách có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo mở đầu chiến dịch cho điểm bán",
        key: SettingKey.CAMPAIGN_HEADER_MSG_FOR_SHOPPER,
        value: `[Thông tin chiến dịch]
Quý khách vui lòng sử dụng hình ảnh và nội dung content mà công ty cung cấp để chia sẻ.

* Lưu ý đường link đính kèm phải đăng chính xác và không được thay đổi.
`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo hình ảnh chiến dịch cho điểm bán",
        key: SettingKey.CAMPAIGN_IMAGE_MSG_FOR_SHOPPER,
        value: `{{campaignImage}}`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo nội dung chiến dịch cho điểm bán",
        key: SettingKey.CAMPAIGN_CONTENT_MSG_FOR_SHOPPER,
        value: `{{campaign.name}}
{{campaign.content}}
        
Link đăng ký: 
{{affiliateLink}}

{{campaign.hashtags.toString().replace(',', ' ')}}`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
    ],
  },
  {
    slug: SettingGroupSlug.KICH_BAN_BAT_DAU,
    name: "Kịch bản bắt đầu",
    desc: "Các kịch bản mặc định khi kết nối Fanpage",
    readOnly: true,
    settings: [
      {
        type: SettingType.string,
        name: "Tên kịch bản",
        key: SettingKey.STORY_NAME,
        value: `Bắt đầu cửa hàng AShop`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.string,
        name: "Từ khoá đường dẫn mở kích bản",
        key: SettingKey.STORY_REF,
        value: `modauashop`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.string,
        name: "Tin nhắn",
        key: SettingKey.STORY_MESSAGE,
        value: `Nhấp vào "Cửa hàng" để vào cửa hàng AShop`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.string,
        name: "Tiêu đề nút",
        key: SettingKey.STORY_BTN_TITLE,
        value: `Cửa hàng`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.string,
        name: "Đường dẫn cửa hàng",
        key: SettingKey.WEBAPP_DOMAIN,
        value: `https://mb-ashop-web.web.app`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.string,
        name: "Đường dẫn quản trị hệ thống",
        key: SettingKey.ADMIN_DOMAIN,
        value: `https://mb-ashop.web.app`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.string,
        name: "Đường dẫn quản trị hệ thống",
        key: SettingKey.APP_DOMAIN,
        value: `https://mb-ashop.mcom.app`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
    ],
  },
  {
    slug: SettingGroupSlug.CAU_HINH_VAN_CHUYEN,
    name: "Cấu hình vận chuyển",
    desc: "Cấu hình thông số vận chuyển",
    readOnly: true,
    settings: [
      {
        type: SettingType.boolean,
        name: "Bật giao hàng VNPost",
        key: SettingKey.DELIVERY_ENABLED_VNPOST,
        value: true,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.number,
        name: "Phí ship nhận hàng tại chi nhánh",
        key: SettingKey.DELIVERY_POST_FEE,
        value: 0,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.number,
        name: "Phí ship đặt hàng mặc định",
        key: SettingKey.DELIVERY_ORDER_SHIP_FEE,
        value: 0,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.number,
        name: "Phí ship cố định giao hàng VNPost nội thành",
        key: SettingKey.DELIVERY_VNPOST_INNER_SHIP_FEE,
        value: 30000,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.boolean,
        name: "Bật tự động duyệt đơn khi giao hàng thành công",
        key: SettingKey.DELIVERY_ENABLED_AUTO_APPROVE_ORDER,
        value: true,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.string,
        name: `Dịch vụ chuyển phát mặc định ${DeliveryServices.map(
          (s) => s.code + "-" + s.name
        ).join("|")}`,
        key: SettingKey.VNPOST_DEFAULT_SHIP_SERVICE_METHOD_CODE,
        value: ServiceCode.BK,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      // DELIVERY_STATUS_CUSTOMER_ALERT = "DELIVERY_STATUS_CUSTOMER_ALERT",
      // DELIVERY_COMPLETED_MSG_FOR_CUSTOMER = "DELIVERY_COMPLETED_MSG_FOR_CUSTOMER",
      // DELIVERY_FAILURE_MSG_FOR_CUSTOMER = "DELIVERY_FAILURE_MSG_FOR_CUSTOMER",
      // DELIVERY_PENDING_MSG_FOR_CUSTOMER = "DELIVERY_PENDING_MSG_FOR_CUSTOMER",
      {
        type: SettingType.boolean,
        name: `Thông báo tình trạng vận đơn cho khách hàng`,
        key: SettingKey.DELIVERY_STATUS_CUSTOMER_ALERT,
        value: true,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.boolean,
        name: `Thông báo tình trạng vận đơn cho chủ shop`,
        key: SettingKey.DELIVERY_STATUS_MEMBER_ALERT,
        value: true,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo cho khách hàng khi đơn hàng đang giao",
        key: SettingKey.DELIVERY_PENDING_MSG_FOR_CUSTOMER,
        value: `[Thông báo tự động dành cho khách hàng]
Đơn hàng {{order.code}} đang được giao. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
Nếu bạn có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo cho khách hàng khi vận đơn thất bại",
        key: SettingKey.DELIVERY_FAILURE_MSG_FOR_CUSTOMER,
        value: `[Thông báo tự động dành cho khách hàng]
Đơn hàng {{order.code}} đã giao thất bại. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
Nếu bạn có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo cho khách hàng khi vận đơn thành công",
        key: SettingKey.DELIVERY_COMPLETED_MSG_FOR_CUSTOMER,
        value: `[Thông báo tự động dành cho khách hàng]
Đơn hàng {{order.code}} đã được giao thành công. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
Nếu bạn có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },

      ///
      // DELIVERY_COMPLETED_MSG_FOR_MEMBER = "DELIVERY_COMPLETED_MSG_FOR_MEMBER",
      // DELIVERY_FAILURE_MSG_FOR_MEMBER = "DELIVERY_FAILURE_MSG_FOR_MEMBER",
      // DELIVERY_PENDING_FOR_MEMBER = "DELIVERY_PENDING_FOR_MEMBER",

      {
        type: SettingType.richText,
        name: "Thông báo cho bưu cục khi đơn hàng đang giao",
        key: SettingKey.DELIVERY_PENDING_MSG_FOR_MEMBER,
        value: `[Thông báo tự động dành cho bưu cục]
Đơn hàng {{order.code}} đang được giao. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
Nếu bạn có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo cho bưu cục khi vận đơn thất bại",
        key: SettingKey.DELIVERY_FAILURE_MSG_FOR_MEMBER,
        value: `[Thông báo tự động dành cho bưu cục]
Đơn hàng {{order.code}} đã giao thất bại. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
Nếu bạn có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Thông báo cho bưu cục khi vận đơn thành công",
        key: SettingKey.DELIVERY_COMPLETED_MSG_FOR_MEMBER,
        value: `[Thông báo tự động dành cho bưu cục]
Đơn hàng {{order.code}} đã được giao thành công. Thông tin đơn hàng:
+ Danh sách sản phẩm: 
{{orderItems.map(i=>\`🛒\${i.productName} x \${i.qty}: \${$money(i.amount)}đ\`).join('\\n')}}
+ Tổng hóa đơn: {{$money(order.amount)}}đ
+ Thông tin khách hàng: {{order.buyerName}} - {{order.buyerPhone}}
+ Thông tin shop bán hàng: {{seller.shopName}}
Nếu bạn có thắc mắc vui lòng liên hệ vào số hotline 999 của Bưu điện thành phố Hồ Chí Minh để được hỗ trợ chi tiết.`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
    ],
  },
];
