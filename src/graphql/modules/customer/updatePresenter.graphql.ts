import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { CollaboratorModel } from "../collaborator/collaborator.model";
import { CustomerModel } from "./customer.model";

export default {
  schema: gql`
    extend type Mutation {
      updatePresenter(colCode: String!): String
    }
  `,
  resolver: {
    Mutation: {
      updatePresenter: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.CUSTOMER]);
        const customer = await CustomerModel.findById(context.id);
        const { colCode } = args;
        if (!customer.collaboratorId) {
          let collaborator = await CollaboratorModel.findOne({
            shortCode: colCode,
            memberId: context.sellerId,
          });
          if (collaborator) {
            customer.presenterId = collaborator.customerId;
            await customer.save();
          }
        }
        return "Đã cập nhật";
      },
    },
  },
};
