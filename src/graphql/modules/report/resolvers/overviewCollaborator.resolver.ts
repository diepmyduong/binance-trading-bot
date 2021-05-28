import { get, set } from "lodash";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";

import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, UtilsHelper } from "../../../../helpers";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { Context } from "../../../context";
import { CollaboratorModel, ICollaborator } from "../../collaborator/collaborator.model";
import { collaboratorService } from "../../collaborator/collaborator.service";
import { CustomerModel } from "../../customer/customer.model";
import {
  CustomerCommissionLogModel,
  ICustomerCommissionLog,
} from "../../customerCommissionLog/customerCommissionLog.model";
import { Gender, MemberLoader, MemberModel } from "../../member/member.model";

const getOverviewCollaboratorReport = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const filter = get(args, "q.filter", {});
  const $match: any = await getMatch(filter, context);
  const collaboratorCount = await countCollaborator(filter, context);
  const query: any = [
    { $match: $match },
    {
      $group: {
        _id: null,
        value: { $sum: "$value" },
      },
    },
  ];
  const commission = await CustomerCommissionLogModel.aggregate(query).then((res) =>
    get(res, "0.value", 0)
  );

  return {
    commission: commission,
    collaboratorCount: collaboratorCount,
  };
};

const getFilteredCollaborators = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  let { memberId, branchId } = get(args, "q.filter", {});
  const $match: any = {};
  if (memberId) set($match, "memberId", memberId);
  if (context.isMember()) set($match, "memberId", memberId);
  if (branchId) {
    const memberIds = await MemberModel.find({ branchId, activated: true })
      .select("_id")
      .then((res) => res.map((r) => r._id));
    set($match, "memberId.$in", memberIds);
  }
  set(args, "q.filter", $match);
  return await collaboratorService.fetch(args.q);
};

const FilteredCollaborator = {
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),
  members: async (root: ICollaborator, args: any, context: Context) => {
    if (root.memberId) {
      const members = await MemberModel.find({ _id: new ObjectId(root.memberId), activated: true });
      // console.log('members', members);
      return members;
    }
    return null;
  },

  customer: async (root: ICollaborator, args: any, context: Context) => {
    if (root.memberId) {
      const member = await MemberModel.findById(root.memberId);
      let customer: any = await CustomerModel.findById(root.customerId);

      if (customer) {
        customer.name = customer.name + " - " + member.shopName;
      } else {
        customer = {
          code: root.code,
          name: root.name + " - Chưa có Bưu cục",
          facebookName: root.name,
          uid: root.code,
          phone: root.phone,
          password: "1234",
          avatar: "1234",
          gender: Gender.OTHER, // Giới tính
          birthday: new Date(), // Ngày sinh
          address: "test", // Địa chỉ
          province: "test", // Tỉnh / thành
          district: "test", // Quận / huyện
          ward: "test", // Phường / xã
          provinceId: "test", // Mã Tỉnh / thành
          districtId: "test", // Mã Quận / huyện
          wardId: "test", // Mã Phường / xã
          cumulativePoint: 0, // Điểm tích lũy
          commission: 0, // Hoa hồng cộng tác viên
          pageAccounts: [], // Danh sách account facebook của người dùng
          latitude: 0,
          longitude: 0,
        };
      }

      return customer;
    }
    return null;
  },

  total: async (root: ICollaborator, args: any, context: Context) => {
    let { id, fromDate, toDate } = root;

    let $match = {};

    const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

    if ($gte) {
      set($match, "createdAt.$gte", $gte);
    }

    if ($lte) {
      set($match, "createdAt.$lte", $lte);
    }

    set($match, "collaboratorId", id);

    const customerCommissionLog = await CustomerCommissionLogModel.find($match);
    const count = customerCommissionLog.length;

    return count > 0
      ? customerCommissionLog.reduce(
          (total: number, o: ICustomerCommissionLog) => (total += o.value),
          0
        )
      : 0;
  },
};

const Query = {
  getFilteredCollaborators,
  getOverviewCollaboratorReport,
};
export default { Query, FilteredCollaborator };
async function countCollaborator(filter: any = {}, context: Context) {
  const { memberId, branchId } = filter;
  const collaboratorMatch: any = {};
  if (memberId) set(collaboratorMatch, "memberId", memberId);
  if (context.isMember()) set(collaboratorMatch, "memberId", context.id);
  if (branchId) {
    const memberIds = await MemberModel.find({ branchId, activated: true })
      .select("_id")
      .then((res) => res.map((r) => r._id));
    set(collaboratorMatch, "memberId.$in", memberIds);
  }
  const collaboratorCount = await CollaboratorModel.count(collaboratorMatch);
  return collaboratorCount;
}

async function getMatch(filter: any = {}, context: Context) {
  let { fromDate, toDate, memberId, branchId } = filter;
  const $match: any = {};
  const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);
  if ($gte) set($match, "createdAt.$gte", $gte);
  if ($lte) set($match, "createdAt.$lte", $lte);
  if (memberId) set($match, "memberId", Types.ObjectId(memberId));
  if (context.isMember()) set($match, "memberId", Types.ObjectId(context.id));
  if (branchId) {
    const memberIds = await MemberModel.find({ branchId, activated: true })
      .select("_id")
      .then((res) => res.map((r) => r._id));
    set($match, "memberId.$in", memberIds);
  }
  return $match;
}
