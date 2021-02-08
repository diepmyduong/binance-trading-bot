import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { MemberLoader, MemberModel } from "../member/member.model";
import { memberService } from "../member/member.service";
import { DiligencePointLogModel, DiligencePointLogType, IDiligencePointLog } from "./diligencePointLog.model";

import { diligencePointLogService } from "./diligencePointLog.service";


const Query = {
  getAllDiligencePointLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    return diligencePointLogService.fetch(args.q);
  },
  getOneDiligencePointLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await diligencePointLogService.findOne({ _id: id });
  },
};

const Mutation = {
  createDiligencePointLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { data } = args;
    const { memberId, value, note } = data;

    const parsedValue = parseInt(value);

    // console.log('parse', parsedValue);

    if (parsedValue <= 0)
      throw ErrorHelper.requestDataInvalid(". Điểm chuyên cần không được nhỏ hơn hoặc bằng 0")

    const member = await MemberModel.findById(memberId);
    if (!member)
      throw ErrorHelper.mgQueryFailed("thành viên");


    const totalPoint = member.diligencePoint + parsedValue;
    if (totalPoint < 0)
      throw ErrorHelper.requestDataInvalid(". Tổng điểm chuyên cần không được nhỏ hơn 0");

    const params = {
      type: DiligencePointLogType.RECEIVE_FROM_USER,
      memberId,
      value: parsedValue,
      note
    }

    return Promise.all([
      diligencePointLogService.create(params),
      memberService.increaseDiligencePoint({ memberId, diligencePoint: value })
    ]).then((res: any) => {
      return res[0]
    });
  },

  updateDiligencePointLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { data, id } = args;
    const { memberId, value, note } = data;

    const parsedValue = parseInt(value);

    if (parsedValue < 0)
      throw ErrorHelper.requestDataInvalid(".Điểm chuyên cần không được nhỏ hơn 0")

    const member = await MemberModel.findById(memberId);
    if (!member) {
      throw ErrorHelper.mgRecoredNotFound("thành viên");
    }

    const pointLog = await DiligencePointLogModel.findById(id);
    if (!pointLog) {
      throw ErrorHelper.mgRecoredNotFound("lịch sử điểm chuyên cần");
    }


    const updatedPoint = pointLog.value;
    const newTotalPoint = member.diligencePoint - updatedPoint + parsedValue;

    if (newTotalPoint < 0)
      throw ErrorHelper.requestDataInvalid('. Tổng điểm chuyên cần không được nhỏ hơn 0');

    const updateField = {
      $set: {
        value: parsedValue,
        note
      },
    }

    return Promise.all([
      DiligencePointLogModel.findOneAndUpdate({ _id: id }, updateField, {
        new: true,
      }),
      memberService.updateDiligencePoint({ memberId, updatedPoint, diligencePoint: value })
    ]).then((res: any) => {
      return res[0]
    });
  }
};


const DiligencePointLog = {
  member: GraphQLHelper.loadById(MemberLoader, 'memberId')
};

export default {
  Query,
  Mutation,
  DiligencePointLog,
};
