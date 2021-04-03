import { ObjectId } from "mongodb";
import { AddressDeliveryModel, IAddressDelivery } from "../../addressDelivery/addressDelivery.model";
import { AddressStorehouseModel, IAddressStorehouse } from "../../addressStorehouse/addressStorehouse.model";
import { CustomerModel } from "../../customer/customer.model";
import { IOrder, OrderModel, OrderStatus, ShipMethod } from "../../order/order.model";
import { IMember } from "../../member/member.model";
import { CommissionLogModel, ICommissionLog } from "../../commissionLog/commissionLog.model";
import { CollaboratorModel } from "../../collaborator/collaborator.model";
import { ReportHelper } from "../report.helper";


export class MemberStatistics {
  fromDate: string
  toDate: string
  customersCount: number = 0;
  collaboratorsCount: number = 0;
  customersAsCollaboratorCount: number = 0;
  ordersCount: number = 0;
  pendingCount: number = 0;
  confirmedCount: number = 0;
  deliveringCount: number = 0;
  completedCount: number = 0;
  failureCount: number = 0;
  canceledCount: number = 0;
  estimatedCommission: number = 0;
  realCommission: number = 0;
  estimatedIncome: number = 0;
  income: number = 0;

  static async getLoader(member: IMember) {
    let { id, fromDate, toDate } = member;

    let $gte: Date = null,
      $lte: Date = null;

    if (fromDate && toDate) {
      fromDate = fromDate + "T00:00:00+07:00";
      toDate = toDate + "T24:00:00+07:00";
      $gte = new Date(fromDate);
      $lte = new Date(toDate);
    }

    const [
      addressDeliverys,
      addressStorehouses,
      customers,
      collaborators,
      customersAsCollaborator,
      allMemberCommission
    ] = await Promise.all([
      AddressDeliveryModel.find(),
      AddressStorehouseModel.find(),
      ReportHelper.getCustomers(member, $gte, $lte),
      ReportHelper.getCollaborators(member, $gte, $lte),
      ReportHelper.getCustomersAsCollaborator(member, $gte, $lte),
      ReportHelper.getCommissionLogs(member, $gte, $lte),
    ]);

    const { allIncomeStats, allCommissionStats } = await ReportHelper.getOrdersStats(member, $gte, $lte, addressDeliverys, addressStorehouses);
    const customersCount = customers.length;
    const collaboratorsCount = collaborators.length;
    const customersAsCollaboratorCount = customersAsCollaborator.length;
    const totalCommission = allMemberCommission.reduce((total: number, log: ICommissionLog) => total += log.value, 0);

    return {
      fromDate,
      toDate,
      customersCount,
      collaboratorsCount,
      customersAsCollaboratorCount,
      ordersCount: allIncomeStats.allOrders.count,
      pendingCount: allIncomeStats.pendingOrders.count,
      confirmedCount: allIncomeStats.confirmedOrders.count,
      deliveringCount: allIncomeStats.deliveringOrders.count,
      completedCount: allIncomeStats.completedOrders.count,
      failureCount: allIncomeStats.failureOrders.count,
      canceledCount: allIncomeStats.canceledOrders.count,
      estimatedCommission: allCommissionStats.estimatedOrders.totalCommission,
      realCommission: totalCommission,
      estimatedIncome: allIncomeStats.estimatedOrders.sum,
      income: allIncomeStats.completedOrders.sum,
    }
  }
}