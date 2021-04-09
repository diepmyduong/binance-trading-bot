import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { MemberStatistics } from "./../loaders/memberStatistics.loader";
import { memberService } from "../../member/member.service";
import { isEmpty, isNull, set } from "lodash";
import { OrderLogModel } from "../../orderLog/orderLog.model";
import moment from "moment-timezone";
import { CollaboratorStats } from "../loaders/collaboratorStats.loader";
import { CustomerModel } from "../../customer/customer.model";
import { IMember, MemberModel } from "../../member/member.model";
import { ObjectId } from "mongodb";
import { CollaboratorModel } from "../../collaborator/collaborator.model";

const getPostReportsOverview = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  let {
    fromDate,
    toDate,
    memberId
  } = args;

  // console.log("fromDate", fromDate)
  // console.log("toDate", toDate)

  let $gte: Date = new Date(moment().startOf('month').format('YYYY-MM-DD') + "T00:00:00+07:00"),
    $lte: Date = new Date(moment().endOf('month').format('YYYY-MM-DD') + "T00:00:00+07:00");

  // console.log("gte", $gte);
  // console.log("lte", $lte);

  if (fromDate) {
    fromDate = fromDate + "T00:00:00+07:00";
    $gte = new Date(fromDate);
  }

  if (toDate) {
    toDate = toDate + "T23:59:59+07:00";
    $lte = new Date(toDate);
  }


  const $match = {
    createdAt: {
      $gte,
      $lte
    }
  };

  const $collaboratorMatch = {
    createdAt: {
      $gte,
      $lte
    }
  };

  const $memberMatch = {}


  if (!isEmpty(memberId)) {
    set($match, "memberId", new ObjectId(memberId));
    set($collaboratorMatch, "memberId", new ObjectId(memberId));
    set($memberMatch, "_id", new ObjectId(memberId));
  }

  if (context.isMember()) {
    set($match, "memberId", new ObjectId(context.id))
    set($collaboratorMatch, "memberId", new ObjectId(context.id));
    set($memberMatch, "_id", new ObjectId(context.id));
  }

  const totalMembersCount = await MemberModel.count({
    ...$memberMatch
  });

  const totalCollaboratorsCount = await CollaboratorModel.count($collaboratorMatch);

  const collaboratorsAsCustomerCount = await CollaboratorModel.count({
    ...$collaboratorMatch,
    customerId: { $exists: true }
  });

  // console.log('$match', $match);

  const orderStats = await OrderLogModel.aggregate([
    {
      $match
    },
    {
      $group: {
        _id: "$orderId",
        log: { $last: "$$ROOT" }
      }
    },
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: '_id',
        as: 'order'
      }
    },
    { $unwind: '$order' },
    {
      $group: {
        _id: null,
        totalOrderCount: { $sum: 1 },
        pendingCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "PENDING"] }, 1, 0] } },
        confirmedCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CONFIRMED"] }, 1, 0] } },
        completeCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "COMPLETED"] }, 1, 0] } },
        deliveringCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "DELIVERING"] }, 1, 0] } },
        canceledCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CANCELED"] }, 1, 0] } },
        failureCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "FAILURE"] }, 1, 0] } },

        pendingAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "PENDING"] }, "$order.amount", 0] } },
        confirmedAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CONFIRMED"] }, "$order.amount", 0] } },
        deliveringAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "DELIVERING"] }, "$order.amount", 0] } },
        canceledAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CANCELED"] }, "$order.amount", 0] } },
        failureAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "FAILURE"] }, "$order.amount", 0] } },
        estimatedAmount: { $sum: { $cond: [{ $in: ["$log.orderStatus", ["CANCELED", "FAILURE", "COMPLETED"]] }, 0, "$order.amount"] } },
        completeAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "COMPLETED"] }, "$order.amount", 0] } },


        pendingCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "PENDING"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
        confirmedCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CONFIRMED"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
        deliveringCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "DELIVERING"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
        canceledCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CANCELED"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
        failureCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "FAILURE"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
        estimatedCommission: { $sum: { $cond: [{ $in: ["$log.orderStatus", ["CANCELED", "FAILURE", "COMPLETED"]] }, 0, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }] } },
        completeCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "COMPLETED"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
      }
    }
  ]);

  // console.log('orderStats', orderStats);

  return {
    totalCollaboratorsCount,
    collaboratorsAsCustomerCount,
    totalMembersCount,
    totalOrdersCount: orderStats[0].totalOrderCount,
    totalRealCommission: orderStats[0].completeCommission,
    totalIncome: orderStats[0].completeAmount,
  }
};

const getPostReports = async (
  root: any,
  args: any,
  context: Context
) => {
  // console.time("getPostReports");
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  if (context.isMember()) {
    args.q.filter._id = context.id;
  }
  return await memberService.fetch(args.q, '-addressStorehouseIds -addressDeliveryIds').then(res => {
    // console.timeEnd("getPostReports");
    return res;
  });
};

const OverviewPost = {
  memberStatistics: async (root: IMember, args: any, context: Context) => {
    const { fromDate = moment().startOf('month').format('YYYY-MM-DD'), toDate = moment().endOf('month').format("YYYY-MM-DD") } = args;
    return MemberStatistics.getLoader(fromDate, toDate).load(root.id);
  },
  collaboratorStats: async (root: IMember, args: any, context: Context) => {
    const { fromDate = moment().startOf('month').format('YYYY-MM-DD'), toDate = moment().endOf('month').format("YYYY-MM-DD") } = args;
    return CollaboratorStats.getLoader(fromDate, toDate).load(root.id);
  },
  customerStats: async (root: IMember, args: any, context: Context) => {
    let {
      fromDate = moment().startOf('month').format('YYYY-MM-DD'),
      toDate = moment().endOf('month').format("YYYY-MM-DD")
    } = args;
    let $gte: Date = null,
      $lte: Date = null;
      
    if (fromDate) {
      fromDate = fromDate + "T00:00:00+07:00";
      $gte = new Date(fromDate);
    }
    if (toDate) {
      toDate = toDate + "T23:59:59+07:00";
      $gte = new Date(fromDate);
    }


    const customersCount = await CustomerModel.count({
      createdAt: {
        $lte
      },
      "pageAccounts": {
        $elemMatch: {
          memberId: root.id
        }
      }
    })
    return {
      customersCount
    }
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
