import _, { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { RegisSMSModel, RegisSMSStatus } from "./regisSMS.model";
// import { onApprovedSMS } from '../../../events/onApprovedSMS.event';

//[Backend] Cung cấp API duyệt lịch sử đăng ký dịch vụ SMS
const approveRegisSMS = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { id } = args;
  const regisSMS = await RegisSMSModel.findOne({
    _id: id,
    status: RegisSMSStatus.PENDING
  });

  if (!regisSMS) throw ErrorHelper.mgRecoredNotFound("SMS");

  return await RegisSMSModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: RegisSMSStatus.COMPLETED
      },
    },
    {
      new: true
    }
  ).then((res) => {
    // onApprovedSMS.next(res);
    return res;
  });
}

const Mutation = {
  approveRegisSMS,
};
export default { Mutation };

// (async () => {
//   const root: any = null;
//   const args: any = {
//     id: "5fe2f884eea045e27679ef2d",
//   }

//   const context: any = null;

//   const result = await Mutation.approveRegisSMS(root, args, context);

//   console.log('result', result);

// })();