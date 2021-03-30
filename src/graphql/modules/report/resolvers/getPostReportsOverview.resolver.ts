import { ObjectId } from "bson";
import { set, groupBy } from "lodash";
import { configs } from "../../../../configs";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { CustomerCommissionLogModel } from "../../customerCommissionLog/customerCommissionLog.model";
import { collaboratorService } from "../../collaborator/collaborator.service";
import { OrderModel, OrderStatus } from "../../order/order.model";
import { CustomerModel } from "../../customer/customer.model";
import { CommissionLogModel } from "../../commissionLog/commissionLog.model";
import { MemberModel, MemberType } from "../../member/member.model";

const getPostReportsOverview = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  let { fromDate, toDate } = args;

  let $gte: Date = null,
    $lte: Date = null;

  if (fromDate && toDate) {
    fromDate = fromDate + "T00:00:00+07:00";
    toDate = toDate + "T24:00:00+07:00";
    $gte = new Date(fromDate);
    $lte = new Date(toDate);
  }

  const $matchIncomeFromOrder = () => {
    const match: any = {
      $match: {
        status: OrderStatus.COMPLETED
      }
    };
    if (fromDate && toDate) {
      match.$match.createdAt = {
        $gte, $lte
      }
    }
    return match;
  };


  const $matchCollaboratorsFromShop = () => {
    const match: any = {
      $match: {
      }
    };
    if (fromDate && toDate) {
      match.$match.createdAt = {
        $gte,
        $lte
      }
    }
    return match;
  };


  const $matchCommissionFromLog = () => {
    const match: any = {
      $match: {
      }
    };
    if (fromDate && toDate) {
      match.$match.createdAt = {
        $gte, $lte
      }
    }
    return match;
  };

  const [incomeFromOrder] = await OrderModel.aggregate([
    {
      ...($matchIncomeFromOrder())
    },
    {
      $group: {
        _id: "111111",
        total: {
          $sum: "$amount",
        },
      }
    }
  ]);

  // console.log('incomeFromOrder', incomeFromOrder);
  const totalIncome = incomeFromOrder ? incomeFromOrder.total : 0

  const collaboratorsFromShop = await CustomerModel.aggregate([
    {
      $lookup: {
        from: "collaborators",
        localField: "_id",
        foreignField: "customerId",
        as: "collaborators",
      },
    },
    {
      ...($matchCollaboratorsFromShop())
    },
  ]);
  // console.log('collaboratorsFromShop', collaboratorsFromShop);

  const totalCollaboratorsCount = collaboratorsFromShop.length;

  const [commissionFromLog] = await CommissionLogModel.aggregate([
    {
      ...($matchCommissionFromLog())
    },
    {
      $group: {
        _id: "11111",
        total: {
          $sum: "$value",
        },
      }
    }
  ]);

  const totalRealCommission = commissionFromLog ? commissionFromLog.total : 0;

  const totalMembersCount = await MemberModel.count({ type: MemberType.BRANCH });


  const totalOrdersCount = await OrderModel.count({ });


  return { totalIncome, totalCollaboratorsCount, totalRealCommission, totalMembersCount , totalOrdersCount }
};

const Query = {
  getPostReportsOverview,
};
export default { Query };
