import _, { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { onCanceledSMS } from "../../../events/onCanceledSMS.event";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { RegisSMSModel, RegisSMSStatus } from "./regisSMS.model";

const cancelRegisSMS = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { id } = args;
  const regisSMS = await RegisSMSModel.findOne({
    _id: id,
    status: RegisSMSStatus.PENDING
  });

  if (!regisSMS) throw ErrorHelper.mgRecoredNotFound("SMS");


  return await Promise.all([
    RegisSMSModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          status: RegisSMSStatus.CANCELED
        },
      },
      {
        new: true
      }
    )
  ]).then(async (res) => {
    const result = res[0];
    onCanceledSMS.next(result);
    return result;
  });
}

const Mutation = {
  cancelRegisSMS,
};
export default { Mutation };