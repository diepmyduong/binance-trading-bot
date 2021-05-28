import { Request, Response } from "express";
import { get, keyBy, set } from "lodash";
import { Types } from "mongoose";

import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";
import {
  CollaboratorModel,
  ICollaborator,
} from "../../graphql/modules/collaborator/collaborator.model";
import { CustomerCommissionLogModel } from "../../graphql/modules/customerCommissionLog/customerCommissionLog.model";
import { MemberModel } from "../../graphql/modules/member/member.model";
import { UtilsHelper, validateJSON } from "../../helpers";
import { getWorksheetCloner, SheetCloner } from "../../helpers/workSheet";
import { auth } from "../../middleware/auth";

export default [
  {
    method: "get",
    path: "/api/report/exportCollaboratorWithCommission",
    midd: [auth],
    action: async (req: Request, res: Response) => {
      const context = (req as any).context as Context;
      context.auth(ROLES.ADMIN_EDITOR_MEMBER);
      validateJSON(req.query, {
        type: "object",
        required: ["fromDate", "toDate", "memberId"],
      });
      const { cloner, reportWorkbook } = await getWorksheetCloner(
        "report_danh_sach_ctv",
        "template",
        "TỔNG HỢP_THÙ_LAO_CTV"
      );
      const data = await prepareData(req.query, context);
      await parseWorkbook(cloner, data);
      return UtilsHelper.responseExcel(
        res,
        reportWorkbook,
        `Tong Hop Thu Lao CTV ${data.fromDate} ${data.toDate}`
      );
    },
  },
];

async function prepareData(filter: any, context: Context) {
  let { memberId, fromDate, toDate } = filter;
  const $match: any = getMatch(memberId, context, fromDate, toDate);
  const [collaborators, member, commissions] = await Promise.all([
    CollaboratorModel.find({ memberId: $match.memberId, code: { $exists: !!filter.staff } }),
    MemberModel.findById($match.memberId).select("_id shopName code"),
    aggregateCommission($match),
  ]);
  return {
    shopName: `${member.code} - ${member.shopName}`,
    fromDate: fromDate,
    toDate: toDate,
    collaborators: collaborators,
    commissions: commissions,
  };
}

function aggregateCommission($match: any) {
  const query = [
    { $match: $match },
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: { path: "$order", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$collaboratorId",
        commission: { $sum: "$value" },
        revenue: { $sum: "$order.amount" },
      },
    },
  ];
  return CustomerCommissionLogModel.aggregate(query).then((res) => keyBy(res, "_id"));
}

function getMatch(memberId: any, context: Context, fromDate: any, toDate: any) {
  const $match: any = {};
  if (memberId) set($match, "memberId", Types.ObjectId(memberId));
  if (context.isMember()) set($match, "memberId", Types.ObjectId(memberId));
  const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);
  if ($gte) set($match, "createdAt.$gte", $gte);
  if ($lte) set($match, "createdAt.$lte", $lte);
  return $match;
}

async function parseWorkbook(cloner: SheetCloner, data: any) {
  cloner.next("A1", "F8", {
    shopName: data.shopName,
    fromDate: data.fromDate,
    toDate: data.toDate,
  });

  for (var i = 0; i < data.collaborators.length; i++) {
    const c = data.collaborators[i] as ICollaborator;
    const commission = data.commissions[c._id];
    const context = {
      index: i + 1,
      customerName: c.name,
      customerPhone: c.phone,
      commission: get(commission, "commission", 0),
      revenue: get(commission, "revenue", 0),
    };
    cloner.next("A9", "F9", context);
  }
  cloner.next("A10", "F19", {
    sumRevenue: `=SUM(D${9}:D${9 + data.collaborators.length - 1})`,
    sumCommission: `=SUM(E${9}:E${9 + data.collaborators.length - 1})`,
  });
}
