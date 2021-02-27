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

export const payMobifoneCommission = async ({ type, commission, id }: any) => {
  // làm cùng lúc log và cập nhật số dư
  return await commissionMobifoneLogService.payOneCommission({
    type,
    commission,
    id,
  });
};

export const payCommission = async ({
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

export const payCustomerCommission = async ({
  customerId,
  memberId,
  currentCommission,
  type,
  commission,
  id,
}: any) => {
  const commissionLoging = customerCommissionLogService.payOneCommission({
    customerId,
    memberId,
    type,
    commission,
    id,
  });

  const customerUpdating = customerService.increaseCommissions({
    customerId,
    commission,
    currentCommission,
  });

  // làm cùng lúc log và cập nhật số dư
  return await Promise.all([commissionLoging, customerUpdating]);
};

export const payCustomerPoint = async ({
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
export const paySellerPoint = async ({
  sellerId,
  id,
  type,
  sellerBonusPoint,
}: any) => {
  const member = await MemberModel.findById(sellerId);
  if (!member) throw ErrorHelper.mgRecoredNotFound("thành viên");
  console.log("paysellerpoint", sellerId, id, type, sellerBonusPoint);

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
