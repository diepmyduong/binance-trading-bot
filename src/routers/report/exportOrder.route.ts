import Excel from "exceljs";
import { Request, Response } from "express";
import { get, keyBy, set } from "lodash";
import moment from "moment-timezone";
import { ROLES } from "../../constants/role.const";

import { Context } from "../../graphql/context";
import { CustomerModel } from "../../graphql/modules/customer/customer.model";
import { OrderModel } from "../../graphql/modules/order/order.model";
import { ShopBranchModel } from "../../graphql/modules/shopBranch/shopBranch.model";
import { UtilsHelper, validateJSON } from "../../helpers";
import { WorkSheetHelper } from "../../helpers/workSheet";

export default [
  {
    method: "get",
    path: "/api/report/exportOrder",
    midd: [],
    action: async (req: Request, res: Response) => {
      const context = new Context({ req });
      validateJSON(req.query, {
        required: ["fromDate", "toDate"],
      });
      context.auth([ROLES.MEMBER]);

      const workbook = new Excel.Workbook();
      const sheet = workbook.addWorksheet("data");
      setHeader(sheet);

      const { fromDate, toDate, filter } = req.query as any;
      const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);
      let match = {
        fromMemberId: context.sellerId,
        loggedAt: { $gte, $lte },
      };
      if (filter) {
        try {
          match = {
            ...match,
            ...JSON.parse(Buffer.from(filter, "base64").toString("utf8")),
          };
        } catch (err) {}
      }
      console.log("match", match);
      const orders = await OrderModel.find(match);
      const [customers, shopBranchs] = await Promise.all([
        CustomerModel.find({ _id: { $in: orders.map((o) => o.buyerId) } })
          .select("_id name phone")
          .then((res) => keyBy(res, "_id")),
        ShopBranchModel.find({ _id: { $in: orders.map((o) => o.shopBranchId) } })
          .select("_id name")
          .then((res) => keyBy(res, "_id")),
      ]);
      for (const o of orders) {
        const c = customers[o.buyerId];
        const sb = shopBranchs[o.shopBranchId];
        sheet.addRow([
          moment(o.createdAt).format("YYYY/MM/DD HH:mm"),
          get(sb, "name", ""),
          o.code,
          o.itemCount,
          get(c, "name", ""),
          get(c, "phone", ""),
          o.pickupMethod || "",
          o.shipMethod || "",
          o.paymentMethod || "",
          o.status,
          o.subtotal,
          o.shipfee,
          get(o, "deliveryInfo.partnerFee", 0),
          o.discount,
          o.amount,
          o.discountDetail,
        ]);
      }

      new WorkSheetHelper(sheet).autoSize();
      UtilsHelper.responseExcel(res, workbook, "danh sach don hang");
    },
  },
];

function setHeader(sheet: Excel.Worksheet) {
  sheet.addRow([
    "Ngày tạo",
    "Chi nhánh",
    "Mã đơn",
    "Số món",
    "Tên KH",
    "SĐT",
    "Hình thức láy hàng",
    "Đơn vị GH",
    "Thanh toán",
    "Trạng thái",
    "Tiền hàng",
    "Phí ship",
    "Phí ship Đối tác",
    "Giảm giá",
    "Thành tiền",
    "Khuyến mãi",
  ]);
}
