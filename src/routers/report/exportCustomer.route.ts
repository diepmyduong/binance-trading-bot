import { Request, Response } from "express";
import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";
import Excel from "exceljs";
import { CustomerModel } from "../../graphql/modules/customer/customer.model";
import { UtilsHelper } from "../../helpers";
import moment from "moment-timezone";
import { get } from "lodash";
import { WorkSheetHelper } from "../../helpers/workSheet";
export default [
  {
    method: "get",
    path: "/api/report/exportCustomer",
    midd: [],
    action: async (req: Request, res: Response) => {
      const context = new Context({ req });
      context.auth([ROLES.MEMBER]);
      const workbook = new Excel.Workbook();
      const sheet = workbook.addWorksheet("data");
      setHeader(sheet);
      const cursor = CustomerModel.find({ memberId: context.sellerId })
        .select("_id name phone fullAddress context createdAt")
        .cursor();
      cursor.on("data", (c) => {
        sheet.addRow([
          moment(c.createdAt).format("YYYY/MM/DD HH:mm"),
          c.name || "",
          c.phone || "",
          c.fullAddress || "",
          get(c, "context.order", 0),
          get(c, "context.completed", 0),
          get(c, "context.canceled", 0),
          get(c, "context.voucher", 0),
          get(c, "context.discount", 0),
          get(c, "context.revenue", 0),
        ]);
      });
      cursor.on("end", () => {
        cursor.close();
        new WorkSheetHelper(sheet).autoSize();
        UtilsHelper.responseExcel(res, workbook, "danh sach khach hang");
      });
      cursor.on("error", (err) => {
        cursor.close();
        throw err;
      });
    },
  },
];
function setHeader(sheet: Excel.Worksheet) {
  sheet.addRow([
    "Ngày tạo",
    "Tên KH",
    "SĐT",
    "Địa chỉ",
    "Tổng đơn",
    "Hoàn thành",
    "Huỷ",
    "Voucher SD",
    "Giảm giá",
    "Doanh số",
  ]);
}
