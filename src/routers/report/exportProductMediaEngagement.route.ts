import { Request, Response } from "express";
import { get, keyBy, reduce } from "lodash";
import moment from "moment-timezone";
import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";
import {
  CollaboratorProductModel,
  ICollaboratorProduct,
} from "../../graphql/modules/collaboratorProduct/collaboratorProduct.model";
import { CollaboratorProductOrderStats } from "../../graphql/modules/collaboratorProduct/getCollaboratorProductOrderStats.graphql";
import { getMatch } from "../../graphql/modules/reportMedia/common";
import { UtilsHelper } from "../../helpers";
import { getWorksheetCloner, SheetCloner } from "../../helpers/workSheet";
import { auth } from "../../middleware/auth";
export default [
  {
    method: "get",
    path: "/api/report/exportProductMediaEngagement",
    midd: [auth],
    action: async (req: Request, res: Response) => {
      const context = (req as any).context as Context;
      context.auth(ROLES.ADMIN_EDITOR_MEMBER);
      const { cloner, reportWorkbook } = await getWorksheetCloner(
        "report_truyen_thong_san_pham",
        "template",
        "DANH SÁCH"
      );
      const data = await prepareData(req.query, context);
      await parseWorkbook(cloner, data);
      return UtilsHelper.responseExcel(
        res,
        reportWorkbook,
        `Bao Cao Truyen Thong San Pham ${data.date}`
      );
    },
  },
];

async function prepareData(filter: any = {}, context: Context) {
  const { branchId, sellerIds } = filter;
  const $match = await getMatch(context, branchId, sellerIds);
  const products = await CollaboratorProductModel.aggregate([
    { $match: $match },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
  ]);
  const productIds = products.map((p) => p.productId.toString());
  const orderStats = await CollaboratorProductOrderStats(null, null)
    .loadMany(productIds)
    .then((res) => {
      return reduce(
        res,
        (prev, val, index) => {
          return {
            ...prev,
            [productIds[index]]: val,
          };
        },
        {} as any
      );
    })
    .catch((err) => ({}));
  products.forEach((p) => {
    const stats = orderStats[p.productId];
    p.orderCount = stats.completeOrder;
    p.orderQty = stats.completeProductQty;
  });
  return {
    shopName: `Bưu điện thành phố`,
    date: moment().format("DD/MM/YYYY"),
    products,
  };
}

async function parseWorkbook(cloner: SheetCloner, data: any) {
  cloner.next("A1", "K8", {
    shopName: data.shopName,
    date: data.date,
  });

  for (var i = 0; i < data.products.length; i++) {
    const p = data.products[i];
    // console.log("p", p);
    const context = {
      index: i + 1,
      productCode: get(p, "product.code", ""),
      productName: get(p, "product.name", ""),
      shortUrl: p.shortUrl,
      clickCount: p.clickCount,
      likeCount: p.likeCount,
      shareCount: p.shareCount,
      commentCount: p.commentCount,
      engagementCount: p.engagementCount,
      orderCount: p.orderCount,
      orderQty: p.orderQty,
    };
    cloner.next("A9", "K9", context);
  }
  const lastRowIndex = 9 + data.products.length - 1;
  cloner.next("A10", "K10", {
    sumClickCount: `=SUM(E${9}:E${lastRowIndex})`,
    sumLikeCount: `=SUM(F${9}:F${lastRowIndex})`,
    sumShareCount: `=SUM(G${9}:G${lastRowIndex})`,
    sumCommentCount: `=SUM(H${9}:H${lastRowIndex})`,
    sumEngagementCount: `=SUM(I${9}:I${lastRowIndex})`,
    sumOrderCount: `=SUM(J${9}:J${lastRowIndex})`,
    sumOrderQty: `=SUM(K${9}:K${lastRowIndex})`,
  });
  cloner.next("A11", "I19", {});
}
