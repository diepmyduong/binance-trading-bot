import moment from "moment";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { OrderModel, OrderStatus } from "../../order/order.model";
import { CustomerModel } from "../../customer/customer.model";
import { CommissionLogModel } from "../../commissionLog/commissionLog.model";
import { IMember, MemberModel, MemberType } from "../../member/member.model";
import { MemberStatistics } from "./../loaders/memberStatistics.loader";
import { memberService } from "../../member/member.service";
import { set } from "lodash";

const getPostReportsOverview = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  let { fromDate, toDate } = args;

  let $gte: Date = null,
    $lte: Date = null;

  const currentMonth = moment().format("MM");

  if (fromDate && toDate) {
    fromDate = fromDate + "T00:00:00+07:00";
    toDate = toDate + "T24:00:00+07:00";
    $gte = new Date(fromDate);
    $lte = new Date(toDate);
  }
  else {
    const currentTime = new Date();
    fromDate = `2021-${currentMonth}-01T00:00:00+07:00`; //2021-04-30
    toDate = moment(currentTime).format("YYYY-MM-DD") + "T23:59:59+07:00"; //2021-04-30
    $gte = new Date(fromDate);
    $lte = new Date(toDate);
  }

  const $matchIncomeFromOrder = () => {
    const match: any = {
      $match: {
        status: OrderStatus.COMPLETED,
        createdAt: {
          $gte, $lte
        }
      }
    };
    return match;
  };


  const $matchCollaboratorsFromShop = () => {
    const match: any = {
      $match: {
        createdAt: {
          $gte, $lte
        }
      }
    };
    return match;
  };


  const $matchCommissionFromLog = () => {
    const match: any = {
      $match: {
        createdAt: {
          $gte, $lte
        }
      }
    };
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


  const totalOrdersCount = await OrderModel.count({});


  return {
    fromDate,
    toDate,
    totalIncome,
    totalCollaboratorsCount,
    totalRealCommission,
    totalMembersCount,
    totalOrdersCount
  }
};


const getPostReports = async (
  root: any,
  args: any,
  context: Context
) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);

  const fromDate = args.q.filter.fromDate ? `${args.q.filter.fromDate}` : null;
  const toDate = args.q.filter.toDate ? `${args.q.filter.toDate}` : null;

  delete args.q.filter.fromDate;
  delete args.q.filter.toDate;

  const result = await memberService.fetch(args.q);
  const members = result.data;

  for (let i = 0; i < members.length; i++) {
    set(members[i], "fromDate", fromDate);
    set(members[i], "toDate", toDate);
  }
  result.data = members;
  return result;
};

const OverviewPost = {
  memberStatistics: async (root: any, args: any, context: Context) => {
    return await MemberStatistics.getLoader(root);
  }
}

const Query = {
  getPostReportsOverview,
  getPostReports
};

export default {
  Query,
  OverviewPost
};
