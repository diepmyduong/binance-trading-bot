import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { counterService } from "../counter/counter.service";
import { CustomerLoader } from "../customer/customer.model";
import { OrderModel, OrderStatus } from "../order/order.model";
import { ShopConfigModel } from "../shopConfig/shopConfig.model";
import { CollaboratorModel, CollaboratorStatus } from "./collaborator.model";
import { collaboratorService } from "./collaborator.service";

export default {
  schema: gql`
    extend type Mutation {
      regisCollaborator: Collaborator
    }
  `,
  resolver: {
    Mutation: {
      regisCollaborator: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.CUSTOMER]);
        const [customer, shopConfig, col] = await Promise.all([
          CustomerLoader.load(context.id),
          ShopConfigModel.findOne({ memberId: context.sellerId }),
          CollaboratorModel.findOne({ customerId: context.id }),
        ]);
        if (col) return col;
        const colByPhone = await CollaboratorModel.findOne({
          memberId: context.sellerId,
          phone: customer.phone,
        });
        if (colByPhone && colByPhone.customerId && colByPhone.customerId.toString() != context.id)
          throw Error("Số điện thoại này đã được đăng ký.");
        if (colByPhone && !colByPhone.customerId) {
          colByPhone.customerId = customer._id;
          await customer.updateOne({ $set: { collaboratorId: colByPhone._id } });
        }

        if (shopConfig.colMinOrder > 0) {
          const orderCount = await OrderModel.count({
            sellerId: context.sellerId,
            buyerId: context.id,
            status: OrderStatus.COMPLETED,
          });
          if (orderCount < shopConfig.colMinOrder) throw Error("Không đủ điều kiện đăng ký CTV");
        }
        const data: any = {
          code: await counterService.trigger("collaborator").then((res) => "CTV" + res),
          memberId: context.sellerId,
          customerId: context.id,
          name: customer.name,
          phone: customer.phone,
        };
        const { shortCode, shortUrl, status } = await collaboratorService.generateShortCode(
          context.sellerId,
          data
        );
        data.shortCode = shortCode;
        data.shortUrl = shortUrl;
        data.status = status;
        const newCol = await CollaboratorModel.create(data);
        await customer.updateOne({ $set: { collaboratorId: newCol._id } });
        return newCol;
      },
    },
  },
};
