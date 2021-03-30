import { set, groupBy } from "lodash";
import { configs } from "../../../../configs";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { CustomerCommissionLogModel } from "../../customerCommissionLog/customerCommissionLog.model";
import { collaboratorService } from "../../collaborator/collaborator.service";
import { memberService } from "../../member/member.service";
import { IMember } from "../../member/member.model";
import { OrderModel } from "../../order/order.model";
import { ObjectId } from "mongodb";
import { CommissionLogModel } from "../../commissionLog/commissionLog.model";
import { MemberStatistics } from "../../member/types/memberStatistics.type";

const getPostReports = async (
  root: any,
  args: any,
  context: Context
) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const queryInput = args.q;
  let { fromDate, toDate } = queryInput.filter;
  let $gte = null,
    $lte = null;

  if (fromDate && toDate) {
    fromDate = fromDate + "T00:00:00+07:00";
    toDate = toDate + "T24:00:00+07:00";
    $gte = new Date(fromDate);
    $lte = new Date(toDate);
  }

  const membersObj = await memberService.fetch(args.q);

  const members = membersObj.data;

  for (let i = 0 ; i < members.length ; i++) {
    const member = members[i];
    // doanh thu
    const [incomeFromOrder] = await OrderModel.aggregate([
      {
        $match: { sellerId: new ObjectId(member.id) }
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

    const collaboratorsFromShop = await OrderModel.aggregate([
      {
        $match: { "pageAccounts.memberId": new ObjectId(member.id) }
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
        $match: { "collaborators.memberId": new ObjectId(member.id) }
      },
    ]);
    // console.log('collaboratorsFromShop',collaboratorsFromShop);

    const collaboratorsCount = collaboratorsFromShop.length;

    const [commissionFromLog] = await CommissionLogModel.aggregate([
      {
        $match: {
          memberId: new ObjectId(member.id)
        }
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

    set(membersObj.data[i],"memberStatistics", statitics);
  }
  return membersObj;
};

const Query = {
  getPostReports,
};
export default { Query };
