import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { DiligencePointLogModel, DiligencePointLogType, IDiligencePointLog } from "./diligencePointLog.model";
import { IMember, MemberModel } from "../member/member.model";
import { isEmpty, isNull, isNumber } from "lodash";
import { getDataFromExcelStream, modifyExcelData } from "../../../helpers/workSheet";
import { DiligencePointsImportingLogModel } from "../diligencePointsImportingLog/diligencePointsImportingLog.model";
import { diligencePointsImportingLogService } from "../diligencePointsImportingLog/diligencePointsImportingLog.service";
import { helpers } from "faker";
import { SettingHelper } from "../setting/setting.helper";
import { SettingKey } from "../../../configs/settingData";

const STT = "STT";
const EMAIL = "Email chủ shop";
const DIEM_SO = "Điểm số";
const GHI_CHU = "Ghi chú";

const HEADER_DATA = [STT, EMAIL, DIEM_SO, GHI_CHU];

//[Backend] Cung cấp API import file excel chưa danh sách số điện thoại đăng ký cần duyệt
const importDiligencePoints = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { file: excelFile } = args;
  const { stream } = await excelFile;
  const result: any = await getDataFromExcelStream(stream);
  const [data, errorData] = modifyExcelData(result, HEADER_DATA);

  const logLength = await DiligencePointsImportingLogModel.count({});
  if (logLength > 0) await DiligencePointsImportingLogModel.collection.drop();

  for (let i = 0; i < data.length; i++) {
    const excelRow = data[i];
    const email = excelRow[EMAIL];
    const point = excelRow[DIEM_SO];
    const note = excelRow[GHI_CHU];

    // console.log('type of', typeof point)

    let success = true;
    let error = "";

    if (!email) {
      success = false;
      error = ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${EMAIL}]`).message;
      await diligencePointsImportingLogService.create({ email, point, note, success, error });
      continue;
    }

    if (!UtilsHelper.isEmail(email)) {
      success = false;
      error = ErrorHelper.requestDataInvalid(`. Sai định dạng email cột [${EMAIL}]`).message;
      await diligencePointsImportingLogService.create({ email, point, note, success, error });
      continue;
    }

    const member = await MemberModel.findOne({ username: email });
    if (!member) {
      success = false;
      error = ErrorHelper.requestDataInvalid(`. Cột [${EMAIL}] - User không tồn tại`).message;
      await diligencePointsImportingLogService.create({ email, point, note, success, error });
      continue;
    }

    if (!point) {
      success = false;
      error = ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${DIEM_SO}]`).message;
      await diligencePointsImportingLogService.create({ email, point, note, success, error });
      continue;
    }

    if (!isNumber(point)) {
      success = false;
      error = ErrorHelper.requestDataInvalid(`. Cột [${DIEM_SO}] phải là kiểu số`).message;
      await diligencePointsImportingLogService.create({ email, point, note, success, error });
      continue;
    }

    if (point <= 0) {
      success = false;
      error = ErrorHelper.requestDataInvalid(`. Cột [${DIEM_SO}] không được nhỏ hơn hoặc bằng 0`).message;
      await diligencePointsImportingLogService.create({ email, point, note, success, error });
      continue;
    }

    if (isEmpty(note)) {
      success = false;
      error = ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${GHI_CHU}]`).message;
      await diligencePointsImportingLogService.create({ email, point, note, success, error });
      continue;
    }

    // console.log(email, point, note);


    if (member) {
      const memberId = member._id;
      const value = parseInt(point.toString());

      const logParams = {
        memberId,
        value,
        type: DiligencePointLogType.RECEIVE_FROM_IMPORT,
        note
      };

      const log = new DiligencePointLogModel(logParams);
      if (member.diligencePoint) {
        // Update lại số lượng đặt trong product
        await Promise.all([
          log.save(),
          MemberModel.findByIdAndUpdate(memberId, {
            $inc: { diligencePoint: value },
          }, { new: true })
        ]);

      } else {
        await Promise.all([
          log.save(),
          MemberModel.findByIdAndUpdate(memberId, {
            set: { diligencePoint: value },
          }, { new: true })]);
      }
    }
    await diligencePointsImportingLogService.create({ email, point, note, success, error });
  }

  const host = await SettingHelper.load(SettingKey.APP_DOMAIN);

  return `${host}/api/diligencePoint/export-import-results?x-token=${context.token}`;
}

const Mutation = {
  importDiligencePoints,
};
export default { Mutation };