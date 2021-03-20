import _, { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { RegisServiceModel, RegisServiceStatus } from "./regisService.model";
// import { onApprovedRegisService } from '../../../events/onApprovedRegisService.event';

//[Backend] Cung cấp API duyệt đơn đăng ký dịch vụ Offline
const approveRegisService = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { id } = args;
  const regisService = await RegisServiceModel.findOne({
    _id: id,
    status: RegisServiceStatus.PENDING
  });
  if (!regisService) throw ErrorHelper.mgRecoredNotFound("dịch vụ");

  return await RegisServiceModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: RegisServiceStatus.COMPLETED
      },
    },
    {
      new: true
    }
  ).then((res) => {
    // onApprovedRegisService.next(res);
    return res;
  });
}

const Mutation = {
  approveRegisService,
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