import { ObjectId } from "mongodb";
import _, { set } from "lodash";
import path from "path";
import { ListReports, Report } from "../../../helpers/report/report";
import { UtilsHelper } from "../../../helpers/utils.helper";
import { IAddressDelivery } from "../addressDelivery/addressDelivery.model";
import { IAddressStorehouse } from "../addressStorehouse/addressStorehouse.model";
import { CollaboratorModel } from "../collaborator/collaborator.model";
import { CustomerModel } from "../customer/customer.model";
import { IOrder, OrderModel, OrderStatus, ShipMethod } from "../order/order.model";
import { CommissionLogModel } from "../commissionLog/commissionLog.model";
import { MemberModel, MemberType } from "../member/member.model";
import { IOrderLog, OrderLogModel } from "../orderLog/orderLog.model";

export class ReportHelper {

  constructor() {
  }

  static getReportCodes() {
    return _.chain(ListReports)
      .filter((r) => !r.hidden)
      .orderBy(["priority"])
      .reverse()
      .map((r) => ({
        code: r.code,
        title: r.title,
        requireFilter: r.requireFilter,
        filters: r.filters,
      }))
      .value();
  }

  static getReport(code: string) {
    return ListReports.find((r) => r.code == code);
  }


  static getCustomers = (member: any, $gte: any, $lte: any) => {

    const $match: any = {}

    if (member) {
      set($match, "pageAccounts.memberId", member.id);
    }

    // if ($gte) {
    //   set($match, "createdAt.$gte", $gte);
    // }

    // if ($lte) {
    //   set($match, "createdAt.$lte", $lte);
    // }

    return CustomerModel.find($match);
  }

  static getCollaborators = (member: any, $gte: any, $lte: any) => {

    const $match: any = {}

    if (member) {
      set($match, "memberId", member.id);
    }

    // if ($gte) {
    //   set($match, "createdAt.$gte", $gte);
    // }

    // if ($lte) {
    //   set($match, "createdAt.$lte", $lte);
    // }

    return CollaboratorModel.find($match);
  }

  static getCustomersAsCollaborator = async (member: any, $gte: any, $lte: any) => {
    const $match: any = { customerId: { $exists: true } }

    if (member) {
      set($match, "memberId", member.id);
    }

    const result = await CollaboratorModel.find($match);
    return result;
  }

  static getMembers = (member: any, $gte: any, $lte: any) => {

    const $match: any = {};

    if (member) {
      set($match, "_id", new ObjectId(member.id));
    }

    // if ($gte) {
    //   set($match, "createdAt.$gte", $gte);
    // }

    // if ($lte) {
    //   set($match, "createdAt.$lte", $lte);
    // }

    // console.log("member", $match);
    return MemberModel.aggregate([{ $match }])
  }

  static getCommissionLogs = (member: any, $gte: any, $lte: any) => {

    const $match: any = {}

    if (member) {
      set($match, "memberId", member.id);
    }

    if ($gte) {
      set($match, "createdAt.$gte", $gte);
    }

    if ($lte) {
      set($match, "createdAt.$lte", $lte);
    }

    // console.log("$match", $match);

    return CommissionLogModel.find($match)
  }

  static getOrdersStats = async (member: any, $gte: any, $lte: any, addressDeliverys: IAddressDelivery[], addressStorehouses: IAddressStorehouse[]) => {

    const $match: any = {}
    const $logMatch: any = {}

    if (member) {
      set($match, "sellerId", member.id);
      set($logMatch, "memberId", member.id);
    }

    if ($gte) {
      set($match, "createdAt.$gte", $gte);
      set($logMatch, "createdAt.$gte", $gte);
    }

    if ($lte) {
      set($match, "createdAt.$lte", $lte);
      set($logMatch, "createdAt.$lte", $lte);
    }

    console.log("getOrdersStats $match", $match);
    console.log("getOrdersStats $logMatch", $logMatch);

    const orderLogs = await OrderLogModel.find($logMatch);
    const allIncomeStats = await ReportHelper.getAllIncomeStats(orderLogs);
    // const noneIncomeStats = getNoneIncomeOrderStats(orders);
    // const postIncomeStats = getPostIncomeOrderStats(orders);
    // const vnportIncomeStats = getVNPORTIncomeOrderStats(orders);

    const allCommissionStats = await ReportHelper.getAllCommissionStats(orderLogs, addressDeliverys, addressStorehouses);
    // const noneIncomeStats = getNoneIncomeOrderStats(orders);
    // const postIncomeStats = getPostIncomeOrderStats(orders);
    // const vnportIncomeStats = getVNPORTIncomeOrderStats(orders);

    return {
      allIncomeStats,
      allCommissionStats
    }
  }

  // nhan hang tai bc
  static getAllIncomeStats = async (orderLogs: IOrderLog[]) => {

    const [allOrders,
      pendingOrders,
      confirmedOrders,
      deliveringOrders,
      estimatedOrders,
      completedOrders,
      failureOrders,
      canceledOrders] = await Promise.all([
        ReportHelper.getOrderStats(orderLogs),
        ReportHelper.getOrderStats(orderLogs.filter((o: IOrderLog) => o.orderStatus === OrderStatus.PENDING)),
        ReportHelper.getOrderStats(orderLogs.filter((o: IOrderLog) => o.orderStatus === OrderStatus.CONFIRMED)),
        ReportHelper.getOrderStats(orderLogs.filter((o: IOrderLog) => o.orderStatus === OrderStatus.DELIVERING)),
        ReportHelper.getOrderStats(orderLogs.filter((o: IOrderLog) => [OrderStatus.DELIVERING, OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(o.orderStatus))),
        ReportHelper.getOrderStats(orderLogs.filter((o: IOrderLog) => o.orderStatus === OrderStatus.COMPLETED)),
        ReportHelper.getOrderStats(orderLogs.filter((o: IOrderLog) => o.orderStatus === OrderStatus.FAILURE)),
        ReportHelper.getOrderStats(orderLogs.filter((o: IOrderLog) => o.orderStatus === OrderStatus.CANCELED))
      ]);


    return {
      allOrders,
      pendingOrders,
      confirmedOrders,
      deliveringOrders,
      estimatedOrders,
      completedOrders,
      failureOrders,
      canceledOrders,
    }
  };

  // nhan hang tai bc
  // static getNoneIncomeOrderStats = (orders: IOrder[]) => {
  //   return ReportHelper.getAllIncomeStats(orders.filter((o: IOrder) => o.shipMethod === ShipMethod.NONE));
  // }

  // // nhan hang tai bc
  // static getPostIncomeOrderStats = (orders: IOrder[]) => {
  //   return ReportHelper.getAllIncomeStats(orders.filter((o: IOrder) => o.shipMethod === ShipMethod.POST));
  // }

  // // giao hang tai dia chi
  // static getVNPORTIncomeOrderStats = (orders: IOrder[]) => {
  //   return ReportHelper.getAllIncomeStats(orders.filter((o: IOrder) => o.shipMethod === ShipMethod.VNPOST));
  // }


  static getOrderStats = async (orderLogs: IOrderLog[]) => {
    const orderIds = orderLogs.length > 0 ? orderLogs.map(o => new ObjectId(o.orderId)) : [];
    // console.log("orderIds", orderIds);
    const orders = await OrderModel.find({ _id: { $in: orderIds } });
    // console.log("orders", orders.length);
    const count = orders.length;
    const sum = count > 0 ? orders.reduce((total: number, o: IOrder) => total += o.amount, 0) : 0;
    return {
      count,
      sum,
    }
  }


  static getAllCommissionStats = async (orderLogs: IOrderLog[], addressDeliverys: IAddressDelivery[], addressStorehouses: IAddressStorehouse[]) => {

    const pendingFilteredOrderLogs = orderLogs.filter((o: IOrderLog) => o.orderStatus === OrderStatus.PENDING);
    const confirmedFilteredOrderLogs = orderLogs.filter((o: IOrderLog) => o.orderStatus === OrderStatus.CONFIRMED);
    const deliveringFilteredOrderLogs = orderLogs.filter((o: IOrderLog) => o.orderStatus === OrderStatus.DELIVERING)
    const estimatedFilteredOrderLogs = orderLogs.filter((o: IOrderLog) => [OrderStatus.DELIVERING, OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(o.orderStatus))
    const completedFilteredOrderLogs = orderLogs.filter((o: IOrderLog) => o.orderStatus === OrderStatus.COMPLETED)
    const failureFilteredOrderLogs = orderLogs.filter((o: IOrderLog) => o.orderStatus === OrderStatus.FAILURE)
    const canceledFilteredOrderLogs = orderLogs.filter((o: IOrderLog) => o.orderStatus === OrderStatus.CANCELED)


    const [
      allOrders,
      pendingOrders,
      confirmedOrders,
      deliveringOrders,
      estimatedOrders,
      completedOrders,
      failureOrders,
      canceledOrders,
    ] = await Promise.all([
      ReportHelper.getCommissionStats(orderLogs, addressDeliverys, addressStorehouses),
      ReportHelper.getCommissionStats(pendingFilteredOrderLogs, addressDeliverys, addressStorehouses),
      ReportHelper.getCommissionStats(confirmedFilteredOrderLogs, addressDeliverys, addressStorehouses),
      ReportHelper.getCommissionStats(deliveringFilteredOrderLogs, addressDeliverys, addressStorehouses),
      ReportHelper.getCommissionStats(estimatedFilteredOrderLogs, addressDeliverys, addressStorehouses),
      ReportHelper.getCommissionStats(completedFilteredOrderLogs, addressDeliverys, addressStorehouses),
      ReportHelper.getCommissionStats(failureFilteredOrderLogs, addressDeliverys, addressStorehouses),
      ReportHelper.getCommissionStats(canceledFilteredOrderLogs, addressDeliverys, addressStorehouses),
    ]);

    return {
      allOrders,
      pendingOrders,
      confirmedOrders,
      deliveringOrders,
      estimatedOrders,
      completedOrders,
      failureOrders,
      canceledOrders,
    }
  }

  static getCommissionStats = async (orderLogs: IOrderLog[], addressDeliverys: IAddressDelivery[], addressStorehouses: IAddressStorehouse[]) => {
    const orderIds = orderLogs.map(o => new ObjectId(o.orderId));
    // console.log("orderIds", orderIds);
    const orders = await OrderModel.find({ _id: { $in: orderIds } });

    const count = orderIds.length;

    const totalCommission1 = count > 0 ? ReportHelper.getCommission1FromOrder(orders) : 0;
    const totalCommission2 = count > 0 ? ReportHelper.getCommission2FromOrder(orders) : 0;
    const totalCommission3 = count > 0 ? ReportHelper.getCommission3FromOrder(orders, addressDeliverys, addressStorehouses) : 0;
    const totalCommission = totalCommission1 + totalCommission2 + totalCommission3;
    return {
      totalCommission1,
      totalCommission2,
      totalCommission3,
      totalCommission
    }
  }

  static getCommission1FromOrder = (orders: IOrder[]) => {
    return orders.reduce((total: number, o: IOrder) => total += o.commission1, 0);
  }

  static getCommission2FromOrder = (orders: IOrder[]) => {
    const memberOrders: any = orders.filter((order: IOrder) => !order.collaboratorId);
    return memberOrders.reduce((total: number, o: IOrder) => total += o.commission2, 0);
  }

  static getCommission3FromOrder = (orders: IOrder[], addressDeliverys: IAddressDelivery[], addressStorehouses: IAddressStorehouse[]) => {
    const memberOrders: IOrder[] = [];

    for (const order of orders) {
      if (order.addressDeliveryId) {
        const addressDelivery = addressDeliverys.find(addr => addr.id.toString() === order.addressDeliveryId.toString());
        if (addressDelivery) {
          if (addressDelivery.code === order.sellerCode) {
            memberOrders.push(order);
          }
        }
      }
      if (order.addressStorehouseId) {
        const addressStorehouse = addressStorehouses.find(addr => addr.id.toString() === order.addressStorehouseId.toString());
        if (addressStorehouse) {
          if (addressStorehouse.code === order.sellerCode) {
            memberOrders.push(order);
          }
        }
      }
    }

    return memberOrders.reduce((total: number, o: IOrder) => total += o.commission3 ? o.commission3 : 0, 0);
  }

}

export const reportHelper = new ReportHelper();
