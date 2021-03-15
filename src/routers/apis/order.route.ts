import { ROLES } from "../../constants/role.const";
import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { Context } from "../../graphql/context";

import { auth } from "../../middleware/auth";

import _, { reverse, sortBy } from "lodash";
import numeral from "numeral";
import path from "path";
import { PrinterHelper } from "../../helpers/printerHelper";
import {
  getShipMethods,
  IOrder,
  OrderStatus,
  ShipMethod,
} from "../../graphql/modules/order/order.model";
import { OrderModel } from "../../graphql/modules/order/order.model";
import { OrderItemModel } from "../../graphql/modules/orderItem/orderItem.model";
import { AddressDeliveryModel } from "../../graphql/modules/addressDelivery/addressDelivery.model";
import { MemberModel } from "../../graphql/modules/member/member.model";

class OrderRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get(
      "/exportOrderToPdf",
      [auth],
      this.route(this.exportOrderToPdf)
    );
    this.router.get(
      "/exportToMemberOrderToPdf",
      [auth],
      this.route(this.exportToMemberOrderToPdf)
    );
  }

  async exportOrderToPdf(req: Request, res: Response) {
    const context = (req as any).context as Context;

    context.auth([ROLES.MEMBER]);
    const orderId = req.query.orderId;

    // console.log("orderId", orderId);

    let params: any = {
      _id: orderId,
      status: {
        $in: [OrderStatus.CONFIRMED, OrderStatus.DELIVERING],
      },
    };

    if (context.isMember()) {
      params.sellerId = context.id;
    }

    // console.log("params", params);

    const order = await OrderModel.findOne(params);

    // console.log("order", order);

    if (!order) {
      throw ErrorHelper.requestDataInvalid("Tham số đầu vào không hợp lệ!");
    }

    await OrderModel.findByIdAndUpdate(
      order.id,
      { status: OrderStatus.DELIVERING },
      { new: true }
    );

    const addressDelivery = await AddressDeliveryModel.findById(
      order.addressDeliveryId
    );
    const member = await MemberModel.findById(order.sellerId);

    const pdfContent = await getPDFOrder(order, addressDelivery, member);
    return PrinterHelper.responsePDF(res, pdfContent, `don-hang-${order.code}`);
  }

  async exportToMemberOrderToPdf(req: Request, res: Response) {
    const context = (req as any).context as Context;
    const orderId = req.query.orderId;

    let params: any = {
      _id: orderId,
      status: {
        $in: [OrderStatus.CONFIRMED, OrderStatus.DELIVERING],
      },
    };

    if (context.isMember()) {
      params.toMemberId = context.id;
    }

    const order = await OrderModel.findOne(params);

    if (!order) {
      throw ErrorHelper.requestDataInvalid("Tham số đầu vào không hợp lệ!");
    }

    await OrderModel.findByIdAndUpdate(
      order.id,
      { status: OrderStatus.DELIVERING },
      { new: true }
    );
    const addressDelivery = await AddressDeliveryModel.findById(
      order.addressDeliveryId
    );
    const member = await MemberModel.findById(order.sellerId);

    const pdfContent = await getPDFOrder(order, addressDelivery, member);
    return PrinterHelper.responsePDF(res, pdfContent, `don-hang-${order.code}`);
  }
}

export default new OrderRoute().router;

const getPDFOrder = async (data: IOrder, addressDelivery: any, member: any) => {
  const PHIEU_XUAT_KHO = {
    text: "Phiếu xuất kho",
    color: "#333333",
    width: "*",
    fontSize: 28,
    bold: true,
    alignment: "right",
    margin: [0, 0, 0, 15],
  };

  const MA_DON = {
    columns: [
      {
        text: "Mã đơn",
        color: "#aaaaab",
        bold: true,
        width: "*",
        fontSize: 12,
        alignment: "right",
      },
      {
        text: data.code,
        bold: true,
        color: "#333333",
        fontSize: 12,
        alignment: "right",
        width: 100,
      },
    ],
  };

  const NGAY_TAO = {
    columns: [
      {
        text: "Ngày tạo",
        color: "#aaaaab",
        bold: true,
        width: "*",
        fontSize: 12,
        alignment: "right",
      },
      {
        text: data.createdAt.toISOString().split(/T/)[0],
        bold: true,
        color: "#333333",
        fontSize: 12,
        alignment: "right",
        width: 100,
      },
    ],
  };
  const TINH_TRANG = {
    columns: [
      {
        text: "Status",
        color: "#aaaaab",
        bold: true,
        fontSize: 12,
        alignment: "right",
        width: "*",
      },
      {
        text: "PAID",
        bold: true,
        fontSize: 14,
        alignment: "right",
        color: "green",
        width: 100,
      },
    ],
  };
  const KHACH_HANG = {
    columns: [
      {
        text: "Khách hàng",
        color: "#aaaaab",
        bold: true,
        fontSize: 14,
        alignment: "left",
        margin: [0, 20, 0, 5],
      },
      {
        text: data.buyerName,
        bold: true,
        color: "#333333",
        margin: [0, 20, 0, 5],
        alignment: "left",
      },
    ],
  };

  const CUA_HANG = {
    columns: [
      {
        text: "Bưu cục",
        color: "#aaaaab",
        bold: true,
        fontSize: 14,
        alignment: "left",
        margin: [0, 0, 0, 5],
      },
      {
        text: member.shopName,
        bold: true,
        color: "#333333",
        margin: [0, 0, 0, 5],
        alignment: "left",
      },
    ],
  }

  const DIA_CHI_CUA_HANG = {
    columns: [
      {
        text: "Cửa hàng",
        color: "#aaaaab",
        bold: true,
        fontSize: 14,
        alignment: "left",
        margin: [0, 0, 0, 5],
      },
      {
        text: member.shopName,
        bold: true,
        color: "#333333",
        margin: [0, 0, 0, 5],
        alignment: "left",
      },
    ],
  }

  const LOAI_DON__DIEM_THUONG = [
    {
      columns: [
        {
          text: "Loại đơn",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
        {
          text: "Điểm thưởng người bán",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
        {
          text: "Điểm thưởng người mua",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
      ],
    },
    {
      columns: [
        {
          text: "Đơn cửa hàng",
          alignment: "left",
        },
        {
          text: data.sellerBonusPoint.toString() + " VND",
          alignment: "left",
        },
        {
          text: data.buyerBonusPoint.toString() + " VND",
          alignment: "left",
        },
      ],
    }
  ]

  const HOA_HONG = [
    {
      columns: [
        {
          text: "Hoa hồng điểm bán",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
        {
          text: "Hoa hồng cộng tác viên",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
        {
          text: "Hoa hồng kho",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
      ],
    },
    {
      columns: [
        {
          text: data.commission1.toString() + " VND",
          alignment: "left",
        },
        {
          text: data.commission2.toString() + " VND",
          alignment: "left",
        },
        {
          text: data.commission3.toString() + " VND",
          alignment: "left",
        },
      ],
    }
  ];

  const PHUONG_THUC_GIAO_HANG = [
    {
      columns: [
        {
          text: "Phương thức giao hàng",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
        {
          text: "Mã vận đơn",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
      ],
    },
    {
      columns: [
        {
          text:
            ShipMethod.POST === data.shipMethod
              ? "Nhận hàng tại địa chỉ"
              : "Giao hàng tại địa chỉ",
          alignment: "left",
        },
        {
          text: data.deliveryInfo ? data.deliveryInfo.itemCode : "[Không có]",
          alignment: "left",
        },
      ],
    },
  ];

  const DIA_DIEM_GIAO_NHAN = ShipMethod.POST === data.shipMethod ? [
    {
      columns: [
        {
          text: "Tên điểm nhận",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
        {
          text: "SĐT điểm nhận",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
        {
          text: "Địa chỉ điểm nhận",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
      ],
    },
    {
      columns: [
        {
          text: addressDelivery.name,
          alignment: "left",
        },
        {
          text: addressDelivery.phone,
          alignment: "left",
        },
        {
          text: addressDelivery.address,
          alignment: "left",
        },
      ],
    },
  ]:[
    {
      columns: [
        {
          text: "Địa chỉ giao",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
        {
          text: "SĐT khách hàng",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
      ],
    },
    {
      columns: [
        {
          text: `${data.buyerAddress} - ${data.buyerWard} -  ${data.buyerDistrict} -  ${data.buyerProvince}`,
          alignment: "left",
        },
        {
          text: data.buyerPhone,
          alignment: "left",
        },
      ],
    },
  ];

  const GHI_CHU = {
    columns: [
      {
        text: "Ghi chú",
        bold: true,
        fontSize: 14,
        alignment: "left",
        margin: [0, 0, 0, 5],
      },
      {
        text: "Không có",
        margin: [0, 0, 0, 5],
        alignment: "left",
      },
    ],
  }

  const DANH_SACH_SAN_PHAM = [{
    width: "100%",
    alignment: "center",
    text: "Danh sách sản phẩm",
    bold: true,
    margin: [0, 10, 0, 10],
    fontSize: 15,
  },
  " ",{
    table: {
      widths: ["5%", "40%", "10%", "20%", "20%"],
      body: [
        [
          { text: "STT", alignment: "center" },
          { text: "Tên hàng", alignment: "center" },
          { text: "Số lượng", alignment: "center" },
          { text: "Đơn giá", alignment: "center" },
          { text: "Thành tiền", alignment: "center" },
        ],
        ...(await getTableContent(data.itemIds)),
      ],
    },
  }];

  const TIEN_HANG = {
    columns: [
      {
        text: "",
        alignment: "left",
        margin: [0, 0, 0, 5],
      },
      {
        text: "Tiền hàng:",
        bold: true,
        fontSize: 14,
        margin: [0, 0, 0, 5],
        alignment: "left",
      },
      {
        text: data.subtotal.toString() + " VND",
        margin: [0, 0, 0, 5],
        alignment: "right",
      },
    ],
  };

  const PHI_GIAO_HANG = {
    columns: [
      {
        text: "",
        alignment: "left",
        margin: [0, 0, 0, 5],
      },
      {
        text: "Phí giao hàng:",
        bold: true,
        fontSize: 14,
        margin: [0, 0, 0, 5],
        alignment: "left",
      },
      {
        text: data.shipfee.toString() + " VND",
        margin: [0, 0, 0, 5],
        alignment: "right",
      },
    ],
  }

  const TONG_CONG = {
    columns: [
      {
        text: "",
        alignment: "left",
        margin: [0, 0, 0, 5],
      },
      {
        text: "Tổng cộng:",
        bold: true,
        fontSize: 14,
        margin: [0, 0, 0, 5],
        alignment: "left",
      },
      {
        text: data.subtotal.toString() + " VND",
        margin: [0, 0, 0, 5],
        alignment: "right",
      },
    ],
  };

  const CHU_KY = {
    columns: [
      {
        text: "Trưởng bưu cục",
        bold: true,
        fontSize: 14,
        alignment: "left",
        margin: [0, 0, 0, 5],
      },
      {
        text: "Nhân viên giao",
        bold: true,
        margin: [0, 0, 0, 5],
        alignment: "center",
      },
      {
        text: "Người nhận hàng",
        bold: true,
        margin: [0, 0, 0, 5],
        alignment: "right",
      },
    ],
  };

  const styles = {
    styles: {
      notesTitle: {
        fontSize: 10,
        bold: true,
        margin: [0, 50, 0, 3],
      },
      notesText: {
        fontSize: 10,
      },
    },
    defaultStyle: {
      columnGap: 20,
    },
  }

  var dd = {
    content: [
      {
        columns: [
          {
            image: imageContent,
            width: 150,
          },
          [
            PHIEU_XUAT_KHO,
            {
              stack: [
                MA_DON,
                NGAY_TAO,
                // TINH_TRANG,
              ],
            },
          ],
        ],
      },
      KHACH_HANG,
      CUA_HANG,
      // DIA_CHI_CUA_HANG,
      ...LOAI_DON__DIEM_THUONG,
      ...HOA_HONG,
      ...PHUONG_THUC_GIAO_HANG,
      ...DIA_DIEM_GIAO_NHAN,
      GHI_CHU,
      DANH_SACH_SAN_PHAM,
      "\n",
      TIEN_HANG,
      PHI_GIAO_HANG,
      TONG_CONG,
      "\n",
      CHU_KY,
    ],
    ...styles
  };

  return dd;
};

const getTableContent = async (items: any) => {
  const data = await OrderItemModel.find({ _id: { $in: items } });

  // console.log("data",data);
  const contents: any[] = [];
  const fcAcsii = 65;
  for (let pr = 0; pr < data.length; pr++) {
    const product = data[pr];
    contents.push([
      { text: pr + 1, alignment: "center", fillColor: "#d9d9d9" }, //No
      {
        text: product.productName || " ",
        alignment: "center",
        fillColor: "#d9d9d9",
      }, //Model
      { text: product.qty || 0, alignment: "center", fillColor: "#d9d9d9" }, //SL
      {
        text: product.basePrice || 0,
        alignment: "right",
        fillColor: "#d9d9d9",
      }, //ĐƠN GIÁ
      {
        text: product.amount || 0,
        alignment: "right",
        fillColor: "#d9d9d9",
      }, //THÀNH TIỀN
    ]);
  }
  return contents;
};

const imageContent =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABQ4AAARoCAMAAABzI7n1AAAC6FBMVEUAAAAdNmz90o37+fbFzdrz7+nGztpVaJBVaJD7vFP08ez7043Gzdr+8NmNm7X90o2PmrYcN2r+6sjS2OKOm7b8041UaJL8tkX/6cX80oz93qlxgqP8sTY4T3/8zX+Pm7bGzdn8w2H93qr9x2+Om7VjdZq5wND80oz+6sfy6duqtcgrQnWOm7b8sTj95LhGXIa5wdIpQ3Q5T339wl/5sjWOmrX92Zr947V/jqz7vFWcqL/93aj92ZsaOGz9zX1ygaL+x238042rs8artMf6t0X85LlGXIn7vFH8yHB/jq390oz8vFNhdZz+47ZIW4Zwg6Wcp7/8tkL8zoBHXIidp738yHGOm7VWaJFVaZP9zHz+7tH+wmL915f6t0I4TnyqtMmNm7XCydd/jquOm7X+2Jn+15f+47f8sDNkdJhVaJD8040qQ3j6wmWTn7lkdp792p3////98dr+zX39tkT+u1H90If+wmB/j62Om7YdNmz+wl///v/5+vz////////Bx9f+x27+xm6VorvFzdn////+yHT////////+x25XaZL+/v6RnLf/////2Zz///////+Pm7b/4rMdNmxVaJD/2Jv/15cdN2wdNmwdN2z/1piyucxxgqP/zX4dNmzBydb////5ryr/1ZP6u1AdNmx4iKYdNmyhrcMdNmwdNmzGzdq/xtUdNmwdNmyptMb+zYDy8/X5phodNmz7pRr5phgeN237phcdN2ocNm4dOG35phwdOGv4pxkcOGr6pxv7pRz9phseN2/6px34pRj7ph76pxn9pxkcNWsfNmodOG/5qBsfNW79pRf6pRYbNmn4pxYeNmgbNmsaOGwaOGlVTGX4pRv///+ifm76qyfbnVL9ph4aOG4rQnT6rCodNnD6qyT7pBb6qBf8qydBQ2j3rSb9pRotPGv0pSfNk1UrQnHsozn7qB52X2iIbGi+jGTfnEVVaJClfGRhUWO2hl2VcmXU2eJhdptfUmfdnlQKhc+BAAAAsHRSTlMA/pIBEAQO8e/vAnURCYp5bf4QCWls7vgTgjrI/fylcBPfNsyD3ySHDwc0/n39IPcg/vzj/XNcIqztVz9W/qrMz306OPcd9/HJqI3w3Cb4xVH6ofVcxHjv664N4V/4/S+hF7GPYWUv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";
