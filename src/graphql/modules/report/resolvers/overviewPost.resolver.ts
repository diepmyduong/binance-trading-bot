import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { ICommissionLog } from "../../commissionLog/commissionLog.model";
import { MemberStatistics } from "./../loaders/memberStatistics.loader";
import { memberService } from "../../member/member.service";
import { set } from "lodash";
import { AddressDeliveryModel } from "../../addressDelivery/addressDelivery.model";
import { AddressStorehouseModel } from "../../addressStorehouse/addressStorehouse.model";
import { ReportHelper } from "../report.helper";

const getPostReportsOverview = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  let { fromDate, toDate, memberId } = args;

  let $gte: Date = null,
    $lte: Date = null,
    member = null;

  if (fromDate) {
    fromDate = fromDate + "T00:00:00+07:00";
    $gte = new Date(fromDate);
  }

  if (toDate) {
    toDate = toDate + "T24:00:00+07:00";
    $lte = new Date(toDate);
  }


  if(memberId){
    member = { id: memberId };
  }

  if (context.isMember()) {
    member = { id: context.id };
  }

  // console.log("member",member);

  const [
    addressDeliverys,
    addressStorehouses,
    // customers,
    // collaborators,
    customersAsCollaborator,
    allMemberCommission,
    allMembers,
  ] = await Promise.all([
    AddressDeliveryModel.find(),
    AddressStorehouseModel.find(),
    // ReportHelper.getCustomers(member, $gte, $lte),
    // ReportHelper.getCollaborators(member, $gte, $lte),
    ReportHelper.getCustomersAsCollaborator(member, $gte, $lte),
    ReportHelper.getCommissionLogs(member, $gte, $lte),
    ReportHelper.getMembers(member, $gte, $lte),
  ]);

  const { allIncomeStats, allCommissionStats } = await ReportHelper.getOrdersStats(member, $gte, $lte, addressDeliverys, addressStorehouses);
  // const customersCount = customers.length;
  // const collaboratorsCount = collaborators.length;
  const totalCollaboratorsCount = customersAsCollaborator.length;
  const totalRealCommission = allMemberCommission.reduce((total: number, log: ICommissionLog) => total += log.value, 0);
  const totalMembersCount = allMembers.length;

  return {
    fromDate,
    toDate,
    totalIncome: allIncomeStats.completedOrders.sum,
    totalCollaboratorsCount,
    totalRealCommission,
    totalMembersCount,
    totalOrdersCount: allIncomeStats.allOrders.count,
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

  if (context.isMember()) {
    args.q.filter._id = context.id;
  }

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
  memberStatistics: async (root: any, args: any, context: Context) => await MemberStatistics.getLoader(root)
}

const Query = {
  getPostReportsOverview,
  getPostReports
};

export default {
  Query,
  OverviewPost
};
