import csv from "csv-parser";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import {
  getDataFromExcelStream,
  modifyExcelData,
} from "../../../helpers/workSheet";
import { SettingHelper } from "../setting/setting.helper";
import { SettingKey } from "../../../configs/settingData";
import { AddressModel } from "../address/address.model";
import { AddressDeliveryImportingLogModel } from "../addressDeliveryImportingLog/addressDeliveryImportingLog.model";
import { AddressDeliveryModel } from "./addressDelivery.model";

const STT = "STT";
const NAME = "Tên";
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
const importAddressDelivery = async (
  root: any,
  args: any,
  context: Context
) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { file: excelFile } = args;
  const { stream } = await excelFile;
  const result: any = await getDataFromExcelStream(stream);
  let [data, errors] = modifyExcelData(result, HEADER_DATA);
  errors = errors.map(err => new AddressDeliveryImportingLogModel({...err}));
  
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
      logList.push(new AddressDeliveryImportingLogModel({
        ...params,
        success: false,
        error: ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${NAME}]`).message
      }));
      continue;
    }


    if (!address) {
      logList.push(new AddressDeliveryImportingLogModel({
        ...params,
        success: false,
        error: ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${ADDRESS}]`).message
      }));
      continue;
    }


    if (!province) {
      logList.push(new AddressDeliveryImportingLogModel({
        ...params,
        success: false,
        error: ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${PROVINCE}]`).message
      }));
      continue;
    }

    if (!district) {
      logList.push(new AddressDeliveryImportingLogModel({
        ...params,
        success: false,
        error: ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${DISTRICT}]`).message
      }));
      continue;
    }

    if (!ward) {
      logList.push(new AddressDeliveryImportingLogModel({
        ...params,
        success: false,
        error: ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${WARD}]`).message
      }));
      continue;
    }


    if (params.email && !UtilsHelper.isEmail(params.email)) {
      logList.push(new AddressDeliveryImportingLogModel({
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
      logList.push(new AddressDeliveryImportingLogModel({
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
      new AddressDeliveryModel({ ...params, provinceId, wardId, districtId })
    );
  }

  // console.log("dataList", dataList);
  // console.log("logList", logList);

  const logLength = await AddressDeliveryImportingLogModel.count({});
  if (logLength > 0) await AddressDeliveryImportingLogModel.collection.drop();

  await Promise.all([
    AddressDeliveryModel.insertMany(dataList),
    AddressDeliveryImportingLogModel.insertMany(logList),
  ]);

  const host = await SettingHelper.load(SettingKey.APP_DOMAIN);
  return `${host}/api/address-delivery/export-import-results?x-token=${context.token}`;
};

const Mutation = {
  importAddressDelivery,
};
export default { Mutation };
