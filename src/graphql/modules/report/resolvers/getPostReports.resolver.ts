import { set, groupBy } from "lodash";
import { configs } from "../../../../configs";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { CustomerCommissionLogModel } from "../../customerCommissionLog/customerCommissionLog.model";
import { collaboratorService } from "../../collaborator/collaborator.service";
import { memberService } from "../../member/member.service";
import { IMember } from "../../member/member.model";
import { OrderModel, OrderStatus } from "../../order/order.model";
import { ObjectId } from "mongodb";
import { CommissionLogModel } from "../../commissionLog/commissionLog.model";
import { MemberStatistics } from "../../member/types/memberStatistics.type";
import { CustomerModel } from "../../customer/customer.model";

const getPostReports = async (
  root: any,
  args: any,
  context: Context
) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const queryInput = args.q;
  let { fromDate, toDate } = queryInput.filter;


  console.log('fromDate',fromDate);
  console.log('toDate',toDate);

  let $gte: Date = null,
    $lte: Date = null;

  if (fromDate && toDate) {
    fromDate = fromDate + "T00:00:00+07:00";
    toDate = toDate + "T24:00:00+07:00";
    $gte = new Date(fromDate);
    $lte = new Date(toDate);
  }
  
  console.log('$gte',$gte);
  console.log('$lte',$lte);

  const membersObj = await memberService.fetch(args.q);

  const members = membersObj.data;

  const $matchIncomeFromOrder = (member: any) => {
    let match: any = {
      $match: {
        sellerId: new ObjectId(member.id),
        status: OrderStatus.COMPLETED
      }
    };
    
    if (fromDate && toDate) {
      set(match, "$match.createdAt", {
        $gte, $lte
      })
    }

    // console.log('set match',match);
    return match;
  };

  const $matchCollaboratorsFromShop = (member: any) => {
    const match: any = {
      $match:{
        "collaborators.memberId": new ObjectId(member.id),
      }
    };
    if (fromDate && toDate) {
      match.$match.createdAt = {
        $gte, $lte
      }
    }
    return match;
  };

  const $matchCommissionFromLog = (member: any) => {
    const match: any = {
      $match: {
        memberId: new ObjectId(member.id),
      }
    };
    if (fromDate && toDate) {
      match.$match.createdAt = {
        $gte, $lte
      }
    }
    return match;
  };


  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    // doanh thu
    const [incomeFromOrder] = await OrderModel.aggregate([
      {
        ...($matchIncomeFromOrder(member))
      },
      {
        $group: {
          _id: "$sellerId",
          orderIds: { $addToSet: "$orderId" },
          total: {
            $sum: "$amount",
          },
        }
      }
    ]);

    // console.log('incomeFromOrder',incomeFromOrder);

    const income = incomeFromOrder ? incomeFromOrder.total : 0;

    const collaboratorsFromShop = await CustomerModel.aggregate([
      {
        $match: {
          "pageAccounts.memberId": new ObjectId(member.id)
        }
      },
      {
        $lookup: {
          from: "collaborators",
          localField: "_id",
          foreignField: "customerId",
          as: "collaborators",
        },
      },
      {
        ...($matchCollaboratorsFromShop(member))
      },
    ]);
    console.log('collaboratorsFromShop', collaboratorsFromShop);

    const collaboratorsCount = collaboratorsFromShop.length;

    const [commissionFromLog] = await CommissionLogModel.aggregate([
      {
        ...($matchCommissionFromLog(member))
      },
      {
        $group: {
          _id: "$memberId",
          orderIds: { $addToSet: "$orderId" },
          total: {
            $sum: "$value",
          },
        }
      }
    ]);
    // console.log('commissionFromLog',commissionFromLog);

    const realCommission = commissionFromLog ? commissionFromLog.total : 0;

    const statitics: MemberStatistics = {
      income,
      collaboratorsCount,
      realCommission
    }

    set(membersObj.data[i], "memberStatistics", statitics);
  }
  return membersObj;
};

const Query = {
  getPostReports,
};
export default { Query };
