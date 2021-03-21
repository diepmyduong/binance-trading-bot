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
const SHOP_NAME = "Tên bưu cục";
const CODE = "Mã bưu cục";
const EMAIL = "Email";
const NAME = "Họ tên";
const GENDER = "Giới tính";
const PHONE = "Số điện thoại";
const LINE = "line";
const PASSWORD = "Pshop#2021";

// STT	Mã trung tâm	Tên trung tâm	Tên bưu cục	Mã bưu cục	Email	Họ tên	Giới tính	Số điện thoại	Ngày sinh	CMND	Địa chỉ	Phường/Xã	Quận/Huyện	Tỉnh/Thành	Tình trạng

const HEADER_DATA = [STT, SHOP_NAME, CODE, EMAIL, NAME, GENDER, PHONE];

//[Backend] Cung cấp API import file excel chưa danh sách số điện thoại đăng ký dịch vụ cần duyệt
const importUpdateMembers = async (root: any, args: any, context: Context) => {
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

  const existedMembers = await MemberModel.find({
    username: { $in: [/pshop/, /Pshop/] },
  });

  // const existTest = await MemberModel.findOne({
  //   username: "pshop.phuocthanh@gmail.com",
  // });

  // if (existTest) {
  //   let fbUserTest = await firebaseHelper.app
  //     .auth()
  //     .getUserByEmail("pshop.phuocthanh@gmail.com")
  //     .catch((error) => null);

  //   // console.log('fbUser',fbUser);

  //   if (!fbUserTest) {
  //     fbUserTest = await firebaseHelper.createUser(
  //       "pshop.phuocthanh@gmail.com",
  //       PASSWORD
  //     );
  //   }

  //   await MemberModel.findByIdAndUpdate(
  //     existTest.id,
  //     {
  //       $set: {
  //         uid: fbUserTest.uid,
  //       },
  //     },
  //     {
  //       new: true,
  //     }
  //   );
  // }

  for (let i = 0; i < data.length; i++) {
    let success = true;
    const errors = [];

    const excelRow = data[i];
    const line = excelRow[LINE];
    const no = excelRow[STT];
    const code = excelRow[CODE];
    const shopName = excelRow[SHOP_NAME];
    const name = excelRow[NAME];
    const phone = excelRow[PHONE];
    const email = excelRow[EMAIL];
    const gioiTinh = excelRow[GENDER];
    const gender =
      gioiTinh === "Nam"
        ? Gender.MALE
        : gioiTinh === "Khác"
        ? Gender.OTHER
        : Gender.FEMALE;
    // console.log("---->raw", rawBirthDay)

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
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${GENDER}]`)
          .message
      );
    }

    const params: any = {
      line,
      no,
      code,
      shopName,
      email,
      name,
      phone,
      gender,
      // shop
      username: email,
      password: PASSWORD,
      activated: true,
      type: MemberType.BRANCH,
    };
    // console.log('params',params);

    logList.push({ ...params, success, error: errors.join("\n") });

    if (success === true) {
      const existedMember = await MemberModel.findOne({
        code: params.code,
        username: { $nin: [/pshop/, /Pshop/] },
      });

      let fbUser = await firebaseHelper.app
        .auth()
        .getUserByEmail(params.username)
        .catch((error) => null);

      // console.log("fbUser", fbUser);

      if (!fbUser) {
        fbUser = await firebaseHelper.createUser(
          params.username,
          params.password
        );
      }

      if (existedMember) {
        params.uid = fbUser.uid;

        await MemberModel.findByIdAndUpdate(
          existedMember.id,
          { $set: params },
          {
            new: true,
          }
        );
      }

      //   console.log("existed", existedMemberByUsername);
      //   // neu ton tai username o hai nguon - pshop + excel => xoa nguon pshop => update lai nguon excel
      //   if (existedMemberByUsername) {
      //     await MemberModel.findOneAndDelete({ code: helper.member.code });
      //     await MemberModel.findByIdAndUpdate(
      //       existedMemberByUsername.id,
      //       {
      //         $set: {
      //           code: helper.member.code,
      //         },
      //       },
      //       { new: true }
      //     );
      //   }
    }
  }

  // console.log("dataList", dataList);
  // console.log("logList", logList);

  await Promise.all([
    // MemberModel.insertMany(dataList),
    // MemberImportingLogModel.insertMany(logList),
  ]);

  const host = await SettingHelper.load(SettingKey.APP_DOMAIN);
  return `${host}/api/member/export-import-results?x-token=${context.token}`;
};

const Mutation = {
  importUpdateMembers,
};
export default { Mutation };
