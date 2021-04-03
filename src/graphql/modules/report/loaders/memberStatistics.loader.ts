import { ObjectId } from "mongodb";
import { AddressDeliveryModel, IAddressDelivery } from "../../addressDelivery/addressDelivery.model";
import { AddressStorehouseModel, IAddressStorehouse } from "../../addressStorehouse/addressStorehouse.model";
import { CustomerModel } from "../../customer/customer.model";
import { IOrder, OrderModel, OrderStatus, ShipMethod } from "../../order/order.model";
import { IMember } from "../../member/member.model";
import { CommissionLogModel, ICommissionLog } from "../../commissionLog/commissionLog.model";
import { CollaboratorModel } from "../../collaborator/collaborator.model";


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
      getCustomers(member, $gte, $lte),
      getCollaborators(member, $gte, $lte),
      getCustomersAsCollaborator(member, $gte, $lte),
      getCommissionLogs(member, $gte, $lte),
    ]);

    const { allIncomeStats, allCommissionStats } = await getOrdersStats(member, $gte, $lte, addressDeliverys, addressStorehouses);
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

const getCustomers = (member: any, $gte: any, $lte: any) => {

  const $match: any = {
    "pageAccounts.memberId": member.id
  }

  if ($gte && $lte) {
    $match.createdAt = {
      $gte, $lte
    }
  }

  return CustomerModel.find($match);
}

const getCollaborators = (member: any, $gte: any, $lte: any) => {

  const $match: any = {
    memberId: member.id
  }

  if ($gte && $lte) {
    $match.createdAt = {
      $gte, $lte
    }
  }

  return CollaboratorModel.find($match);
}

const getCustomersAsCollaborator = (member: any, $gte: any, $lte: any) => {

  const $match: any = {
    "collaborators.memberId": new ObjectId(member.id),
  }

  if ($gte && $lte) {
    $match.createdAt = {
      $gte, $lte
    }
  }

  return CustomerModel.aggregate([
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
      $match
    },
  ]);
}

const getCommissionLogs = (member: any, $gte: any, $lte: any) => {
  const $match: any = {
    memberId: member.id
  }

  if ($gte && $lte) {
    $match.createdAt = {
      $gte, $lte
    }
  }

  return CommissionLogModel.find($match)
}

const getOrdersStats = async (member: any, $gte: any, $lte: any, addressDeliverys: IAddressDelivery[], addressStorehouses: IAddressStorehouse[]) => {

  const $match: any = {
    sellerId: member.id,
  }


  if ($gte && $lte) {
    $match.createdAt = {
      $gte, $lte
    }
  }

  const orders = await OrderModel.find($match);


  const allIncomeStats = getAllIncomeStats(orders);
  // const noneIncomeStats = getNoneIncomeOrderStats(orders);
  // const postIncomeStats = getPostIncomeOrderStats(orders);
  // const vnportIncomeStats = getVNPORTIncomeOrderStats(orders);


  const allCommissionStats = getAllCommissionStats(orders, addressDeliverys, addressStorehouses);
  // const noneIncomeStats = getNoneIncomeOrderStats(orders);
  // const postIncomeStats = getPostIncomeOrderStats(orders);
  // const vnportIncomeStats = getVNPORTIncomeOrderStats(orders);


  return {
    allIncomeStats,
    allCommissionStats
  }
}

// nhan hang tai bc
const getAllIncomeStats = (orders: IOrder[]) => {

  const allOrders = getOrderStats(orders);
  const pendingOrders = getOrderStats(orders.filter((o: IOrder) => o.status === OrderStatus.PENDING));
  const confirmedOrders = getOrderStats(orders.filter((o: IOrder) => o.status === OrderStatus.CONFIRMED));
  const deliveringOrders = getOrderStats(orders.filter((o: IOrder) => o.status === OrderStatus.DELIVERING));
  const estimatedOrders = getOrderStats(orders.filter((o: IOrder) => [OrderStatus.DELIVERING, OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(o.status)));
  const completedOrders = getOrderStats(orders.filter((o: IOrder) => o.status === OrderStatus.COMPLETED));
  const failureOrders = getOrderStats(orders.filter((o: IOrder) => o.status === OrderStatus.FAILURE));
  const canceledOrders = getOrderStats(orders.filter((o: IOrder) => o.status === OrderStatus.CANCELED));

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

// nhan hang tai bc
const getNoneIncomeOrderStats = async (orders: IOrder[]) => {
  return await getAllIncomeStats(orders.filter((o: IOrder) => o.shipMethod === ShipMethod.NONE));
}

// nhan hang tai bc
const getPostIncomeOrderStats = async (orders: IOrder[]) => {
  return await getAllIncomeStats(orders.filter((o: IOrder) => o.shipMethod === ShipMethod.POST));
}

// giao hang tai dia chi
const getVNPORTIncomeOrderStats = async (orders: IOrder[]) => {
  return await getAllIncomeStats(orders.filter((o: IOrder) => o.shipMethod === ShipMethod.VNPOST));
}


const getOrderStats = (orders: IOrder[]) => {
  const count = orders.length;
  const sum = count > 0 ? orders.reduce((total: number, o: IOrder) => total += o.amount, 0) : 0;
  return {
    count,
    sum,
  }
}


const getAllCommissionStats = (orders: IOrder[], addressDeliverys: IAddressDelivery[], addressStorehouses: IAddressStorehouse[]) => {
  const pendingFilteredOrders = orders.filter((o: IOrder) => o.status === OrderStatus.PENDING);
  const confirmedFilteredOrders = orders.filter((o: IOrder) => o.status === OrderStatus.CONFIRMED);
  const deliveringFilteredOrders = orders.filter((o: IOrder) => o.status === OrderStatus.DELIVERING)
  const estimatedFilteredOrders = orders.filter((o: IOrder) => [OrderStatus.DELIVERING, OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(o.status))
  const completedFilteredOrders = orders.filter((o: IOrder) => o.status === OrderStatus.COMPLETED)
  const failureFilteredOrders = orders.filter((o: IOrder) => o.status === OrderStatus.FAILURE)
  const canceledFilteredOrders = orders.filter((o: IOrder) => o.status === OrderStatus.CANCELED)
  const allOrders = getCommissionStats(orders, addressDeliverys, addressStorehouses);
  const pendingOrders = getCommissionStats(pendingFilteredOrders, addressDeliverys, addressStorehouses);
  const confirmedOrders = getCommissionStats(confirmedFilteredOrders, addressDeliverys, addressStorehouses);
  const deliveringOrders = getCommissionStats(deliveringFilteredOrders, addressDeliverys, addressStorehouses);
  const estimatedOrders = getCommissionStats(estimatedFilteredOrders, addressDeliverys, addressStorehouses);
  const completedOrders = getCommissionStats(completedFilteredOrders, addressDeliverys, addressStorehouses);
  const failureOrders = getCommissionStats(failureFilteredOrders, addressDeliverys, addressStorehouses);
  const canceledOrders = getCommissionStats(canceledFilteredOrders, addressDeliverys, addressStorehouses);

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

const getCommissionStats = (orders: IOrder[], addressDeliverys: IAddressDelivery[], addressStorehouses: IAddressStorehouse[]) => {
  const count = orders.length;
  const totalCommission1 = count > 0 ? getCommission1FromOrder(orders) : 0;
  const totalCommission2 = count > 0 ? getCommission2FromOrder(orders) : 0;
  const totalCommission3 = count > 0 ? getCommission3FromOrder(orders, addressDeliverys, addressStorehouses) : 0;
  const totalCommission = totalCommission1 + totalCommission2 + totalCommission3;
  return {
    totalCommission1,
    totalCommission2,
    totalCommission3,
    totalCommission
  }
}

const getCommission1FromOrder = (orders: IOrder[]) => {
  return orders.reduce((total: number, o: IOrder) => total += o.commission1, 0);
}

const getCommission2FromOrder = (orders: IOrder[]) => {
  const memberOrders: any = orders.filter((order: IOrder) => !order.collaboratorId);
  return memberOrders.reduce((total: number, o: IOrder) => total += o.commission2, 0);
}

const getCommission3FromOrder = (orders: IOrder[], addressDeliverys: IAddressDelivery[], addressStorehouses: IAddressStorehouse[]) => {
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

