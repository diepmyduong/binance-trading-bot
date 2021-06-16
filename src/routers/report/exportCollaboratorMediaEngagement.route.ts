import { Request, Response } from "express";
import moment from "moment-timezone";

import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";
import {
  CollaboratorModel,
  ICollaborator,
} from "../../graphql/modules/collaborator/collaborator.model";
import { getMatch } from "../../graphql/modules/reportMedia/common";
import { UtilsHelper } from "../../helpers";
import { getWorksheetCloner, SheetCloner } from "../../helpers/workSheet";
import { auth } from "../../middleware/auth";

export default [
  {
    method: "get",
    path: "/api/report/exportCollaboratorMediaEngagement",
    midd: [auth],
    action: async (req: Request, res: Response) => {
      const context = (req as any).context as Context;
      context.auth(ROLES.ADMIN_EDITOR_MEMBER);
      const { cloner, reportWorkbook } = await getWorksheetCloner(
        "report_truyen_thong_ctv",
        "template",
        "DANH SÁCH"
      );
      const data = await prepareData(req.query, context);
      await parseWorkbook(cloner, data);
      return UtilsHelper.responseExcel(res, reportWorkbook, `Bao Cao Truyen Thong ${data.date}`);
    },
  },
];

async function prepareData(filter: any = {}, context: Context) {
  const { branchId, sellerIds } = filter;
  const $match = await getMatch(context, branchId, sellerIds);
  const collaborators = await CollaboratorModel.find($match);
  return {
    shopName: `Bưu điện thành phố`,
    date: moment().format("DD/MM/YYYY"),
    collaborators,
  };
}

async function parseWorkbook(cloner: SheetCloner, data: any) {
  cloner.next("A1", "I8", {
    shopName: data.shopName,
    date: data.date,
  });

  for (var i = 0; i < data.collaborators.length; i++) {
    const c = data.collaborators[i] as ICollaborator;
    const context = {
      index: i + 1,
      name: c.name,
      phone: c.phone,
      shortUrl: c.shortUrl,
      clickCount: c.clickCount,
      likeCount: c.likeCount,
      shareCount: c.shareCount,
      commentCount: c.commentCount,
      engagementCount: c.engagementCount,
    };
    cloner.next("A9", "I9", context);
  }
  const lastRowIndex = 9 + data.collaborators.length - 1;
  cloner.next("A10", "I10", {
    sumClickCount: `=SUM(E${9}:E${lastRowIndex})`,
    sumLikeCount: `=SUM(F${9}:F${lastRowIndex})`,
    sumShareCount: `=SUM(G${9}:G${lastRowIndex})`,
    sumCommentCount: `=SUM(H${9}:H${lastRowIndex})`,
    sumEngagementCount: `=SUM(I${9}:I${lastRowIndex})`,
  });
  cloner.next("A11", "I19", {});
}
