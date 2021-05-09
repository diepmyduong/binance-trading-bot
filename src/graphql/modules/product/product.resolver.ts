import { ObjectId } from "bson";
import { set, isNull, isUndefined } from "lodash";
import { Types } from "mongoose";
import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CategoryLoader } from "../category/category.model";
import { CollaboratorModel } from "../collaborator/collaborator.model";
import { CollaboratorProductModel } from "../collaboratorProduct/collaboratorProduct.model";
import { CrossSaleModel } from "../crossSale/crossSale.model";
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
      if (context.isMember()) {
        set(args, "q.filter.memberId", context.id);
      }
      if (context.isCustomer()) {
        if (q.filter.isPrimary === false) {
          // kiem tra cac shop dc cho phep ban
          set(args, "q.filter.memberId.$in", [new ObjectId(context.sellerId)]);
          set(args, "q.filter.isCrossSale", false);

          const members = await MemberModel.find({ activated: true }).select(
            "_id allowSale"
          );
          // console.log('members',members);
          const notAllowMembers = members.filter((member) => !member.allowSale);
          // console.log('notAllowMembers',notAllowMembers.length);

          if (notAllowMembers.length > 0) {
            const memberIds = notAllowMembers
              .map((member) => member.id.toString())
              .map(Types.ObjectId);
            set(args, "q.filter.memberId.$nin", memberIds);
          }
        }

        if (q.filter.isCrossSale === true) {
          // kiem tra cac shop dc ban cheo
          const crossSales = await CrossSaleModel.find({
            sellerId: context.sellerId,
          });

          // console.log('context.sellerId',context.sellerId);
          // console.log('crossSales',crossSales);

          if (crossSales.length > 0) {
            const productIds = crossSales
              .map((crossSale) => crossSale.productId.toString())
              .map(Types.ObjectId);
            set(args, "q.filter._id.$in", productIds);
          }
        }

        // console.log("args", args);
      }
    } else {
      if (context.memberCode) {
        console.log("context.memberCode ", context.memberCode);
        const member = await MemberModel.findOne({ code: context.memberCode });
        if (!member) {
          throw ErrorHelper.error("Không có chủ shop này");
        }
        if (q.filter.isPrimary === false) {
          // kiem tra cac shop dc cho phep ban
          set(args, "q.filter.memberId.$in", [new ObjectId(member.id)]);
          set(args, "q.filter.isCrossSale", false);

          const members = await MemberModel.find({ activated: true }).select(
            "_id allowSale"
          );
          // console.log('members',members);
          const notAllowMembers = members.filter((member) => !member.allowSale);
          // console.log('notAllowMembers',notAllowMembers.length);

          if (notAllowMembers.length > 0) {
            const memberIds = notAllowMembers
              .map((member) => member.id.toString())
              .map(Types.ObjectId);
            set(args, "q.filter.memberId.$nin", memberIds);
          }
        }

        if (q.filter.isCrossSale) {
          // kiem tra cac shop dc ban cheo
          const crossSales = await CrossSaleModel.find({
            sellerId: member.id,
          });

          // console.log('context.sellerId',context.sellerId);
          // console.log('crossSales',crossSales);

          if (crossSales.length > 0) {
            const productIds = crossSales
              .map((crossSale) => crossSale.productId.toString())
              .map(Types.ObjectId);
            set(args, "q.filter._id.$in", productIds);
          }
        }
      }
    }

    // console.log('role', get(context.tokenData, "role"))
    // console.log('q', q);
    return await productService.fetch(args.q);
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
