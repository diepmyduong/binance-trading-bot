import { ObjectId } from "mongodb";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { CustomerCommissionLogModel, ICustomerCommissionLog } from "../../customerCommissionLog/customerCommissionLog.model";
import { Gender, MemberLoader, MemberModel } from "../../member/member.model";
import { CustomerModel } from "../../customer/customer.model";
import { CollaboratorModel, ICollaborator } from "../../collaborator/collaborator.model";
import { collaboratorService } from "../../collaborator/collaborator.service";
import { isEmpty, set } from "lodash";
import { Types } from "mongoose";

const resolveArgs = (args: any) => {
  delete args.q.filter.fromDate;
  delete args.q.filter.toDate;
  delete args.q.filter.branchId;
  if (args.q.filter.memberId === "") {
    delete args.q.filter.memberId
  }
}


const getOverviewCollaboratorReport = async (
  root: any,
  args: any,
  context: Context
) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const queryInput = args.q;
  let { fromDate, toDate, memberId, branchId } = queryInput.filter;


  let $match = {}, collaboratorMatch = {};

  if (isEmpty(memberId)) {
    delete args.q.filter.memberId;
  }

  const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

  if ($gte) {
    set($match, "createdAt.$gte", $gte);
  }

  if ($lte) {
    set($match, "createdAt.$lte", $lte);
  }

  if (context.isMember()) {
    set($match, "memberId.$in", [new ObjectId(context.id)]);
    set(collaboratorMatch, "memberId.$in", [new ObjectId(context.id)]);
  }
  else {
    if (branchId) {
      const members = await MemberModel.find({ branchId, activated: true }).select("_id");
      const memberIds = members.map(m => m.id);
      set($match, "memberId.$in", memberIds.map(Types.ObjectId));
      set(collaboratorMatch, "memberId.$in", memberIds.map(Types.ObjectId));
    }
    else {
      if (memberId) {
        set($match, "memberId.$in", [new ObjectId(context.id)]);
        set(collaboratorMatch, "memberId.$in", [new ObjectId(context.id)]);
      }
    }
  }

  const collaborators = await CollaboratorModel.find(collaboratorMatch);
  const collaboratorCount = collaborators.length;

  const customerCommissionLog = await CustomerCommissionLogModel.find($match);
  const count = customerCommissionLog.length;

  return {
    commission: count > 0 ? customerCommissionLog.reduce((total: number, o: ICustomerCommissionLog) => total += o.value, 0) : 0,
    collaboratorCount,
  };
};

const getFilteredCollaborators = async (
  root: any,
  args: any,
  context: Context
) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);

  const queryInput = args.q;
  let { fromDate, toDate, memberId, branchId } = queryInput.filter;

  fromDate = fromDate ? fromDate.replace("null", "") : "";
  toDate = toDate ? toDate.replace("null", "") : "";

  if (context.isMember()) {
    set(args, "q.filter.memberId.$in", [new ObjectId(context.id)]);
  }
  else {
    if (branchId) {
      const members = await MemberModel.find({ branchId, activated: true }).select("_id");
      const memberIds = members.map(m => m.id);
      set(args, "q.filter.memberId.$in", memberIds.map(Types.ObjectId));
    }
    else {
      if (memberId) {
        set(args, "q.filter.memberId.$in", [new ObjectId(memberId)]); 
      }
    }
  }
  resolveArgs(args);
  // console.log('args',args);


  // console.log('args.q', args.q);

  const result = await collaboratorService.fetch(args.q);
  const collaborators = result.data;
  for (let i = 0; i < collaborators.length; i++) {
    set(collaborators[i], "fromDate", fromDate);
    set(collaborators[i], "toDate", toDate);
  }
  result.data = collaborators;

  return result;
};


const FilteredCollaborator = {
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),
  members: async (root: ICollaborator, args: any, context: Context) => {
    if (root.memberId) {
      const members = await MemberModel.find({ _id: new ObjectId(root.memberId), activated: true });
      // console.log('members', members);
      return members;
    }
    return null
  },

  customer: async (root: ICollaborator, args: any, context: Context) => {
    if (root.memberId) {
      const member = await MemberModel.findById(root.memberId);
      let customer: any = await CustomerModel.findById(root.customerId);

      if (customer) {
        customer.name = customer.name + " - " + member.shopName;
      }
      else {
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
          province: "test",  // Tỉnh / thành
          district: "test", // Quận / huyện
          ward: "test", // Phường / xã
          provinceId: "test",  // Mã Tỉnh / thành
          districtId: "test",// Mã Quận / huyện
          wardId: "test",// Mã Phường / xã
          cumulativePoint: 0,// Điểm tích lũy
          commission: 0,// Hoa hồng cộng tác viên
          pageAccounts: [],// Danh sách account facebook của người dùng
          latitude: 0,
          longitude: 0
        }
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

    set($match, "collaboratorId", new ObjectId(id));

    // console.log('$match',$match);

    const customerCommissionLog = await CustomerCommissionLogModel.find($match);
    const count = customerCommissionLog.length;

    return count > 0 ? customerCommissionLog.reduce((total: number, o: ICustomerCommissionLog) => total += o.value, 0) : 0;
  }
};


const Query = {
  getFilteredCollaborators,
  getOverviewCollaboratorReport
};
export default { Query, FilteredCollaborator };
