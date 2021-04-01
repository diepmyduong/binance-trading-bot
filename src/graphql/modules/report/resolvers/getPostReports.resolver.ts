import { set } from "lodash";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { memberService } from "../../member/member.service";
import { OrderModel, OrderStatus } from "../../order/order.model";
import { ObjectId } from "mongodb";
import { CommissionLogModel } from "../../commissionLog/commissionLog.model";
import { MemberStatistics } from "../types/memberStatistics.type";
import { CustomerModel } from "../../customer/customer.model";
import moment from 'moment';

const getPostReports = async (
  root: any,
  args: any,
  context: Context
) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const queryInput = args.q;
  let { fromDate, toDate } = queryInput.filter;

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
    // fromDate = `2021-${currentMonth}-01T00:00:00+07:00`; //2021-04-30
    fromDate = `2021-${currentMonth}-01T00:00:00+07:00`; //2021-04-30
    toDate = moment(currentTime).format("YYYY-MM-DD") + "T23:59:59+07:00"; //2021-04-30
    $gte = new Date(fromDate);
    $lte = new Date(toDate);
  }

  delete args.q.filter.fromDate;
  delete args.q.filter.toDate;

  const membersObj = await memberService.fetch(args.q);

  const members = membersObj.data;

  const $matchIncomeFromOrder = (member: any) => {
    const match: any = {
      $match: {
        sellerId: new ObjectId(member.id),
        status: OrderStatus.COMPLETED,
        createdAt: {
          $gte, $lte
        }
      }
    };
    return match;
  };

  const $matchCollaboratorsFromShop = (member: any) => {
    const match: any = {
      $match: {
        "collaborators.memberId": new ObjectId(member.id),
        createdAt: {
          $gte, $lte
        }
      }
    };
    return match;
  };

  const $matchCommissionFromLog = (member: any) => {
    const match: any = {
      $match: {
        memberId: new ObjectId(member.id),
        createdAt: {
          $gte, $lte
        }
      }
    };
    return match;
  };

  const $matchEstimatedCommission1ByOrder = (member: any) => {
    const match: any = {
      $match: {
        sellerId: new ObjectId(member.id),
        status: { $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING] },
        createdAt: {
          $gte, $lte
        }
      }
    };
    return match;
  }

  const $matchEstimatedCommission2ByOrder = (member: any) => {
    const match: any = {
      $match: {
        sellerId: new ObjectId(member.id),
        status: { $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING] },
        collaboratorId: { $exists: false },
        createdAt: {
          $gte, $lte
        }
      }
    };
    return match;
  }

  const $matchEstimatedCommission3ByReceivingOrder = (member: any) => {
    const match: any = {
      $match: {
        sellerId: new ObjectId(member.id),
        status: { $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING] },
        addressDeliveryId: { $exists: true },
        commission3: { $gt: 0 },
        createdAt: {
          $gte, $lte
        }
      }
    };
    return match;
  }


  const $matchEstimatedCommission3ByDeliveringOrder = (member: any) => {
    const match: any = {
      $match: {
        sellerId: new ObjectId(member.id),
        status: { $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING] },
        addressStorehouseId: { $exists: true },
        commission3: { $gt: 0 },
        createdAt: {
          $gte, $lte
        }
      }
    };
    return match;
  }

  for (let i = 0; i < members.length; i++) {
    const member: any = members[i];
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
    // console.log('collaboratorsFromShop', collaboratorsFromShop);

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

    const [estimatedCommission1ByOrder] = await OrderModel.aggregate([
      {
        ...($matchEstimatedCommission1ByOrder(member))
      },
      {
        $group: {
          _id: "111111",
          totalCommission1: {
            $sum: "$commission1",
          },
        }
      }
    ]);

    const estimatedCommission1 = estimatedCommission1ByOrder ? estimatedCommission1ByOrder.totalCommission1 : 0;

    const [estimatedCommission2ByOrder] = await OrderModel.aggregate([
      {
        ...($matchEstimatedCommission2ByOrder(member))
      },
      {
        $group: {
          _id: "22222",
          totalCommission2: {
            $sum: "$commission2",
          },
        }
      }
    ]);

    const estimatedCommission2 = estimatedCommission2ByOrder ? estimatedCommission2ByOrder.totalCommission2 : 0;

    const [estimatedCommission3FromReceivingOrder] = await OrderModel.aggregate([
      {
        ...($matchEstimatedCommission3ByReceivingOrder(member))
      },
      {
        $lookup: {
          from: "addressdeliveries",
          localField: "addressDeliveryId",
          foreignField: "_id",
          as: "addressdelivery",
        },
      },
      { $unwind: "$addressdelivery" },
      {
        $match: {
          "addressdelivery.code": member.code
        }
      },
      {
        $group: {
          _id: "333333",
          totalCommission3: {
            $sum: "$commission3",
          },
        }
      }
    ])

    const receivingEstimatedCommission3 = estimatedCommission3FromReceivingOrder ? estimatedCommission3FromReceivingOrder.totalCommission3 : 0;

    const [estimatedCommission3FromDeliveringOrder] = await OrderModel.aggregate([
      {
        ...($matchEstimatedCommission3ByDeliveringOrder(member))
      },
      {
        $lookup: {
          from: "addressstorehouses",
          localField: "addressStorehouseId",
          foreignField: "_id",
          as: "addressstorehouse",
        },
      },
      { $unwind: "$addressstorehouse" },
      {
        $match: {
          "addressstorehouse.code": member.code
        }
      },
      {
        $group: {
          _id: "333333",
          totalCommission3: {
            $sum: "$commission3",
          },
        }
      }
    ])

    const deliveringEstimatedCommission3 = estimatedCommission3FromDeliveringOrder ? estimatedCommission3FromDeliveringOrder.totalCommission3 : 0;

    const estimatedCommission3 = receivingEstimatedCommission3 + deliveringEstimatedCommission3;

    const estimatedCommission = estimatedCommission1 + estimatedCommission2 + estimatedCommission3;

    const statitics: MemberStatistics = {
      fromDate,
      toDate,
      income,
      collaboratorsCount,
      realCommission,
      estimatedCommission,
      estimatedIncome:0
    }

    set(membersObj.data[i], "memberStatistics", statitics);
  }
  return membersObj;
};

const Query = {
  getPostReports,
};
export default { Query };
