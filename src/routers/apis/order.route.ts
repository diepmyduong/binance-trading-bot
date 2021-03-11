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
      this.route(this.exportOrderToPdf)
    );
  }

  async exportOrderToPdf(req: Request, res: Response) {
    const context = (req as any).context as Context;

    context.auth([ROLES.MEMBER]);
    const orderId = req.query.orderId;

    console.log("orderId", orderId);

    res.sendStatus(200);
  }

  async exportToMemberOrderToPdf(req: Request, res: Response) {
    const context = (req as any).context as Context;

    res.sendStatus(200);
  }
}

export default new OrderRoute().router;

const getPDFContent = async (data: any) => {
  let dd = {
    content: [
      {
        table: {
          widths: ["50%", "50%"],
          body: [
            [
              {
                image: path.join(
                  __dirname,
                  "../../../views/public/imagePDF/image001.png"
                ),
                alignment: "left",
                width: 150,
              },
              {
                image: path.join(
                  __dirname,
                  "../../../views/public/imagePDF/image007.png"
                ),
                alignment: "right",
                width: 150,
              },
            ],
          ],
        },
        fillColor: "#ffffff",
        layout: "noBorders",
      },
      {
        columns: [
          {
            stack: [
              { text: "PROSOUND CENTER VIETNAM  CO. LTD.", bold: true },
              { text: "730/16 Huỳnh Tấn Phát, P. Tân Phú, Quận 7" },
              { text: "Tp. Hồ Chí Minh - Việt Nam" },
              { text: "Tel: (028) 3662 0048  Email: info@prosoundcenter.vn" },
            ],
          },
          {
            stack: [
              " ",
              {
                table: {
                  widths: ["60%", "40%"],
                  body: [
                    [
                      { text: "Số báo giá: ", alignment: "right" },
                      {
                        text: data.quotation.code || " ",
                        alignment: "right",
                        bold: true,
                      },
                    ],
                    [
                      { text: "Ngày: ", alignment: "right" },
                      {
                        text: data.quotation.createdDate || " ",
                        alignment: "right",
                        bold: true,
                      },
                    ],
                  ],
                },
                fillColor: "#ffffff",
                layout: "noBorders",
              },
            ],
          },
        ],
      },
      " ",
      {
        columns: [
          {
            width: "70%",
            table: {
              widths: ["100%"],
              body: [
                [
                  {
                    stack: [
                      {
                        text: `Khách hàng:  ${
                          data.quotation.customerName || " "
                        }`,
                        bold: true,
                      },
                      {
                        table: {
                          body: [
                            [
                              { text: "Đơn vị:" },
                              {
                                text: data.quotation.customerCompanyName || " ",
                                bold: true,
                              },
                            ],
                          ],
                        },
                        layout: "noBorders",
                      },
                      {
                        text: `Địa chỉ:  ${
                          data.quotation.customerAddress || " "
                        } `,
                      },
                      {
                        text: `Tel:  ${data.quotation.customerPhone || " "}`,
                      },
                      {
                        text: `Email:  ${data.quotation.customerEmail || " "}`,
                      },
                    ],
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ["100%"],
              body: [
                [
                  {
                    stack: [
                      {
                        text: "TỔNG CỘNG",
                        bold: true,
                        alignment: "center",
                        decoration: "underline",
                      },
                      { text: " " },
                      {
                        columns: [
                          { text: "VND", alignment: "left" },
                          {
                            text: lintNum(data.quotation.amount),
                            alignment: "right",
                          },
                        ],
                        fontSize: 10,
                        bold: true,
                      },
                      {
                        text: "Giá đã bao gồm 10% VAT",
                        alignment: "center",
                        italics: true,
                        fontSize: 7,
                      },
                      {
                        text: "Có giá trị trong vòng 30 ngày",
                        alignment: "center",
                        italics: true,
                        fontSize: 7,
                      },
                    ],
                  },
                ],
              ],
            },
            fillColor: "#f2f2f2",
          },
        ],
      },
      " ",
      {
        table: {
          widths: ["5%", "*", "15%", "14%", "10%", "5%", "12%", "12%"],
          body: [
            [
              { text: "No.", alignment: "center" },
              { text: "Thương hiệu ", alignment: "center" },
              { text: "Model", alignment: "center" },
              { text: "Nguồn gốc/ NSX", alignment: "center" },
              { text: "ĐVT", alignment: "center" },
              { text: "SL", alignment: "center" },
              { text: "ĐƠN GIÁ", alignment: "center" },
              { text: "THÀNH TIỀN", alignment: "center" },
            ],
            ...(await getTableContent(data)),
          ],
        },
        fillColor: "#a6a6a6",
        bold: true,
        layout: {
          hLineColor: function (i: any, node: any) {
            return i === 0 || i === node.table.body.length
              ? "#a6a6a6"
              : "#a6a6a6";
          },
          vLineColor: function (i: any, node: any) {
            return i === 0 || i === node.table.widths.length
              ? "#a6a6a6"
              : "#a6a6a6";
          },
        },
      },
      {
        table: {
          widths: ["70%", "30%"],
          body: [
            [
              {
                columns: [
                  { width: "5%", text: "" },
                  {
                    width: "45%",
                    stack: [
                      { text: "ĐIỀU KIỆN THƯƠNG MẠI", bold: true },
                      " ",
                      { text: "Thời gian giao hàng:", bold: true },
                      { text: " 7-20 ngày tính từ ngày đặt hàng" },
                      " ",
                      { text: "Phương thức thanh toán:", bold: true },
                      { text: "+ Đặt cọc: 30% ngay sau khi ký hợp đồng" },
                      { text: "+ Thanh toán: 40% sau khi nhận hàng" },
                      { text: "+ Thanh toán: 30% sau khi bàn giao" },
                    ],
                  },
                  {
                    width: "45%",
                    stack: [
                      " ",
                      " ",
                      { text: "Bảo hành: ", bold: true },
                      { text: "12 tháng theo tiêu chuẩn nhà sản xuất " },
                    ],
                  },
                ],
              },
              {
                columns: [
                  {
                    stack:
                      data.quotation.discount > 0
                        ? [
                            { text: "THÀNH TIỀN", bold: true },
                            { text: " ", fontSize: 4 },
                            { text: "Giảm giá" },
                            { text: " ", fontSize: 4 },
                            { text: "Còn lại", bold: true },
                            { text: " ", fontSize: 4 },
                            { text: "THUẾ VAT 10%" },
                            { text: " ", fontSize: 4 },
                            { text: "TỔNG CỘNG", bold: true },
                          ]
                        : [
                            { text: "THÀNH TIỀN", bold: true },
                            { text: " ", fontSize: 4 },
                            { text: "THUẾ VAT 10%" },
                            { text: " ", fontSize: 4 },
                            { text: "TỔNG CỘNG", bold: true },
                          ],
                    alignment: "center",
                  },
                  {
                    stack:
                      data.quotation.discount > 0
                        ? [
                            {
                              text: lintNum(data.quotation.subTotal) || 0,
                              alignment: "right",
                              bold: true,
                            },
                            { text: " ", fontSize: 4 },
                            {
                              text: `(${
                                lintNum(data.quotation.discount) || 0
                              })`,
                              alignment: "right",
                            },
                            {
                              text: "_______________________________",
                              fontSize: 4,
                              alignment: "right",
                            },
                            {
                              text: lintNum(
                                data.quotation.subTotal -
                                  data.quotation.discount
                              ),
                              alignment: "right",
                              bold: true,
                            },
                            { text: " ", fontSize: 4 },
                            {
                              text: lintNum(data.quotation.vatAmount) || 0,
                              alignment: "right",
                            },
                            {
                              text: "_______________________________",
                              fontSize: 4,
                              alignment: "right",
                            },
                            {
                              text: lintNum(data.quotation.amount) || 0,
                              alignment: "right",
                              bold: true,
                            },
                          ]
                        : [
                            {
                              text: lintNum(data.quotation.subTotal) || 0,
                              alignment: "right",
                              bold: true,
                            },
                            { text: " ", fontSize: 4 },
                            {
                              text: lintNum(data.quotation.vatAmount) || 0,
                              alignment: "right",
                            },
                            {
                              text: "_______________________________",
                              fontSize: 4,
                              alignment: "right",
                            },
                            {
                              text: lintNum(data.quotation.amount) || 0,
                              alignment: "right",
                              bold: true,
                            },
                          ],
                  },
                ],
                fillColor: "#bfbfbf",
              },
            ],
          ],
        },
      },
      { text: " " },
      {
        columns: [
          {
            width: "45%",
            stack: [
              { text: "XÁC NHẬN CỦA KHÁCH HÀNG", alignment: "center" },
              {
                table: { widths: ["*"], body: [[""], [""]] },
                layout: {
                  hLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 0 : 1;
                  },
                  vLineWidth: function (i: any, node: any) {
                    return 0;
                  },
                  paddingRight: function (i: any, node: any) {
                    return i === node.table.widths.length - 1 ? 100 : 8;
                  },
                },
              },
            ],
          },
          {},
          {
            width: "50%",
            stack: [
              {
                text: "PROSOUND CENTER VIETNAM CO. LTD.",
                alignment: "center",
              },
              {
                table: { widths: ["*"], body: [[""], [""]] },
                layout: {
                  hLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 0 : 1;
                  },
                  vLineWidth: function (i: any, node: any) {
                    return 0;
                  },
                  paddingRight: function (i: any, node: any) {
                    return i === node.table.widths.length - 1 ? 100 : 8;
                  },
                },
              },
              {
                text: "Người đại diện",
                alignment: "center",
                pageBreak: "after",
              },
            ],
          },
        ],
      },
      {
        table: {
          widths: ["50%", "50%"],
          body: [
            [
              {
                image: path.join(
                  __dirname,
                  "../../../views/public/imagePDF/image001.png"
                ),
                alignment: "left",
                width: 150,
              },
              {
                image: path.join(
                  __dirname,
                  "../../../views/public/imagePDF/image011.png"
                ),
                alignment: "right",
                width: 150,
              },
            ],
          ],
        },
        fillColor: "#ffffff",
        layout: "noBorders",
      },
      {
        columns: [
          {
            stack: [
              { text: "PROSOUND CENTER VIETNAM  CO. LTD.", bold: true },
              { text: "730/16 Huỳnh Tấn Phát, P. Tân Phú, Quận 7" },
              { text: "Tp. Hồ Chí Minh - Việt Nam" },
              { text: "Tel: (028) 3662 0048  Email: info@prosoundcenter.vn" },
            ],
          },
          {
            stack: [
              " ",
              {
                table: {
                  widths: ["60%", "40%"],
                  body: [
                    [
                      { text: "Số báo giá: ", alignment: "right" },
                      {
                        text: data.quotation.code || " ",
                        alignment: "right",
                        bold: true,
                      },
                    ],
                    [
                      { text: "Ngày: ", alignment: "right" },
                      {
                        text: data.quotation.createdDate || " ",
                        alignment: "right",
                        bold: true,
                      },
                    ],
                  ],
                },
                fillColor: "#ffffff",
                layout: "noBorders",
              },
            ],
          },
        ],
      },
      ...(await getBodyImage(data)),
    ],
    footer: function (currentPage: any, pageCount: any) {
      return {
        columns: [
          {
            text: "www.prosoundcenter.vn",
            link: "http://www.prosoundcenter.vn/",
            margin: [10],
          },
          {
            text: `Trang ` + currentPage.toString() + "/" + pageCount,
            margin: [0, 0, 10],
            alignment: "right",
          },
        ],
      };
    },
    styles: {
      ...PrinterHelper.getStyles(),
      total: { fillColor: "#3f3f3f", alignment: "right", color: "#ffffff" },
    },
    defaultStyle: { columnGap: 10, fontSize: 8, margin: [20, 20, 20, 20] },
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
