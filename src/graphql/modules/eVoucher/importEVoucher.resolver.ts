import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import {
  getDataFromExcelStream,
  modifyExcelData,
} from "../../../helpers/workSheet";
import { EVoucherModel, IEVoucher } from "./eVoucher.model";
import {
  EVoucherItemModel,
  IEVoucherItem,
} from "../eVoucherItem/eVoucherItem.model";
import { EVoucherImportingLogModel } from "../eVoucherImportingLog/eVoucherImportingLog.model";
import { eVoucherImportingLogService } from "../eVoucherImportingLog/eVoucherImportingLog.service";
import { SettingHelper } from "../setting/setting.helper";
import { SettingKey } from "../../../configs/settingData";

const STT = "STT";
const MA = "Mã";
const TEN = "Tên";
const THONG_TIN = "Thông tin";
const VOUCHER = "Mã voucher";

const HEADER_DATA = [STT, MA, TEN, THONG_TIN, VOUCHER];

//[Backend] Cung cấp API import file excel chưa danh sách số điện thoại đăng ký cần duyệt
const importEVoucher = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { file: excelFile } = args;

  const { stream } = await excelFile;
  const result: any = await getDataFromExcelStream(stream);
  const [data, errorData] = modifyExcelData(result, HEADER_DATA);

  const logLength = await EVoucherImportingLogModel.count({});
  if (logLength > 0) await EVoucherImportingLogModel.collection.drop();

  console.log("data", data);
  for (let i = 0; i < data.length; i++) {
    const excelRow = data[i];

    const code = excelRow[MA];
    const name = excelRow[TEN];
    const desc = excelRow[THONG_TIN];
    const voucher = excelRow[VOUCHER];

    let success = true;
    let error = "";

    if (!code) {
      success = false;
      error = ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${MA}]`)
        .message;
      await eVoucherImportingLogService.create({
        code,
        name,
        desc,
        voucher,
        success,
        error,
      });
      continue;
    }

    if (!name) {
      success = false;
      error = ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${TEN}]`)
        .message;
      await eVoucherImportingLogService.create({
        code,
        name,
        desc,
        voucher,
        success,
        error,
      });
      continue;
    }

    if (!voucher) {
      success = false;
      error = ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${VOUCHER}]`)
        .message;
      await eVoucherImportingLogService.create({
        code,
        name,
        desc,
        voucher,
        success,
        error,
      });
      continue;
    }

    const existedEvoucher = await EVoucherModel.findOne({ code });

    if (existedEvoucher) {
      const existedVoucherCode = await EVoucherItemModel.findOne({
        code: voucher,
        eVoucherId: existedEvoucher._id,
      });
      if (existedVoucherCode) {
        success = false;
        error = ErrorHelper.duplicateError(VOUCHER).message;
        await eVoucherImportingLogService.create({
          code,
          name,
          desc,
          voucher,
          success,
          error,
        });
        continue;
      } else {
        const voucherCode = new EVoucherItemModel({
          code: voucher,
          eVoucherId: existedEvoucher._id,
          activated: false,
        });

        await voucherCode.save();
      }
    } else {
      const newEVoucher = new EVoucherModel({
        code,
        name,
        desc,
      });

      const newVoucherCode = new EVoucherItemModel({
        code: voucher,
        eVoucherId: newEVoucher._id,
        activated: false,
      });

      await Promise.all([newEVoucher.save(), newVoucherCode.save()]);
    }

    await eVoucherImportingLogService.create({
      code,
      name,
      desc,
      voucher,
      success,
      error,
    });
  }

  const host = await SettingHelper.load(SettingKey.APP_DOMAIN);
  return {
    resultLink: `${host}/api/evoucher/export-import-results?x-token=${context.token}`,
  };
};

const Mutation = {
  importEVoucher,
};
export default { Mutation };
