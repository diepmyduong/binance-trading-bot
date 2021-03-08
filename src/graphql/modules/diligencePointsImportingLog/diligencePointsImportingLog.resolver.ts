import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { diligencePointsImportingLogService } from "./diligencePointsImportingLog.service";

const Query = {
  getAllDiligencePointsImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return "Something wrong"
  },
};


export default {
  Query,
};
