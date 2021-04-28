import { ObjectId } from "mongodb";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { CustomerCommissionLogModel, ICustomerCommissionLog } from "../../customerCommissionLog/customerCommissionLog.model";
import { Gender, MemberLoader, MemberModel } from "../../member/member.model";
import { CustomerModel } from "../../customer/customer.model";
import { CollaboratorLoader, ICollaborator } from "../../collaborator/collaborator.model";
import { collaboratorService } from "../../collaborator/collaborator.service";
import { isEmpty, set } from "lodash";
import { Types } from "mongoose";
import { collaboratorProductService } from "../../collaboratorProduct/collaboratorProduct.service";
import { ProductLoader } from "../../product/product.model";
import { ICollaboratorProduct } from "../../collaboratorProduct/collaboratorProduct.model";
import { MediaProductStats } from "../loaders/mediaProductStats.loader";
import { MediaCollaboratorStats } from "../loaders/mediaCollaboratorStats.loader";
import { MediaProductsStats } from "../loaders/mediaProductsStats.loader";


const resolveArgs = (args: any) => {
  delete args.q.filter.branchId;
}

const getOverviewAllCollaboratorProducts = async (
  root: any,
  args: any,
  context: Context
) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  
  //Tổng lượt share - like - comment - click - tổng số lượng sp đặt hàng thành công


  return {
    shareCount: 0,
    likeCount:0,
    commentCount:0,
    completedQty: 0,
  }
};


const getOverviewAllCollaborators = async (
  root: any,
  args: any,
  context: Context
) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  
  //CTV : Tổng lượt share - like - comment - click - tổng lượng ctv


  return {
    shareCount: 0,
    likeCount:0,
    commentCount:0,
    collaboratorCount:0
  }
};


const getTopMediaCollaboratorProducts = async (
  root: any,
  args: any,
  context: Context
) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  
  //CTV : Tổng lượt share - like - comment - click - tổng lượng ctv
  const mostLikeProducts:any = [];
  const mostShareProducts:any = [];
  const mostCommentProducts:any = [];
  const mostViewProducts:any = [];

  return {
    mostLikeProducts,
    mostShareProducts,
    mostCommentProducts,
    mostViewProducts,
  }
};


const getTopMediaCollaborators = async (
  root: any,
  args: any,
  context: Context
) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  
  //CTV : Tổng lượt share - like - comment - click - tổng lượng ctv

  const mostLikeCollaborators:any = [];
  const mostShareCollaborators:any = [];
  const mostCommentCollaborators:any = [];
  const mostViewCollaborators:any = [];

  return {
    mostLikeCollaborators,
    mostShareCollaborators,
    mostCommentCollaborators,
    mostViewCollaborators,
  }
};

//CTV - đường link - lựợt click - lượt like - lượt share - lượt comment - tổng like SP - Tổng share SP - Tổng coment SP - tổng SP - tổng lượng sp đặt hàng thành công
const getCollaboratorsMediaReports = async (root: any,args: any,context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const { branchId, memberIds } = args.q.filter;
  if (context.isMember()) {
    set(args.q.filter, "sellerId.$in", [context.id]);
  }
  else {
    if (branchId) {
      const members = await MemberModel.find({ branchId, activated: true }).select("_id");
      const memberIds = members.map(m => m.id);
      set(args.q.filter, "memberIds.$in", memberIds.map(Types.ObjectId));
    }
    else {
      if (memberIds) {
        if (memberIds.length > 0) {
          set(args.q.filter, "memberIds.$in", memberIds.map(Types.ObjectId));
        }
      }
    }
  }

  resolveArgs(args);
  return await collaboratorService.fetch(args.q);
};

//sản phẩm - CTV - đường link - lựợt click - lượt like - lượt share - lượt comment - lượng đặt hàng thành công
const getProductsMediaReports = async(root: any,args: any,context: Context)=>{
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  return collaboratorProductService.fetch(args.q);
}

const MediaProduct = {
  collaborator: GraphQLHelper.loadById(CollaboratorLoader, "collaboratorId"),
  product: GraphQLHelper.loadById(ProductLoader, "productId"),
  mediaProductStats: async (root: ICollaboratorProduct, args: any, context: Context) => {
    return MediaProductStats.getLoader(args).load(root.id);
  }
}

const MediaCollaborator = {
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),

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
    const { fromDate, toDate } = args;

    let { id } = root;

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

    return count > 0 ? customerCommissionLog.reduce((total: number, o: ICustomerCommissionLog) => total += o.value, 0) : 0;
  },

  mediaCollaboratorStats: async (root: ICollaborator, args: any, context: Context) => {
    return MediaCollaboratorStats.getLoader(args).load(root.id);
  },

  allMediaProductsStats: async (root: ICollaborator, args: any, context: Context) => {
    return MediaProductsStats.getLoader(args).load(root.id);
  }

};

const Query = {
  getCollaboratorsMediaReports,
  getProductsMediaReports,
  
  getOverviewAllCollaboratorProducts,
  getOverviewAllCollaborators,
  getTopMediaCollaboratorProducts,
  getTopMediaCollaborators
};

export default { 
  Query, 
  MediaCollaborator,
  MediaProduct
};
