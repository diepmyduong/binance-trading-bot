import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { DiligencePointLogModel, DiligencePointLogType, IDiligencePointLog } from "./diligencePointLog.model";
import { IMember, MemberModel } from "../member/member.model";
import { isNull } from "lodash";
import { getDataFromExcelStream, modifyExcelData } from "../../../helpers/workSheet";

const H1 = "Username";
const H2 = "Point";
const H3 = "Note";

const HEADER_DATA = [H1, H2, H3];

//[Backend] Cung cấp API import file excel chưa danh sách số điện thoại đăng ký cần duyệt
const importCsvForAddDiligencePoint = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { csvFile: excelFile } = args;
  // console.log('excelFile', excelFile);
  const { stream } = await excelFile;
  const result: any = await getDataFromExcelStream(stream);
  // console.log('excelData', excelData);
  const excelData = modifyExcelData(result, HEADER_DATA, false);
  let [data, errorData] = excelData;

  const usernames = data.map((res: any) => res[H1]);

  const members = await MemberModel.find({ username: { $in: usernames }, activated: true });

  const totalPoints = data.map((res: any) => {
    const pointData = parseInt(res[H2]);
    // console.log('pointData', pointData)
    const memberData = res[H1];
    // console.log('memberData', memberData)
    const member = members.find(m => m.username === memberData)
    // console.log('================>member', member.username);
    // console.log('member', member.diligencePoint);
    if (typeof member.diligencePoint === undefined) {
      return pointData + 0;
    }
    else {
      return pointData + member.diligencePoint
    }
  });

  // console.log('totalPoints', totalPoints);
  console.log('--------------->member');
  const haveInvalidPoints = data.some((res: any) => {
    return parseInt(res[H2]) === 0;
  });
  if (haveInvalidPoints)
    throw ErrorHelper.requestDataInvalid("- Point - điểm chuyên cần không được bằng 0");


  if (members.length === 0)
    throw ErrorHelper.requestDataInvalid("- Username - thành viên");

  const haveInvalidTotalPoint = totalPoints.some((res: any) => {
    return res < 0;
  });
  if (haveInvalidTotalPoint)
    throw ErrorHelper.requestDataInvalid("- Point - tổng điểm chuyên cần không được nhỏ hơn 0");

  const memberBulk = MemberModel.collection.initializeUnorderedBulkOp();
  const logs: IDiligencePointLog[] = data.map(({
    Username,
    Point,
    Note,
  }: any) => {
    let log = null;
    const member = members.find(d => d.username === Username);
    if (member) {
      const memberId = member._id
      const value = parseInt(Point);
      const note = Note;

      const logParams = {
        memberId,
        value,
        type: DiligencePointLogType.RECEIVE_FROM_IMPORT,
        note
      };

      // console.log('logParams', logParams);

      log = new DiligencePointLogModel(logParams);

      if (member.diligencePoint) {
        // Update lại số lượng đặt trong product
        memberBulk.find({ _id: memberId }).updateOne({
          $inc: { diligencePoint: value },
        });
      } else {
        memberBulk.find({ _id: memberId }).updateOne({
          set: { diligencePoint: value },
        });
      }
    }


    return log;
  });


  // đẩy hết update từng record vào promise

  // chạy promise 1 lần để lấy danh sách đã update status
  return Promise.all([
    DiligencePointLogModel.insertMany(logs.filter(log => !isNull(log))),
    memberBulk.execute(),
  ]).then((res) => {
    // return res[0];

    // for (const r of res) {
    //   onApprovedSMS.next(r);
    // }
    return {
      successLines: data.map(d => d.Line),
      errorLines: errorData.map(d => d.Line)
    }
  });
}

const Mutation = {
  importCsvForAddDiligencePoint,
};
export default { Mutation };