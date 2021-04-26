import { ROLES } from "../../../../constants/role.const";
import {
  AuthHelper,
  ErrorHelper,
  firebaseHelper,
  UtilsHelper,
} from "../../../../helpers";
import { Context } from "../../../context";
import {
  getDataFromExcelStream,
  modifyExcelData,
} from "../../../../helpers/workSheet";
import { SettingHelper } from "../../setting/setting.helper";
import { SettingKey } from "../../../../configs/settingData";
import { MemberImportingLogModel } from "../../memberImportingLog/memberImportingLog.model";
import moment from "moment";
import { MemberHelper } from "../member.helper";
import { Gender, MemberModel, MemberType } from "../member.model";
import { AddressHelper } from "../../address/address.helper";
import { BranchModel } from "../../branch/branch.model";

const STT = "STT";
const BRANCH_CODE = "Mã trung tâm";
const BRANCH = "Tên trung tâm";
const SHOP_NAME = "Tên bưu cục";
const CODE = "Mã bưu cục";
const EMAIL = "Email";
const NAME = "Họ tên";
const GENDER = "Giới tính";
const PHONE = "Số điện thoại";
const BIRTHDAY = "Ngày sinh";
const IDENTITY_CARD_NUMBER = "CMND";
const ADDRESS = "Địa chỉ";
const WARD = "Phường/Xã";
const DISTRICT = "Quận/Huyện";
const PROVINCE = "Tỉnh/Thành";
const WARD_ID = "Mã Phường/Xã";
const DISTRICT_ID = "Mã Quận Huyện";
const PROVINCE_ID = "Mã Tỉnh Thành";
const STATUS = "Tình trạng";
const LINE = "line";
const PASSWORD = "Pshop#2021";

// STT	Mã trung tâm	Tên trung tâm	Tên bưu cục	Mã bưu cục
// Email	Họ tên	Giới tính	Số điện thoại	Ngày sinh	CMND	Địa chỉ	Phường/Xã	Quận/Huyện	Tỉnh/Thành	Tình trạng

const HEADER_DATA = [
  STT,
  BRANCH_CODE,
  BRANCH,
  SHOP_NAME,
  CODE,
  EMAIL,
  NAME,
  GENDER,
  PHONE,
  BIRTHDAY,
  IDENTITY_CARD_NUMBER,
  ADDRESS,
  WARD,
  DISTRICT,
  PROVINCE,
  WARD_ID,
  DISTRICT_ID,
  PROVINCE_ID,
  STATUS,
];

//[Backend] Cung cấp API import file excel chưa danh sách số điện thoại đăng ký dịch vụ cần duyệt
const importMembers = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { file: excelFile } = args;
  const { stream } = await excelFile;
  const result: any = await getDataFromExcelStream(stream);
  let [data, errors] = modifyExcelData(result, HEADER_DATA);

  errors = errors.map((err) => new MemberImportingLogModel({ ...err }));
  const dataList: any = [],
    logList = [...errors];

  const logLength = await MemberImportingLogModel.count({});
  if (logLength > 0) await MemberImportingLogModel.collection.drop();

  for (let i = 0; i < data.length; i++) {
    let success = true;
    const errors = [];

    const excelRow = data[i];
    const line = excelRow[LINE];
    const no = excelRow[STT];
    const branchCode = excelRow[BRANCH_CODE];
    const branch = excelRow[BRANCH];
    const code = excelRow[CODE];
    const shopName = excelRow[SHOP_NAME];
    const name = excelRow[NAME];
    const phone = excelRow[PHONE];
    const email = excelRow[EMAIL];
    const address = excelRow[ADDRESS];
    const province = excelRow[PROVINCE];
    const district = excelRow[DISTRICT];
    const ward = excelRow[WARD];

    const provinceId = excelRow[PROVINCE_ID];
    const districtId = excelRow[DISTRICT_ID];
    const wardId = excelRow[WARD_ID];

    const gioiTinh = excelRow[GENDER];
    const gender =
      gioiTinh === "Nam"
        ? Gender.MALE
        : gioiTinh === "Khác"
        ? Gender.OTHER
        : Gender.FEMALE;
    const rawBirthDay = excelRow[BIRTHDAY];
    // console.log("---->raw", rawBirthDay);
    const trueDate = moment(rawBirthDay, "DD-MM-YYYY");
    const liteDate = moment(rawBirthDay, "D-MM-YYYY");
    const liteMonth = moment(rawBirthDay, "DD-M-YYYY");
    const liteAll = moment(rawBirthDay, "D-M-YYYY");
    const birthday = trueDate
      ? trueDate
      : liteDate
      ? liteDate
      : liteMonth
      ? liteMonth
      : liteAll;
    // console.log("birthday", birthday);
    const identityCardNumber = excelRow[IDENTITY_CARD_NUMBER];
    const status = excelRow[STATUS];

    if (!branchCode) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${BRANCH_CODE}]`)
          .message
      );
    }

    if (!branch) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${BRANCH}]`)
          .message
      );
    }

    if (!code) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${CODE}]`).message
      );
    }

    if (!shopName) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${SHOP_NAME}]`)
          .message
      );
    }

    if (!name) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${NAME}]`).message
      );
    }

    if (!phone) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${PHONE}]`).message
      );
    }

    if (email && !UtilsHelper.isEmail(email)) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(".Email không đúng định dạng").message
      );
    }

    if (!gender) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${ADDRESS}]`)
          .message
      );
    }

    if (!birthday) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${BIRTHDAY}]`)
          .message
      );
    }

    if (!identityCardNumber) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(
          `. Thiếu dữ liệu cột [${IDENTITY_CARD_NUMBER}]`
        ).message
      );
    }

    if (!status) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${STATUS}]`)
          .message
      );
    }

    if (!address) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${ADDRESS}]`)
          .message
      );
    }

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
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${WARD}]`).message
      );
    }

    // if (email) {
    //   const member = await MemberModel.findOne({ code, username: email });
    //   if (member) {
    //     success = false;
    //     errors.push(
    //       ErrorHelper.requestDataInvalid(
    //         `. Trùng dữ liệu cột [${CODE} - ${EMAIL}]`
    //       ).message
    //     );
    //   }
    // }

    let branchId = null;
    if (branchCode) {
      const branch = await BranchModel.findOne({ code: branchCode });
      if (!branch) {
        success = false;
        errors.push(
          ErrorHelper.requestDataInvalid(`. Sai dữ liệu cột [${BRANCH_CODE}]`)
            .message
        );
      }
      branchId = branch.id;
    }

    const params: any = {
      line,
      no,
      branchCode,
      branch,
      code,
      shopName,
      email,
      name,
      phone,
      identityCardNumber,
      gender,
      gioiTinh,
      address,
      province,
      district,
      ward,
      provinceId,
      districtId,
      wardId,
      status,
      // shop
      username: email,
      password: PASSWORD,
      branchId,
      activated: true,
      type: MemberType.BRANCH,
    };
    // console.log('params',params);

    logList.push({ ...params, success, error: errors.join("\n") });

    if (success === true) {
      const helper = new MemberHelper(new MemberModel(params));
      await Promise.all([
        AddressHelper.setProvinceName(helper.member),
        AddressHelper.setDistrictName(helper.member),
        AddressHelper.setWardName(helper.member),
      ]);
      helper.setActivedAt();

      const existedMember = await MemberModel.findOne({code: helper.member.code});

      if(existedMember){
        await MemberModel.findByIdAndUpdate(existedMember.id, { provinceId: helper.member.id, wardId:helper.member.wardId  } ,{new:true});
      }
      else{
        // let fbUser = await firebaseHelper.app
        //   .auth()
        //   .getUserByEmail(helper.member.username)
        //   .catch((error) => null);

        // if (!fbUser) {
        //   fbUser = await firebaseHelper.createUser(
        //     helper.member.username,
        //     params.password
        //   );
        // }
        // helper.member.uid = fbUser.uid;
        // console.log("params", params);
      }
      
      // dataList.push(helper.member);
    }
  }

  console.log("dataList", dataList);
  // console.log("logList", logList);

  await Promise.all([
    // MemberModel.insertMany(dataList),
    MemberImportingLogModel.insertMany(logList),
  ]);

  const host = await SettingHelper.load(SettingKey.APP_DOMAIN);
  return `${host}/api/member/export-import-results?x-token=${context.token}`;
};

const Mutation = {
  importMembers,
};
export default { Mutation };