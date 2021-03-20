
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
// import { onApprovedSMS } from '../../../events/onApprovedSMS.event';
import { getDataFromExcelStream, modifyExcelData } from "../../../helpers/workSheet";
import { ProductModel } from "../product/product.model";
import { RegisSMSImportingLogModel } from "../regisSMSImportingLog/regisSMSImportingLog.model";
import { SettingHelper } from "../setting/setting.helper";
import { SettingKey } from "../../../configs/settingData";
import { regisSMSImportingLogService } from "../regisSMSImportingLog/regisSMSImportingLog.service";
import { RegisSMSModel, RegisSMSStatus } from "./regisSMS.model";

const STT = "STT";
const PHONE = "Số điện thoại";
const CODE = "Mã đăng ký SMS";
const HEADER_DATA = [STT, PHONE, CODE];

//[Backend] Cung cấp API import file excel chưa danh sách số điện thoại đăng ký cần duyệt
const importSMSApproving = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { file: excelFile } = args;
  const { stream } = await excelFile;
  const result: any = await getDataFromExcelStream(stream);
  const [data, errorData] = modifyExcelData(result, HEADER_DATA);

  const logLength = await RegisSMSImportingLogModel.count({});
  if (logLength > 0) await RegisSMSImportingLogModel.collection.drop();
  const updatedRegisSMSs: any[] = [];
  for (let i = 0; i < data.length; i++) {
    const excelRow = data[i];
    // console.log('excelRow', excelRow);
    const phone = excelRow[PHONE];
    const code = excelRow[CODE];

    let success = true;
    let error = "";

    if (!phone) {
      success = false;
      error = ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${PHONE}]`).message;
      await regisSMSImportingLogService.create({ phone, code, success, error });
      continue;
    }

    if (!code) {
      success = false;
      error = ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${CODE}]`).message;
      await regisSMSImportingLogService.create({ phone, code, success, error });
      continue;
    }

    const alreadyProduct = await ProductModel.findOne({ code });
    if (!alreadyProduct) {
      success = false;
      error = ErrorHelper.mgQueryFailed(`. Không tìm thấy đăng ký [${CODE}] này.`).message;
      await regisSMSImportingLogService.create({ phone, code, success, error });
      continue;
    }

    const alreadyExistRegisSMS = await RegisSMSModel.findOne({
      registerPhone: phone,
      productId: alreadyProduct._id,
      status: RegisSMSStatus.PENDING
    });

    if (!alreadyExistRegisSMS) {
      success = false;
      error = ErrorHelper.mgQueryFailed(`. Không tìm thấy đăng ký [${PHONE}] này.`).message;
      await regisSMSImportingLogService.create({ phone, code, success, error });
      continue;
    }

    alreadyExistRegisSMS.status = RegisSMSStatus.COMPLETED;
    await Promise.all([
      alreadyExistRegisSMS.save(),
      regisSMSImportingLogService.create({ phone, code, success, error })
    ]).then(([savedRegisSMS,]) => { updatedRegisSMSs.push(savedRegisSMS) });
  }

  Promise.all(updatedRegisSMSs).then((res) => {
    for (const r of res) {
      // onApprovedSMS.next(r);
    }
  });

  const host = await SettingHelper.load(SettingKey.APP_DOMAIN);

  return `${host}/api/sms/export-import-results?x-token=${context.token}`;
}

const Mutation = {
  importSMSApproving,
};
export default { Mutation };