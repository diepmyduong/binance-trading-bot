import { ErrorHelper } from "../../../../base/error";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { CollaboratorModel } from "../../collaborator/collaborator.model";
import { CustomerModel } from "../customer.model";

const Mutation = {
  customerUpdateMe: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.CUSTOMER]);
    const { data } = args;
    // kiem tra user co phai chinh no
    const existedCustomer = await CustomerModel.findById(context.tokenData._id);
    if (!existedCustomer) throw ErrorHelper.permissionDeny();
    const customer = await CustomerModel.findByIdAndUpdate(
      existedCustomer.id,
      { $set: data },
      { new: true }
    );
    if (customer.collaboratorId) {
      await CollaboratorModel.updateOne(
        { _id: customer.collaboratorId },
        { $set: { name: customer.name } }
      );
    }
    return customer;
  },
};

export default {
  Mutation,
};
