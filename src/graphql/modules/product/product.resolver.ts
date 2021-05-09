import { set, isNull, isUndefined } from "lodash";
import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CategoryLoader } from "../category/category.model";
import { CollaboratorModel } from "../collaborator/collaborator.model";
import { CollaboratorProductModel } from "../collaboratorProduct/collaboratorProduct.model";
import { MemberLoader, MemberModel } from "../member/member.model";
import { ProductHelper } from "./product.helper";
import { IProduct, ProductModel, ProductType } from "./product.model";
import { productService } from "./product.service";

const Query = {
  getAllProduct: async (root: any, args: any, context: Context) => {
    // AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    // let seller = null;
    const { q } = args;

    if (context.isAuth) {
      if (context.isMember())
        if (isNull(q.filter.isCrossSale) || isUndefined(q.filter.isCrossSale)) {
          // neu ko co filter crossale thi lay ra san pham cua shop do
          set(args, "q.filter.memberId", context.id);
        } else {
          if (q.filter.isCrossSale === false) {
            set(args, "q.filter.memberId", context.id);
          } else {
            // neu co filter crossale thi lay ra san pham ko phai cua shop do
            set(args, "q.filter.memberId", { $ne: context.id });
          }
        }
    } 
    else {
      if (context.memberCode) {
        console.log("context.memberCode ", context.memberCode);
        const member = await MemberModel.findOne({ code: context.memberCode });
        if (!member) {
          throw ErrorHelper.error("Không có chủ shop này");
        }
        // set(args, "q.filter.isPrimary", true);
        // set(args, "q.filter.isCrossSale", true);
        if (!member.allowSale) {
          set(args, "q.filter.memberId.$ne", member.id);
        }
      }
    }

    // console.log('role', get(context.tokenData, "role"))
    // console.log('q', q);
  },

  getOneProduct: async (root: any, args: any, context: Context) => {
    // AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    const { id } = args;
    return await productService.findOne({ _id: id });
  },
};

const Mutation = {
  createProduct: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    let data: IProduct = args.data;

    data.code = data.code || (await ProductHelper.generateCode());

    if (data.basePrice <= 0) ErrorHelper.requestDataInvalid("giá bán");

    if (context.isMember()) {
      set(data, "isPrimary", false);
      set(data, "memberId", context.id);
    } else {
      set(data, "isPrimary", true);
    }

    data.type = data.type || ProductType.RETAIL;

    const product = new ProductModel(data);
    return await product.save();
  },

  updateProduct: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { id, data } = args;
    if (context.isMember()) {
      const product = await ProductModel.findById(id);
      if (product.memberId.toString() != context.id) {
        throw ErrorHelper.permissionDeny();
      }
      resolveArgs(data);
      // bỏ thuộc tính isPrimary , lấy các thuộc tính còn lại
      return product.updateOne({ $set: data });
    }
    return await productService.updateOne(id, data);
  },

  deleteOneProduct: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { id } = args;
    const { tokenData } = context;

    //
    if (context.isMember()) {
      const product = await ProductModel.findById(id);
      if (product.memberId.toString() != tokenData._id) {
        throw ErrorHelper.permissionDeny();
      }
    }
    return await productService.deleteOne(id);
  },

  deleteManyProduct: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { ids } = args;
    let result = await productService.deleteMany(ids);
    return result;
  },
};

const Product = {
  category: GraphQLHelper.loadById(CategoryLoader, "categoryId"),
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),
  collaboratorProduct: async (root: IProduct, args: any, context: Context) => {
    let collaProduct = null;
    if (context.isCustomer()) {
      const collaborator = await CollaboratorModel.findOne({
        customerId: context.id,
      });
      if (collaborator) {
        collaProduct = await CollaboratorProductModel.findOne({
          productId: root.id,
          collaboratorId: collaborator.id,
        });
      }
    }
    return collaProduct;
  },
};

const resolveArgs = (data: any) => {
  delete data.isPrimary;
};

export default {
  Query,
  Mutation,
  Product,
};
