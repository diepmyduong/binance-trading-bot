import { Request, Response } from "express";
import { set, sumBy } from "lodash";

import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";
import { CollaboratorModel } from "../../graphql/modules/collaborator/collaborator.model";
import { MemberModel } from "../../graphql/modules/member/member.model";
import { OrderModel, OrderStatus } from "../../graphql/modules/order/order.model";
import { OrderItemModel } from "../../graphql/modules/orderItem/orderItem.model";
import { num2Text, UtilsHelper, validateJSON } from "../../helpers";
import { getWorksheetCloner, SheetCloner } from "../../helpers/workSheet";
import { auth } from "../../middleware/auth";

export default [
  {
    method: "get",
    path: "/api/report/exportCollaboratorCommission",
    midd: [auth],
    action: async (req: Request, res: Response) => {
      const context = (req as any).context as Context;
      context.auth(ROLES.ADMIN_EDITOR_MEMBER);
      validateJSON(req.query, {
        type: "object",
        required: ["fromDate", "toDate", "collaboratorId"],
      });
      const { cloner, reportWorkbook } = await getWorksheetCloner(
        "report_thu_lao_ca_nhan",
        "template",
        "THÙ_LAO_BH_CÁ_NHÂN"
      );
      const data = await prepareData(req.query, context);
      await parseWorkbook(cloner, data);
      return UtilsHelper.responseExcel(
        res,
        reportWorkbook,
        `Thu Lao BH Ca Nhan ${data.customerCode} ${data.fromDate} ${data.toDate}`
      );
    },
  },
];

async function prepareData(filter: any = {}, context: Context) {
  const { collaboratorId, fromDate, toDate } = filter;
  const $match = getMatch(collaboratorId, fromDate, toDate);
  const collaborator = await CollaboratorModel.findById(collaboratorId);
  const [member, products] = await Promise.all([
    MemberModel.findById(collaborator.memberId).select("_id shopName code"),
    aggregateProducts($match),
  ]);
  const commission = sumBy(products, "commission2");
  return {
    shopName: `${member.code} - ${member.shopName}`,
    fromDate: fromDate,
    toDate: toDate,
    customerName: collaborator.name,
    customerCode: collaborator.code,
    products: products,
    commissionText: num2Text(commission) + " đồng",
  };
}

function getMatch(collaboratorId: any, fromDate: any, toDate: any) {
  const $match: any = {
    collaboratorId: collaboratorId,
    status: OrderStatus.COMPLETED,
  };
  const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);
  if ($gte) set($match, "createdAt.$gte", $gte);
  if ($lte) set($match, "loggedAt.$lte", $lte);
  return $match;
}

async function aggregateProducts($match: any) {
  const orderIds = await OrderModel.find($match)
    .select("_id")
    .then((res) => res.map((r) => r._id));
  if (orderIds.length == 0) return [];
  const query = [
    {
      $match: {
        orderId: { $in: orderIds },
      },
    },
    {
      $group: {
        _id: "$productId",
        productName: { $first: "$productName" },
        productQty: { $sum: "$qty" },
        productPrice: { $first: "$basePrice" },
        revenue: { $first: "$amount" },
        commission2: { $sum: "$commission2" },
      },
    },
  ];
  return OrderItemModel.aggregate(query);
}

async function parseWorkbook(cloner: SheetCloner, data: any) {
  cloner.next("A1", "K11", {
    shopName: data.shopName,
    fromDate: data.fromDate,
    toDate: data.toDate,
    customerName: data.customerName,
    customerCode: data.customerCode,
  });

  for (var i = 0; i < data.products.length; i++) {
    const p = data.products[i];
    const rowIndex = 12 + i;
    const context = {
      index: i + 1,
      productName: p.productName,
      productQty: p.productQty,
      productPrice: p.productPrice,
      productBasePrice: p.productPrice,
      revenue: p.revenue,
      dttl: `=C${rowIndex}*(D${rowIndex}-E${rowIndex})/1.1`,
      commission1: 0,
      commission2: p.commission2,
      commission3: 0,
      commission: `=SUM(H${rowIndex}:J${rowIndex})`,
    };
    cloner.next("A12", "K12", context);
  }
  const lastRowIndex = 12 + data.products.length - 1;
  cloner.next("A13", "K13", {
    sumRevenue: `=SUM(F${12}:F${lastRowIndex})`,
    sumDttl: `=SUM(G${12}:G${lastRowIndex})`,
    sumCommission1: `=SUM(H${12}:H${lastRowIndex})`,
    sumCommission3: `=SUM(I${12}:I${lastRowIndex})`,
    sumCommission2: `=SUM(J${12}:J${lastRowIndex})`,
    sumCommission: `=SUM(K${12}:K${lastRowIndex})`,
  });
  cloner.next("A14", "K25", {
    commissionText: data.commissionText,
  });
}
