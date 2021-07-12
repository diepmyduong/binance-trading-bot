import { ROLES } from "../../../constants/role.const";
import { BaseRoute, Request, Response, NextFunction } from "../../../base/baseRoute";
import { ErrorHelper } from "../../../base/error";
import { Context } from "../../../graphql/context";
import _, { set } from "lodash";
import numeral from "numeral";
import { OrderItemModel } from "../../../graphql/modules/orderItem/orderItem.model";
import { MemberModel } from "../../../graphql/modules/member/member.model";
import { UtilsHelper } from "../../../helpers";
import Excel from "exceljs";
import { isValidObjectId, Types } from "mongoose";
import { ProductModel } from "../../../graphql/modules/product/product.model";

//http://localhost:5555/api/product/exportProductReport?fromDate=2021-04-01&toDate=2021-04-06&branchId=603717300ec1da6449646ac3&sellerIds=6038ba30ab0f5a2cfe0f4ab6|6038b74cab0f5a2cfe0f48ad&x-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4iLCJfaWQiOiI2MDExMmJmYTRlMTI1YTI4MjQzZjc4NmQiLCJ1c2VybmFtZSI6IlBLRCAtIELEkFRQIiwiaWF0IjoxNjE3NjEyNzU3LCJleHAiOjE2MjAyMDQ3NTd9.of8nz5oPteaLjZqlgNreGD-mBl6TFlWNK05yjvyhwO4

export const exportProductReport = async (req: Request, res: Response) => {
  const context = (req as any).context as Context;

  context.auth(ROLES.ADMIN_EDITOR_MEMBER);

  let fromDate: string = req.query.fromDate ? req.query.fromDate.toString() : null;
  let toDate: string = req.query.toDate ? req.query.toDate.toString() : null;
  const memberId: string = req.query.memberId ? req.query.memberId.toString() : null;
  const branchId: any = req.query.branchId ? req.query.branchId.toString() : null;
  const memberIdsString = req.query.sellerIds ? req.query.sellerIds.toString() : null;

  let sellerIds: any = null;
  if (memberIdsString) {
    sellerIds = memberIdsString.split("|");
    if (sellerIds.length < 0) throw ErrorHelper.requestDataInvalid("Mã cửa hàng");

    sellerIds.map((m: string) => {
      if (!isValidObjectId(m)) {
        throw ErrorHelper.requestDataInvalid("Mã cửa hàng");
      }
    });

    sellerIds = sellerIds.map(Types.ObjectId);
  }

  if (!isValidObjectId(memberId)) {
    throw ErrorHelper.requestDataInvalid("Mã cửa hàng");
  }

  const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

  const match2: any = {};
  if (context.isMember()) {
    set(match2, "sellerId.$in", [context.id]);
  } else {
    if (branchId) {
      const memberIds = await MemberModel.find({ branchId, activated: true }).select("_id");
      const sellerIds = memberIds.map((m) => m.id);
      set(match2, "sellerId.$in", sellerIds.map(Types.ObjectId));
    } else {
      if (sellerIds) {
        if (sellerIds.length > 0) {
          set(match2, "sellerId.$in", sellerIds);
        }
      }
    }
  }

  const productIds = await ProductModel.find({}).select("_id");
  const objectIds = productIds.map((m) => m.id).map(Types.ObjectId);

  const $match: any = {};
  if ($gte) {
    set($match, "createdAt.$gte", $gte);
  }
  if ($lte) {
    set($match, "createdAt.$lte", $lte);
  }
  set($match, "productId.$in", objectIds);

  const data: any = await OrderItemModel.aggregate([
    {
      $match,
    },
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },
    {
      $project: {
        _id: 1,
        status: 1,
        productId: 1,
        productName: 1,
        basePrice: 1,
        orderId: 1,
        sellerId: "$order.sellerId",
        amount: 1,
        qty: 1,
      },
    },
    {
      $match: {
        ...match2,
      },
    },
    {
      $group: {
        _id: { productId: "$productId", productName: "$productName", basePrice: "$basePrice" },
        totalQty: { $sum: "$qty" },
        pendingQtyCount: { $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, "$qty", 0] } },
        confirmedQtyCount: { $sum: { $cond: [{ $eq: ["$status", "CONFIRMED"] }, "$qty", 0] } },
        deliveringQtyCount: { $sum: { $cond: [{ $eq: ["$status", "DELIVERING"] }, "$qty", 0] } },
        completedQtyCount: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, "$qty", 0] } },
        failureQtyCount: { $sum: { $cond: [{ $eq: ["$status", "FAILURE"] }, "$qty", 0] } },
        canceledQtyCount: { $sum: { $cond: [{ $eq: ["$status", "CANCELED"] }, "$qty", 0] } },

        orderCount: { $sum: 1 },
        pendingCount: { $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] } },
        confirmedCount: { $sum: { $cond: [{ $eq: ["$status", "CONFIRMED"] }, 1, 0] } },
        deliveringCount: { $sum: { $cond: [{ $eq: ["$status", "DELIVERING"] }, 1, 0] } },
        completedCount: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] } },
        failureCount: { $sum: { $cond: [{ $eq: ["$status", "FAILURE"] }, 1, 0] } },
        canceledCount: { $sum: { $cond: [{ $eq: ["$status", "CANCELED"] }, 1, 0] } },

        totalAmount: { $sum: "$amount" },
        pendingAmount: { $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, "$amount", 0] } },
        confirmedAmount: { $sum: { $cond: [{ $eq: ["$status", "CONFIRMED"] }, "$amount", 0] } },
        deliveringAmount: { $sum: { $cond: [{ $eq: ["$status", "DELIVERING"] }, "$amount", 0] } },
        completedAmount: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, "$amount", 0] } },
        failureAmount: { $sum: { $cond: [{ $eq: ["$status", "FAILURE"] }, "$amount", 0] } },
        canceledAmount: { $sum: { $cond: [{ $eq: ["$status", "CANCELED"] }, "$amount", 0] } },
      },
    },
    {
      $project: {
        _id: "$_id.productId",
        productName: "$_id.productName",
        basePrice: "$_id.basePrice",

        totalQty: 1,
        pendingQtyCount: 1,
        confirmedQtyCount: 1,
        deliveringQtyCount: 1,
        completedQtyCount: 1,
        failureQtyCount: 1,
        canceledQtyCount: 1,

        orderCount: 1,
        pendingCount: 1,
        confirmedCount: 1,
        deliveringCount: 1,
        completedCount: 1,
        failureCount: 1,
        canceledCount: 1,

        totalAmount: 1,
        pendingAmount: 1,
        confirmedAmount: 1,
        deliveringAmount: 1,
        completedAmount: 1,
        failureAmount: 1,
        canceledAmount: 1,
      },
    },
  ]);
  const workbook = new Excel.Workbook();
  const createSheetData = (data: [], name: string) => {
    const sheet = workbook.addWorksheet(name);

    const excelHeaders = [
      "STT",
      "Sản phẩm",
      "Đơn giá",

      "Tổng số đơn",
      "Tổng số lượng hàng",
      "Tổng tiền",

      "Số lượng chờ duyệt",
      "Tổng tiền chờ duyệt",

      "Số lượng xác nhận",
      "Tổng tiền xác nhận",

      "Số lượng đang giao",
      "Tổng tiền đang giao",

      "Số lượng hoàn thành",
      "Tổng tiền hoàn thành",

      "Số lượng thất bại",
      "Tổng tiền thất bại",

      "Số lượng đã huỷ",
      "Tổng tiền đã huỷ",
    ];

    sheet.addRow(excelHeaders);

    data.forEach((d: any, i: number) => {
      const dataRow = [
        i + 1,
        d.productName,
        d.basePrice,

        d.orderCount,
        d.totalQty,
        d.totalAmount,

        d.pendingQtyCount,
        d.pendingAmount,

        d.confirmedQtyCount,
        d.confirmedAmount,

        d.deliveringQtyCount,
        d.deliveringAmount,

        d.completedQtyCount,
        d.completedAmount,

        d.failureQtyCount,
        d.failureAmount,

        d.canceledQtyCount,
        d.canceledAmount,
      ];
      sheet.addRow(dataRow);
    });

    UtilsHelper.setThemeExcelWorkBook(sheet);
  };

  const POSTS_SHEET_NAME = "Danh sách sản phẩm";
  createSheetData(data, POSTS_SHEET_NAME);

  return UtilsHelper.responseExcel(res, workbook, "danh_sach_san_pham");
};
