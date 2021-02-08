import { isNull } from "lodash";
import { CrudService } from "../../../base/crudService";
import { ErrorHelper } from "../../../helpers";
import { counterService } from "../counter/counter.service";
import { MemberModel } from "./member.model";
class MemberService extends CrudService<typeof MemberModel> {
  constructor() {
    super(MemberModel);
  }
  generateCode() {
    return counterService.trigger("member").then((c) => "M" + c);
  }
  increaseCommissions({ memberId, currentCommission, commission }: any) {
    // tự cộng dồn hoa hồng
    let updateField: any = {
      $set: {
        commission,
      },
    };

    // nếu hoa hồng trong member null => set vào
    if (currentCommission) {
      updateField = {
        $inc: { commission },
      };
    }

    // cập nhật số dư hoa hồng trong member
    return MemberModel.findOneAndUpdate({ _id: memberId }, updateField, {
      new: true,
    });
  }

  increasePoint({ memberId, currentCumulativePoint, cumulativePoint }: any) {
    // tự cộng dồn hoa hồng
    let updateField: any = {
      $set: {
        cumulativePoint,
      },
    };

    // nếu hoa hồng trong member null => set vào
    if (currentCumulativePoint) {
      updateField = {
        $inc: { cumulativePoint },
      };
    }

    // cập nhật số dư hoa hồng trong member
    return MemberModel.findOneAndUpdate({ _id: memberId }, updateField, {
      new: true,
    });
  }

  increaseDiligencePoint = async ({ memberId, diligencePoint }: any) => {
    // create increase diligent

    const member = await MemberModel.findById(memberId);

    if (!member)
      throw ErrorHelper.mgRecoredNotFound('thành viên');

    let updateField: any = {
      $set: {
        diligencePoint,
      },
    };

    // nếu hoa hồng trong member null => set vào
    if (member.diligencePoint) {
      updateField = {
        $inc: { diligencePoint },
      };
    }

    // cập nhật số dư hoa hồng trong member
    return MemberModel.findOneAndUpdate({ _id: memberId }, updateField, {
      new: true,
    });
  }

  updateDiligencePoint = async ({ memberId, updatedPoint, diligencePoint }: any) => {
    // create increase diligent

    console.log(memberId, updatedPoint, diligencePoint);
    const member = await MemberModel.findById(memberId);

    if (!member)
      throw ErrorHelper.mgRecoredNotFound('thành viên');


    console.log(member.diligencePoint);
    // nếu hoa hồng trong member null => set vào
    const myDiligencePoint = parseInt(member.diligencePoint.toString());
    if (myDiligencePoint < 0)
      throw ErrorHelper.requestDataInvalid('điểm chuyên cần');

    const newPoint = member.diligencePoint - updatedPoint + diligencePoint;

    console.log('newPoint', newPoint);

    if (newPoint < 0)
      throw ErrorHelper.requestDataInvalid('điểm chuyên cần');

    const updateField = {
      $set: {
        diligencePoint: newPoint
      },
    };

    // cập nhật số dư hoa hồng trong member
    return MemberModel.findOneAndUpdate({ _id: memberId }, updateField, {
      new: true,
    });
  }
}

const memberService = new MemberService();

export { memberService };
