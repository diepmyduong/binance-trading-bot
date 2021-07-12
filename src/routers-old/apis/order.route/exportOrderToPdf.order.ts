import { ROLES } from "../../../constants/role.const";
import { BaseRoute, Request, Response, NextFunction } from "../../../base/baseRoute";
import { ErrorHelper } from "../../../base/error";
import { Context } from "../../../graphql/context";

import _ from "lodash";
import numeral from "numeral";
import { PrinterHelper } from "../../../helpers/printerHelper";
import { ShipMethod } from "../../../graphql/modules/order/order.model";
import { OrderModel } from "../../../graphql/modules/order/order.model";
import { OrderItemModel } from "../../../graphql/modules/orderItem/orderItem.model";
import { AddressDeliveryModel } from "../../../graphql/modules/addressDelivery/addressDelivery.model";
import { MemberModel } from "../../../graphql/modules/member/member.model";
import { SettingHelper } from "../../../graphql/modules/setting/setting.helper";
import { SettingKey } from "../../../configs/settingData";
import { createCanvas, loadImage } from "canvas";

export const exportOrderToPdf = async (req: Request, res: Response) => {
  const context = (req as any).context as Context;

  context.auth([ROLES.MEMBER]);
  const orderId = req.query.orderId;

  // console.log("orderId", orderId);

  let params: any = {
    _id: orderId,
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

  const addressDelivery = await AddressDeliveryModel.findById(order.addressDeliveryId);
  const member = await MemberModel.findById(order.sellerId);
  const logoImageUrl = await SettingHelper.load(SettingKey.LOGO);

  const pdfContent = await getPDFOrder({ order, addressDelivery, member, logoImageUrl });
  return PrinterHelper.responsePDF(res, pdfContent, `don-hang-${order.code}`);
};

const getBase64ImageFromURL = async (url: string) => {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext("2d");
  const image = await loadImage(url);
  ctx.drawImage(image, 0, 0, 300, 300);
  return ctx.canvas.toDataURL();
};

const getPDFOrder = async ({ order, addressDelivery, member, logoImageUrl }: any) => {
  const imgBase64 = await getBase64ImageFromURL(logoImageUrl);

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
        text: order.code,
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
        text: order.createdAt.toISOString().split(/T/)[0],
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
        text: order.buyerName,
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
          text: moneyCast(order.sellerBonusPoint),
          alignment: "left",
        },
        {
          text: moneyCast(order.buyerBonusPoint),
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
          text: moneyCast(order.commission1),
          alignment: "left",
        },
        {
          text: moneyCast(order.commission2),
          alignment: "left",
        },
        {
          text: moneyCast(order.commission3),
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
            ShipMethod.POST === order.shipMethod
              ? "Nhận hàng tại cửa hàng"
              : "Giao hàng tại địa chỉ",
          alignment: "left",
        },
        {
          text: order.deliveryInfo ? order.deliveryInfo.itemCode : "[Không có]",
          alignment: "left",
        },
      ],
    },
  ];

  const DIA_DIEM_GIAO_NHAN =
    ShipMethod.POST === order.shipMethod
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
                text: `${order.buyerAddress} - ${order.buyerWard} -  ${order.buyerDistrict} -  ${order.buyerProvince}`,
                alignment: "left",
              },
              {
                text: order.buyerPhone,
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
          ...(await getTableContent(order.itemIds)),
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
        text: moneyCast(order.subtotal),
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
        text: moneyCast(order.shipfee),
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
        text: moneyCast(order.amount),
        margin: [0, 0, 0, 5],
        alignment: "right",
      },
    ],
  };

  const CHU_KY = {
    columns: [
      {
        text: "Trưởng cửa hàng",
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

  const LOGO = {
    image: imgBase64,
    width: 150,
  };

  var dd = {
    content: [
      {
        columns: [
          LOGO,
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
      // ...LOAI_DON__DIEM_THUONG,
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
  return `${value ? `${numeral(value).format("0.0")} VND` : ""}`;
};
