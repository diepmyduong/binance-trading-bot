import { gql } from "apollo-server-express";
import { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { CollaboratorModel } from "../collaborator/collaborator.model";
import { CustomerLoader } from "../customer/customer.model";
import { MemberLoader } from "../member/member.model";
import { OrderGenerator } from "./orderGenerator";

export default {
  schema: gql`
    extend type Mutation {
      generateOrder(data: CreateDraftOrderInput!): Order
    }
  `,
  resolver: {
    Mutation: {
      generateOrder: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.CUSTOMER]);
        const orderInput = args.data;
        const { sellerId, id: buyerId, campaignCode } = context;
        const [seller, customer] = await Promise.all([
          MemberLoader.load(sellerId),
          CustomerLoader.load(buyerId),
        ]);
        const orderGenerator = new OrderGenerator(orderInput, seller, customer, campaignCode);
        await orderGenerator.generate();
        const order = await orderGenerator.toOrder();
        if (!customer.collaboratorId) {
          await customer
            .updateOne({
              $set: {
                name: order.buyerName,
                latitude: order.latitude,
                longitude: order.longitude,
                fullAddress: order.buyerFullAddress,
                addressNote: order.buyerAddressNote,
              },
            })
            .exec();
        } else {
          await customer
            .updateOne({
              $set: {
                latitude: order.latitude,
                longitude: order.longitude,
                fullAddress: order.buyerFullAddress,
                addressNote: order.buyerAddressNote,
              },
            })
            .exec();
          await CollaboratorModel.updateOne(
            { _id: customer.collaboratorId },
            { $set: { name: customer.name } }
          ).exec();
        }
        return order;
      },
    },
  },
};
