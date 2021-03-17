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
  // getShipMethods,
  IOrder,
  OrderStatus,
  ShipMethod,
} from "../../graphql/modules/order/order.model";
import { OrderModel } from "../../graphql/modules/order/order.model";
import { OrderItemModel } from "../../graphql/modules/orderItem/orderItem.model";
import { AddressDeliveryModel } from "../../graphql/modules/addressDelivery/addressDelivery.model";
import { MemberModel } from "../../graphql/modules/member/member.model";
import { LOGO_IMAGE_CONTENT } from "../../constants/resouce.const";

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
  };

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
  };

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
          text: moneyCast(data.sellerBonusPoint),
          alignment: "left",
        },
        {
          text: moneyCast(data.buyerBonusPoint),
          alignment: "left",
        },
      ],
    },
  ];

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
          text: moneyCast(data.commission1),
          alignment: "left",
        },
        {
          text: moneyCast(data.commission2),
          alignment: "left",
        },
        {
          text: moneyCast(data.commission3),
          alignment: "left",
        },
      ],
    },
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

  const DIA_DIEM_GIAO_NHAN =
    ShipMethod.POST === data.shipMethod
      ? [
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
        ]
      : [
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
  };

  const DANH_SACH_SAN_PHAM = [
    {
      width: "100%",
      alignment: "center",
      text: "Danh sách sản phẩm",
      bold: true,
      margin: [0, 10, 0, 10],
      fontSize: 15,
    },
    " ",
    {
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
    },
  ];

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
        text: moneyCast(data.subtotal),
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
        text: moneyCast(data.shipfee),
        margin: [0, 0, 0, 5],
        alignment: "right",
      },
    ],
  };

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
        text: moneyCast(data.subtotal),
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
  };

  var dd = {
    content: [
      {
        columns: [
          {
            image: LOGO_IMAGE_CONTENT,
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
      // ...HOA_HONG,
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
    ...styles,
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

const moneyCast = (value: any) => {
  return `${value ? `${numeral(value).format("0.0")} VND`: ""}`;
};
