import csv from "csv-parser";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { RegisServiceModel, RegisServiceStatus } from "./regisService.model";
import { onApprovedRegisService } from "../../../events/onApprovedRegisService.event";
import { getDataFromExcelStream, getJsonFromCSVStream, modifyCSVData, modifyExcelData } from "../../../helpers/workSheet";
import { ProductModel } from "../product/product.model";
import { SettingHelper } from "../setting/setting.helper";
import { SettingKey } from "../../../configs/settingData";
import { RegisServiceImportingLogModel } from "../regisServiceImportingLog/regisServiceImportingLog.model";
import { regisServiceImportingLogService } from "../regisServiceImportingLog/regisServiceImportingLog.service";

const STT = "STT";
const PHONE = "Số điện thoại";
const CODE = "Mã đăng ký dịch vụ";
const HEADER_DATA = [STT, PHONE, CODE];


//[Backend] Cung cấp API import file excel chưa danh sách số điện thoại đăng ký dịch vụ cần duyệt
const importRegisServiceApproving = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { file: excelFile } = args;
  const { stream } = await excelFile;
  const result: any = await getDataFromExcelStream(stream);
  const [data, errorData] = modifyExcelData(result, HEADER_DATA, false);

  const logLength = await RegisServiceImportingLogModel.count({});
  if (logLength > 0) await RegisServiceImportingLogModel.collection.drop();
  const updatedRegisServices: any[] = [];
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
      await regisServiceImportingLogService.create({ phone, code, success, error });
      continue;
    }

    if (!code) {
      success = false;
      error = ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${CODE}]`).message;
      await regisServiceImportingLogService.create({ phone, code, success, error });
      continue;
    }

    const alreadyProduct = await ProductModel.findOne({ code });
    if (!alreadyProduct) {
      success = false;
      error = ErrorHelper.mgQueryFailed(`. Không tìm thấy đăng ký [${CODE}] này.`).message;
      await regisServiceImportingLogService.create({ phone, code, success, error });
      continue;
    }

    const alreadyExistRegisService = await RegisServiceModel.findOne({
      registerPhone: phone,
      productId: alreadyProduct._id,
      status: RegisServiceStatus.PENDING
    });

    if (!alreadyExistRegisService) {
      success = false;
      error = ErrorHelper.mgQueryFailed(`. Không tìm thấy đăng ký của [${PHONE}] này.`).message;
      await regisServiceImportingLogService.create({ phone, code, success, error });
      continue;
    }

    alreadyExistRegisService.status = RegisServiceStatus.COMPLETED;
    await Promise.all([
      alreadyExistRegisService.save(),
      regisServiceImportingLogService.create({ phone, code, success, error })
    ]).then(([savedRegisSMS,]) => { updatedRegisServices.push(savedRegisSMS) });
  }

  Promise.all(updatedRegisServices).then((res) => {
    for (const r of res) {
      onApprovedRegisService.next(r);
    }
  });

  const host = await SettingHelper.load(SettingKey.APP_DOMAIN);

  return `${host}/api/service/export-import-results?x-token=${context.token}`;
};

const Mutation = {
  importRegisServiceApproving,
};
export default { Mutation };