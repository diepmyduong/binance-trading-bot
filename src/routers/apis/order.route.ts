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
import { IOrder, OrderStatus } from "../../graphql/modules/order/order.model";
import { OrderModel } from "../../graphql/modules/order/order.model";

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

    console.log('params',params);

    const order = await OrderModel.findOne(params);

    console.log('order',order);

    if (!order) {
      throw ErrorHelper.requestDataInvalid("Tham số đầu vào không hợp lệ!");
    }

    await OrderModel.findByIdAndUpdate(
      order.id,
      { status: OrderStatus.DELIVERING },
      { new: true }
    );

    const pdfContent = await getPDFSample(order);
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
    const pdfContent = await getPDFSample(null);
    return PrinterHelper.responsePDF(res, pdfContent, `don-hang-${order.code}`);
  }
}

export default new OrderRoute().router;

const getPDFSample = async (data: any) => {
  let dd = {
    content: [
      "First paragraph",
      "Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines",
    ],
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

const getTableContent = async (data: any) => {
  const contents: any[] = [];
  const fcAcsii = 65;
  for (let i = 0; i < data.categorys.length; i++) {
    const category = data.categorys[i];
    contents.push([
      {
        text: String.fromCharCode(fcAcsii + i),
        alignment: "center",
        fillColor: "#ff6626",
      },
      {
        text: category.name || " ",
        alignment: "left",
        colSpan: 5,
        fillColor: "#ff6626",
      },
      ..._.times(4, () => ""),
      { text: "VNĐ", alignment: "right", fillColor: "#ff6626" },
      {
        text: lintNum(category.amount) || 0,
        alignment: "right",
        fillColor: "#ff6626",
      },
    ]);
    const productsOfCategory = data.tables[category.id];
    for (let pr = 0; pr < productsOfCategory.length; pr++) {
      const product = productsOfCategory[pr];
      contents.push([
        { text: pr + 1, alignment: "center", fillColor: "#d9d9d9" },
        {
          text: _.get(product, "brand.name", " "),
          alignment: "left",
          fillColor: "#d9d9d9",
        },
        {
          text: product.name || " ",
          alignment: "center",
          fillColor: "#d9d9d9",
        },
        {
          text: product.madeIn || " ",
          alignment: "center",
          fillColor: "#d9d9d9",
        },
        {
          text: product.unit || " ",
          alignment: "center",
          fillColor: "#d9d9d9",
        },
        { text: product.qty || 0, alignment: "center", fillColor: "#d9d9d9" },
        {
          text: lintNum(product.price) || 0,
          alignment: "right",
          fillColor: "#d9d9d9",
        },
        {
          text: lintNum(product.amount) || 0,
          alignment: "right",
          fillColor: "#d9d9d9",
        },
      ]);
      if (product.overview) {
        contents.push([
          { text: " ", alignment: "center", fillColor: "#ffffff" },
          {
            text: product.overview || " ",
            alignment: "left",
            colSpan: 7,
            fillColor: "#ffffff",
          },
          ..._.times(6, () => ""),
        ]);
      }
    }
  }
  return contents;
};

const getBodyImage = async (data: any) => {
  let contents: any[] = [];
  for (const category of data.categorys) {
    const productsOfCategory = data.tables[category.id];
    for (let i = 0; i < productsOfCategory.length; i++) {
      const product = productsOfCategory[i];
      let spec: any[] = [];
      if (product.specs)
        for (let j = 0; j < product.specs.length; j++) {
          let specification = product.specs[j];
          spec.push([
            { text: specification.label || " " },
            { text: specification.value || " " },
          ]);
        }

      // const dataImage = await imagedatauri.encodeFromURL(
      //   product.thumb || "https://placehold.it/500"
      // );
      contents.push({ text: " " });
      contents.push({
        text: i + 1,
        fontSize: 13,
        alignment: "right",
        bold: true,
      });
      contents.push({
        table: {
          widths: ["100%"],
          body: [
            [
              {
                columns: [
                  {
                    // stack: [
                    //   { image: dataImage, width: 300, alignment: "center" },
                    // ],
                    width: "65%",
                  },
                  {
                    stack: [
                      {
                        text: product.name,
                        alignment: "left",
                        color: "#fc5f20",
                        bold: true,
                        fontSize: 15,
                      },
                      {
                        text: product.overview,
                        alignment: "left",
                        bold: true,
                        italics: true,
                      },
                      " ",
                      { text: "Thông số kỹ thuật", color: "#fc5f20" },
                      {
                        table: {
                          widths: ["50%", "50%"],
                          body: _.isEmpty(spec) ? [[]] : spec,
                        },
                        layout: {
                          hLineColor: function (row: any, col: any, node: any) {
                            return "#ffffff";
                          },
                          vLineColor: function (row: any, col: any, node: any) {
                            return "#ffffff";
                          },
                          fillColor: function (row: any, col: any, node: any) {
                            return row > 0 && row % 2 ? null : "#f3f4f5";
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          ],
          dontBreakRows: true,
        },
      });
    }
  }

  return contents;
};
