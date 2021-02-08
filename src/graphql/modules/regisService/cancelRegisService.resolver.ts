import _, { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { onCanceledRegisService } from "../../../events/onCanceledRegisService.event";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { IRegisService, RegisServiceModel, RegisServiceStatus } from "./regisService.model";

const cancelRegisService = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { id } = args;
  const regisService = await RegisServiceModel.findOne({
    _id: id,
    status: RegisServiceStatus.PENDING
  });
  if (!regisService) throw ErrorHelper.mgRecoredNotFound("dịch vụ");

  return await Promise.all([
    RegisServiceModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          status: RegisServiceStatus.CANCELED
        },
      },
      {
        new: true
      }
    )
  ]).then(async (res) => {
    const result = res[0];
    onCanceledRegisService.next(result);
    return result;
  });
}

const Mutation = {
  cancelRegisService,
};
export default { Mutation };

// (async () => {
//   const root: any = null;
//   const args: any = {
//     id: "5fd1d50e69ce6a342cf73bc2",
//   }

//   const context: any = null;

//   const result = await Mutation.approveRegisService(root, args, context);

//   console.log('result', result);

// })();