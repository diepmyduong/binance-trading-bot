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
  errors = errors.map(err => new AddressStorehouseImportingLogModel({...err}));
  
  const dataList = [],
    logList = [...errors];

  for (let i = 0; i < data.length; i++) {
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
    };

    if (!name) {
      logList.push(new AddressStorehouseImportingLogModel({
        ...params,
        success: false,
        error: ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${NAME}]`).message
      }));
      continue;
    }


    if (!address) {
      logList.push(new AddressStorehouseImportingLogModel({
        ...params,
        success: false,
        error: ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${ADDRESS}]`).message
      }));
      continue;
    }


    if (!province) {
      logList.push(new AddressStorehouseImportingLogModel({
        ...params,
        success: false,
        error: ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${PROVINCE}]`).message
      }));
      continue;
    }

    if (!district) {
      logList.push(new AddressStorehouseImportingLogModel({
        ...params,
        success: false,
        error: ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${DISTRICT}]`).message
      }));
      continue;
    }

    if (!ward) {
      logList.push(new AddressStorehouseImportingLogModel({
        ...params,
        success: false,
        error: ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${WARD}]`).message
      }));
      continue;
    }


    if (params.email && !UtilsHelper.isEmail(params.email)) {
      logList.push(new AddressStorehouseImportingLogModel({
        ...params,
        success: false,
        error: ErrorHelper.requestDataInvalid(".Email không đúng định dạng")
          .message,
      }));
      continue;
    }

    const existedAddress = await AddressModel.findOne({
      province,
      district,
      ward,
    });

    if (!existedAddress) {
      logList.push(new AddressStorehouseImportingLogModel({
        ...params,
        success: false,
        error: ErrorHelper.mgQueryFailed(
          `. Không tìm thấy [${PROVINCE} , ${DISTRICT}, ${WARD}] này.`
        ).message,
      }));
      continue;
    }

    const { provinceId, wardId, districtId } = existedAddress;
    logList.push({ ...params, provinceId, wardId, districtId, success: true });
    dataList.push(
      new AddressStorehouseModel({ ...params, provinceId, wardId, districtId })
    );
  }

  // console.log("dataList", dataList);
  // console.log("logList", logList);

  const logLength = await AddressStorehouseImportingLogModel.count({});
  if (logLength > 0) await AddressStorehouseImportingLogModel.collection.drop();

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