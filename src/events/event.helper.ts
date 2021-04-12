import { commissionLogService } from "../graphql/modules/commissionLog/commissionLog.service";
import { commissionMobifoneLogService } from "../graphql/modules/commissionMobifoneLog/commissionMobifoneLog.service";
import { MemberModel } from "../graphql/modules/member/member.model";
import { memberService } from "../graphql/modules/member/member.service";
import { customerPointLogService } from "../graphql/modules/customerPointLog/customerPointLog.service";
import { cumulativePointLogService } from "../graphql/modules/cumulativePointLog/cumulativePointLog.service";
import { ErrorHelper } from "../helpers/error.helper";
import { CustomerModel } from "../graphql/modules/customer/customer.model";
import { customerService } from "../graphql/modules/customer/customer.service";
import { customerCommissionLogService } from "../graphql/modules/customerCommissionLog/customerCommissionLog.service";

export class EventHelper {
  constructor(public event: any) { }

  static payMobifoneCommission = async ({ type, commission, id }: any) => {
    // làm cùng lúc log và cập nhật số dư
    return await commissionMobifoneLogService.payOneCommission({
      type,
      commission,
      id,
    });
  };

  static payCommission = async ({
    memberId,
    currentCommission,
    type,
    commission,
    id,
  }: any) => {
    const commissionLoging = commissionLogService.payOneCommission({
      memberId,
      type,
      commission,
      id,
    });

    const memberUpdating = memberService.increaseCommissions({
      memberId,
      commission,
      currentCommission,
    });

    // làm cùng lúc log và cập nhật số dư
    return await Promise.all([commissionLoging, memberUpdating]);
  };

  static payCollaboratorCommission = async ({
    customerId,
    memberId,
    currentCommission,
    commission,
    collaboratorId,
    id,
  }: any) => {

    const commissionLoging = await customerCommissionLogService.payCustomerCommission({
      customerId,
      memberId,
      commission,
      collaboratorId,
      id,
    });

    const customerUpdating = await customerService.increaseCommissions({
      customerId,
      commission,
      currentCommission,
    });

    // làm cùng lúc log và cập nhật số dư
    return [commissionLoging, customerUpdating];
  };

  static payCustomerPoint = async ({
    customerId,
    id,
    type,
    buyerBonusPoint,
  }: any) => {
    const customer = await CustomerModel.findById(customerId);
    if (!customer) throw ErrorHelper.mgRecoredNotFound("khách hàng");

    //ghi log
    const pointLoging = customerPointLogService.payBonusPoint({
      customerId: customer._id,
      type,
      id,
      value: buyerBonusPoint,
    });

    // cap nhat diem thuong ben customer
    const customerUpdating = customerService.increasePoint({
      customerId: customer._id,
      currentCumulativePoint: customer.cumulativePoint,
      cumulativePoint: buyerBonusPoint,
    });

    return await Promise.all([pointLoging, customerUpdating]);
  };

  // memberId, type, id, value, fromMemberId
  static paySellerPoint = async ({
    sellerId,
    id,
    type,
    sellerBonusPoint,
  }: any) => {
    const member = await MemberModel.findById(sellerId);
    if (!member) throw ErrorHelper.mgRecoredNotFound("thành viên");
    
    const pointLoging = cumulativePointLogService.payBonusPoint({
      memberId: sellerId,
      type,
      id,
      value: sellerBonusPoint,
    });

    // cap nhat diem thuong shopper
    const memberUpdating = memberService.increasePoint({
      memberId: member._id,
      currentCumulativePoint: member.cumulativePoint,
      cumulativePoint: sellerBonusPoint,
    });

    return await Promise.all([pointLoging, memberUpdating]);
  };

}