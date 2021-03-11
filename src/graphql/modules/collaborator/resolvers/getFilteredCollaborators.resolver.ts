import { ObjectId } from "bson";
import { set } from "lodash";
import { configs } from "../../../../configs";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { CustomerCommissionLogModel } from "../../customerCommissionLog/customerCommissionLog.model";
import { collaboratorService } from "../collaborator.service";

const getFilteredCollaborators = async (
  root: any,
  args: any,
  context: Context
) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const queryInput = args.q;
  let { fromDate, toDate, memberId } = queryInput.filter;
  let $gte = null,
    $lte = null;

  const $match: any = {};

  if (fromDate && toDate) {
    fromDate = fromDate + "T00:00:00+07:00";
    toDate = toDate + "T24:00:00+07:00";
    $gte = new Date(fromDate);
    $lte = new Date(toDate);
    $match.createdAt = { $gte, $lte };
  }

  if(memberId){
    $match.memberId = new ObjectId(memberId);
  }

  //customerId:ObjectId("603b6ea20c5de11eaca05606"),

  // console.log("$match", $match);

  const $limit = queryInput.limit || configs.query.limit;
  const $skip = queryInput.offset || (queryInput.page - 1) * $limit || 0;

  const result = await CustomerCommissionLogModel.aggregate([
    {
      $project: {
        _id: 1,
        customerId: 1,
        memberId: 1,
        type: 1,
        value: 1,
        orderId: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $match,
    },
    {
      $group: {
        _id: "$customerId",
        memberIds: { $push: "$memberId" },
        customerIds: { $push: "$customerId" },
        total: {
          $sum: "$value",
        },
      },
    },
    {
      $project: {
        _id: 0,
        memberIds: 1,
        customerId: { $arrayElemAt: ["$customerIds", 0] },
        total: 1,
      },
    },
    {
      $limit,
    },
    {
      $skip,
    },
  ]);

  return {
    data: result,
    total: result.length,
    pagination: {
      page: queryInput.page || 1,
      limit: $limit,
      offset: $skip,
      total: result.length,
    },
  };
};

const Query = {
  getFilteredCollaborators,
};
export default { Query };
