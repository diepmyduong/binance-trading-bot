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
import { getShipMethods, IOrder, OrderStatus, ShipMethod } from "../../graphql/modules/order/order.model";
import { OrderModel } from "../../graphql/modules/order/order.model";
import { OrderItemModel } from "../../graphql/modules/orderItem/orderItem.model";

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

    console.log("params", params);

    const order = await OrderModel.findOne(params);

    console.log("order", order);

    if (!order) {
      throw ErrorHelper.requestDataInvalid("Tham số đầu vào không hợp lệ!");
    }

    await OrderModel.findByIdAndUpdate(
      order.id,
      { status: OrderStatus.DELIVERING },
      { new: true }
    );

    const pdfContent = await getPDFOrder(order);
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
    const pdfContent = await getPDFOrder(order);
    return PrinterHelper.responsePDF(res, pdfContent, `don-hang-${order.code}`);
  }
}

export default new OrderRoute().router;

const getPDFOrder = async (data: IOrder) => {
  var dd = {
    content: [
      {
        columns: [
          {
            image:
              "data:image/jpeg;base64,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",
            width: 150,
          },
          [
            {
              text: "Đơn hàng",
              color: "#333333",
              width: "*",
              fontSize: 28,
              bold: true,
              alignment: "right",
              margin: [0, 0, 0, 15],
            },
            {
              stack: [
                {
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
                },
                {
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
                      text: data.createdAt,
                      bold: true,
                      color: "#333333",
                      fontSize: 12,
                      alignment: "right",
                      width: 100,
                    },
                  ],
                },
                // {
                //   columns: [
                //     {
                //       text: "Status",
                //       color: "#aaaaab",
                //       bold: true,
                //       fontSize: 12,
                //       alignment: "right",
                //       width: "*",
                //     },
                //     {
                //       text: "PAID",
                //       bold: true,
                //       fontSize: 14,
                //       alignment: "right",
                //       color: "green",
                //       width: 100,
                //     },
                //   ],
                // },
              ],
            },
          ],
        ],
      },
      {
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
      },
      {
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
            text: data.sellerId,
            bold: true,
            color: "#333333",
            margin: [0, 0, 0, 5],
            alignment: "left",
          },
        ],
      },
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
            text: data.sellerBonusPoint.toString() + "VND",
            alignment: "left",
          },
          {
            text: data.buyerBonusPoint.toString() + "VND",
            alignment: "left",
          },
        ],
      },
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
            text: data.commission1.toString() + "VND",
            alignment: "left",
          },
          {
            text: data.commission2.toString() + "VND",
            alignment: "left",
          },
          {
            text: data.commission3.toString() + "VND",
            alignment: "left",
          },
        ],
      },

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
            text: ShipMethod.POST === data.shipMethod ? "Nhận hàng tại địa chỉ" : "Giao hàng tại địa chỉ",
            alignment: "left",
          },
          {
            text: data.deliveryInfo ? data.deliveryInfo.itemCode : "[Không có]" ,
            alignment: "left",
          },
        ],
      },
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
            text: "Bưu cục Kiểm thử 2",
            alignment: "left",
          },
          {
            text: "02838249479",
            alignment: "left",
          },
          {
            text:
              "Sô´230, Đường Hai Bà Trưng, Phường Bến Nghé, Quận 1 , Bến Nghé , Quận 1 , Hồ Chí Minh",
            alignment: "left",
          },
        ],
      },
      {
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
      },
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
            widths: ["5%", "30%", "14%",  "12%", "12%"],
            body: [
              [
                { text: "No.", alignment: "center" },
                { text: "Model", alignment: "center" },
                { text: "SL", alignment: "center" },
                { text: "ĐƠN GIÁ", alignment: "center" },
                { text: "THÀNH TIỀN", alignment: "center" },
              ],
              ...(await getTableContent(data.itemIds)),
            ],
          }
      },
      "\n",
      
    ],
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
      //font: 'Quicksand',
    },
  };

  return dd;
};
const lintNumber = async (value: any, style: any) => {
  return {
    text: `${value ? numeral(value).format("0,0") : " "}`,
    style: style,
  };
};
const lintNum = async (value: any) => {
  return `${value ? numeral(value).format("0,0") : " "}`;
};

const getTableContent = async (items: any) => {

  const data = await OrderItemModel.find({ _id: {$in:items} });

  console.log("data",data);

  const contents: any[] = [];
  const fcAcsii = 65;
  for (let pr = 0; pr < data.length; pr++) {
    const product = data[pr];
    contents.push([
      { text: pr + 1, alignment: "center", fillColor: "#d9d9d9" },
      {
        text: product.productName || " ",
        alignment: "center",
        fillColor: "#d9d9d9",
      },
      {
        text: lintNum(product.basePrice) || 0,
        alignment: "right",
        fillColor: "#d9d9d9",
      },
      { text: product.qty || 0, alignment: "center", fillColor: "#d9d9d9" },
      {
        text: lintNum(product.amount) || 0,
        alignment: "right",
        fillColor: "#d9d9d9",
      }
    ]);
  };
  return contents;
};
