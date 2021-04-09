import { ObjectId } from "mongodb";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { configs } from "../../../../configs";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { CustomerCommissionLogModel, ICustomerCommissionLog } from "../../customerCommissionLog/customerCommissionLog.model";
import { Gender, MemberLoader, MemberModel } from "../../member/member.model";
import { CustomerLoader, CustomerModel, ICustomer } from "../../customer/customer.model";
import { CollaboratorModel, ICollaborator } from "../../collaborator/collaborator.model";
import { collaboratorService } from "../../collaborator/collaborator.service";
import { isEmpty, set } from "lodash";

const getOverviewCollaboratorReport = async (
  root: any,
  args: any,
  context: Context
) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const queryInput = args.q;
  let { fromDate, toDate, memberId } = queryInput.filter;


  let $gte: Date = null,
    $lte: Date = null, $match = {}, collaboratorMatch = {};
  
  if(isEmpty(memberId)){
    delete args.q.filter.memberId;
  }

  if (fromDate) {
    fromDate = fromDate + "T00:00:00+07:00";
    $gte = new Date(fromDate);
  }

  if (toDate) {
    toDate = toDate + "T24:00:00+07:00";
    $lte = new Date(toDate);
  }


  if ($gte) {
    set($match, "createdAt.$gte", $gte);
  }

  if ($lte) {
    set($match, "createdAt.$lte", $lte);
  }

  if (context.isMember()) {
    memberId = context.id;
  }

  if (memberId) {
    set($match, "memberId", memberId);
    set(collaboratorMatch, "memberId", memberId);
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

  let fromDate = args.q.filter.fromDate ? `${args.q.filter.fromDate}` : null;
  let toDate = args.q.filter.toDate ? `${args.q.filter.toDate}` : null;

  fromDate = fromDate ? fromDate.replace("null", "") : "";
  toDate = toDate ? toDate.replace("null", "") : "";

  delete args.q.filter.fromDate;
  delete args.q.filter.toDate;
  
  if(args.q.filter.memberId === ""){
    delete args.q.filter.memberId
  }

  if (context.isMember()) {
    args.q.filter.memberId = context.id;
  }

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
  members: async (root: ICollaborator, args: any, context: Context) => {
    if (root.memberId) {
      const members = await MemberModel.find({ _id: new ObjectId(root.memberId) });
      // console.log('members', members);
      return members;
    }
    return null
  },
  memberIds: async (root: ICollaborator, args: any, context: Context) => {
    if (root.memberId) {
      const members = await MemberModel.find({ _id: new ObjectId(root.memberId) });
      // console.log('members', members);
      return members.map(m => m.id);
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

    // console.log("fromDate", fromDate);
    // console.log("toDate", toDate);

    let $gte: Date = null,
      $lte: Date = null;

    if (fromDate) {
      fromDate = fromDate + "T00:00:00+07:00";
      $gte = new Date(fromDate);
    }

    if (toDate) {
      toDate = toDate + "T24:00:00+07:00";
      $lte = new Date(toDate);
    }

    set($match, "collaboratorId", id);

    if ($gte) {
      set($match, "createdAt.$gte", $gte);
    }

    if ($lte) {
      set($match, "createdAt.$lte", $lte);
    }


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
