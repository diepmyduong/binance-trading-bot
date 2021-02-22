import csv from "csv-parser";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import {
  getDataFromExcelStream,
  modifyExcelData,
} from "../../../helpers/workSheet";
import { AddressStorehouseImportingLogModel } from "../addressStorehouseImportingLog/addressStorehouseImportingLog.model";
import { SettingHelper } from "../setting/setting.helper";
import { SettingKey } from "../../../configs/settingData";
import { AddressStorehouseModel } from "./addressStorehouse.model";
import { addressStorehouseImportingLogService } from "../addressStorehouseImportingLog/addressStorehouseImportingLog.service";
import { AddressModel } from "../address/address.model";
import { addressStorehouseService } from "./addressStorehouse.service";

const STT = "STT";
const NAME = "Tên kho";
const PHONE = "Số điện thoại";
const EMAIL = "Email";
const ADDRESS = "Địa chỉ";
const PROVINCE = "Tỉnh/Thành";
const DISTRICT = "Quận/Huyện";
const WARD = "Phường/Xã";
const LINE = "line";

const HEADER_DATA = [
  STT,
  NAME,
  PHONE,
  EMAIL,
  ADDRESS,
  PROVINCE,
  DISTRICT,
  WARD,
];

//[Backend] Cung cấp API import file excel chưa danh sách số điện thoại đăng ký dịch vụ cần duyệt
const importAddressStorehouses = async (
  root: any,
  args: any,
  context: Context
) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { file: excelFile } = args;
  const { stream } = await excelFile;
  const result: any = await getDataFromExcelStream(stream);
  let [data, errors] = modifyExcelData(result, HEADER_DATA);

  errors = errors.map(
    (err) => new AddressStorehouseImportingLogModel({ ...err })
  );
  const dataList = [],
    logList = [...errors];

  const logLength = await AddressStorehouseImportingLogModel.count({});
  if (logLength > 0) await AddressStorehouseImportingLogModel.collection.drop();

  for (let i = 0; i < data.length; i++) {
    let success = true;
    let bypass = true;
    const errors = [];
    let existedAddress = null;

    const excelRow = data[i];
    const line = excelRow[LINE];
    const no = excelRow[STT];
    const name = excelRow[NAME];
    const phone = excelRow[PHONE];
    const email = excelRow[EMAIL];
    const address = excelRow[ADDRESS];
    const province = excelRow[PROVINCE];
    const district = excelRow[DISTRICT];
    const ward = excelRow[WARD];

    if (!name) {
      success = false;
      bypass = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${NAME}]`).message
      );
    }

    if (email && !UtilsHelper.isEmail(email)) {
      success = false;
      bypass = false;
      errors.push(
        ErrorHelper.requestDataInvalid(".Email không đúng định dạng").message
      );
    }

    if (!address) {
      success = false;
      bypass = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${ADDRESS}]`)
          .message
      );
    }

    if (bypass) {
      if (!province) {
        success = true;
        errors.push(
          ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${PROVINCE}]`)
            .message
        );
      }

      if (!district) {
        success = true;
        errors.push(
          ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${DISTRICT}]`)
            .message
        );
      }

      if (!ward) {
        success = true;
        errors.push(
          ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${WARD}]`)
            .message
        );
      }

      if (province && district && ward) {
        existedAddress = await AddressModel.findOne({
          province,
          district,
          ward,
        });

        if (!existedAddress) {
          success = true;
          errors.push(
            ErrorHelper.mgQueryFailed(
              `. Không tìm thấy [${PROVINCE} , ${DISTRICT}, ${WARD}] này.`
            ).message
          );
        }
      }
    }

    const params = {
      line,
      no,
      name,
      phone,
      email,
      address,
      province,
      district,
      ward,
      ...existedAddress,
    };

    logList.push({ ...params, success, error:errors.join('\n') });
    if (success === true) {
      dataList.push(new AddressStorehouseModel(params));
    }
  }

  // console.log("dataList", dataList);
  // console.log("logList", logList);

  await Promise.all([
    AddressStorehouseModel.insertMany(dataList),
    AddressStorehouseImportingLogModel.insertMany(logList),
  ]);

  const host = await SettingHelper.load(SettingKey.APP_DOMAIN);
  return `${host}/api/address-storehouse/export-import-results?x-token=${context.token}`;
};

const Mutation = {
  importAddressStorehouses,
};
export default { Mutation };
