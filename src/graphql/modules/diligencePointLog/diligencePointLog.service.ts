import { CrudService } from "../../../base/crudService";

import csv from "csv-parser";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { DiligencePointLogModel, DiligencePointLogType, IDiligencePointLog } from "./diligencePointLog.model";
import { IMember, MemberModel } from "../member/member.model";
import { isNull } from "lodash";
import { getJsonFromCSVStream, modifyCSVData } from "../../../helpers/workSheet";

const H1 = "Username";
const H2 = "Point";
const H3 = "Note";

const HEADER_SVG = [
  H1,
  H2,
  H3
];


class DiligencePointLogService extends CrudService<typeof DiligencePointLogModel> {
  constructor() {
    super(DiligencePointLogModel);
  }

  //[Backend] Cung cấp API import file excel chưa danh sách số điện thoại đăng ký cần duyệt
  importCsvForAddDiligencePoint = async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { csvFile } = args;
    // console.log('csvFile', csvFile);
    const { stream } = await csvFile;

    const result: any = await getJsonFromCSVStream(stream);

    // console.log('result', result);
    const data = modifyCSVData(result, HEADER_SVG);
    if (data.length === 0) {
      throw ErrorHelper.requestDataInvalid("File import không có dữ liệu");
    }

    // console.log("dataImport", data);
    // { Phone: '0708890280', Code: 'SER10030' },
    // { Phone: '0708890280', Code: 'SER10028' },
    // { Phone: '0708890280', Code: 'SER10024' }

    const usernames = data.map((res) => res[H1]);

    const members = await MemberModel.find({ username: { $in: usernames }, activated: true });

    const totalPoints = data.map((res) => {
      const point = parseInt(res[H2]);
      const member = members.find(m => m.username === res[H1])
      return point + member.diligencePoint
    });

    const haveInvalidPoints = data.some((res) => {
      return parseInt(res[H2]) === 0;
    });
    if (haveInvalidPoints)
      throw ErrorHelper.requestDataInvalid("- Point - điểm chuyên cần không được bằng 0");


    if (members.length === 0)
      throw ErrorHelper.requestDataInvalid("- Username - thành viên");

    const haveInvalidTotalPoint = totalPoints.some((res) => {
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

        // Update lại số lượng đặt trong product
        memberBulk.find({ _id: memberId }).updateOne({
          $inc: { diligencePoint: value },
        });
      }


      return log;
    });


    // đẩy hết update từng record vào promise

    // chạy promise 1 lần để lấy danh sách đã update status
    return Promise.all([
      DiligencePointLogModel.insertMany(logs.filter(log => !isNull(log))),
      memberBulk.execute(),
    ]).then((res) => {
      // for (const r of res) {
      //   onApprovedSMS.next(r);
      // }
      return res[0];
    });
  }

}

const diligencePointLogService = new DiligencePointLogService();

export { diligencePointLogService };
