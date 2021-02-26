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
const STATUS = "Tình trạng";
const LINE = "line";
const PASSWORD = "pshop@2021";

// STT	Mã trung tâm	Tên trung tâm	Tên bưu cục	Mã bưu cục	Email	Họ tên	Giới tính	Số điện thoại	Ngày sinh	CMND	Địa chỉ	Phường/Xã	Quận/Huyện	Tỉnh/Thành	Tình trạng

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

    if (email) {
      const member = await MemberModel.findOne({ code, username: email });
      if (member) {
        success = false;
        errors.push(
          ErrorHelper.requestDataInvalid(
            `. Trùng dữ liệu cột [${CODE} - ${EMAIL}]`
          ).message
        );
      }
    }

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
      birthday,
      phone,
      identityCardNumber,
      gender,
      gioiTinh,
      address,
      province,
      district,
      ward,
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
      let fbUser = await firebaseHelper.app
        .auth()
        .getUserByEmail(params.username)
        .catch((error) => null);

      if (!fbUser) {
        fbUser = await firebaseHelper.createUser(
          params.username,
          params.password
        );
      }
      params.uid = fbUser.uid;
      console.log("params", params);
      const helper = new MemberHelper(new MemberModel(params));
      await Promise.all([
        AddressHelper.setProvinceName(helper.member),
        AddressHelper.setDistrictName(helper.member),
        AddressHelper.setWardName(helper.member),
      ]);
      helper.setActivedAt();
      dataList.push(helper.member);
    }
  }

  // console.log("dataList", dataList);
  // console.log("logList", logList);

  await Promise.all([
    MemberModel.insertMany(dataList),
    MemberImportingLogModel.insertMany(logList),
  ]);

  const host = await SettingHelper.load(SettingKey.APP_DOMAIN);
  return `${host}/api/member/export-import-results?x-token=${context.token}`;
};

const Mutation = {
  importMembers,
};
export default { Mutation };

// const data = [
//   721344,
// 721400,
// 720300,
// 715100,
// 716040,
// 720400,
// 720100,
// 721262,
// 720700,
// 715000,
// 721000,
// 715300,
// 715963,
// 716323,
// 716300,
// 716200,
// 716500
// 715401
// 727025
// 718268
// 717066
// 725060
// 727010
// 728100
// 727729
// 717000
// 727000
// 718500
// 727300
// 717400
// 727700
// 727400
// 725600
// 725000
// 717244
// 727900
// 717344
// 726095
// 717866
// 749575
// 749000
// 752800
// 751500
// 747400
// 746000
// 751000
// 748000
// 747160
// 748020
// 752702
// 751100
// 752710
// 746868
// 748010
// 748500
// 746768
// 746446
// 750100
// 752428
// 710235
// 710234
// 710400
// 700900
// 700000
// 710880
// 710236
// 722200
// 713100
// 722100
// 722000
// 713200
// 710700
// 710100
// 722300
// 713000
// 713110
// 714100
// 712163
// 710548
// 710229
// 758409
// 759000
// 759600
// 759010
// 759120
// 758500
// 758000
// 758100
// 758118
// 759300
// 759500
// 759400
// 759200
// 729732
// 731071
// 731500
// 729450
// 731000
// 729930
// 729700
// 729110
// 729400
// 729430
// 731200
// 731722
// 732110
// 729635
// 731900
// 729160
// 729540
// 729033
// 731100
// 729100
// 729213
// 729800
// 731701
// 731624
// 731300
// 756036
// 754000
// 756100
// 754100
// 756600
// 756110
// 756700
// 756000
// 756923
// 756336
// 756200
// 755071
// 740165
// 740030
// 743800
// 740500
// 743000
// 743500
// 740200
// 743100
// 740310
// 743010
// 740100
// 742000
// 744910
// 740300
// 733038
// 733600
// 734631
// 734200
// 733900
// 734900
// 733000
// 734800
// 733800
// 734300
// 733530
// 733701
// 734901
// 734400
// 734001
// 734500
// 734700
// 733300
// 734100
// 733801
// 733400
// 733200
// 736114
// 760130
// 760000
// 736090
// 736300
// 760400
// 736100
// 736000
// 760310
// 736600
// 760320
// 737300
// 760717
// 760820
// 760551
// 736923
// 736919
// 760212
// 763430
// 738015
// 762800
// 739210
// 738100
// 763200
// 762300
// 738000
// 739500
// 762000
// 763710
// 763700
// 738300
// 738800
// 763310
// 762530
// 762742
// 738400
// 763100
// 739400
// 738600
// 739401
// 739300
// 738601
// 738101
// 739000
// 738500

// ]

// const testFn = async() => {

//   const members = await MemberModel.find();
//   const ids = members.map(m=>m.code);

//   const data = [
//     "721344",
//     "721400",
//     "720300",
//     "715100",
//     "716040",
//     "720400",
//     "720100",
//     "721262",
//     "720700",
//     "715000",
//     "721000",
//     "715300",
//     "715963",
//     "716323",
//     "716300",
//     "716200",
//     "716500",
//     "715401",
//     "727025",
//     "718268",
//     "717066",
//     "725060",
//     "727010",
//     "728100",
//     "727729",
//     "717000",
//     "727000",
//     "718500",
//     "727300",
//     "717400",
//     "727700",
//     "727400",
//     "725600",
//     "725000",
//     "717244",
//     "727900",
//     "717344",
//     "726095",
//     "717866",
//     "749575",
//     "749000",
//     "752800",
//     "751500",
//     "747400",
//     "746000",
//     "751000",
//     "748000",
//     "747160",
//     "748020",
//     "752702",
//     "751100",
//     "752710",
//     "746868",
//     "748010",
//     "748500",
//     "746768",
//     "746446",
//     "750100",
//     "752428",
//     "710235",
//     "710234",
//     "710400",
//     "700900",
//     "700000",
//     "710880",
//     "710236",
//     "722200",
//     "713100",
//     "722100",
//     "722000",
//     "713200",
//     "710700",
//     "710100",
//     "722300",
//     "713000",
//     "713110",
//     "714100",
//     "712163",
//     "710548",
//     "710229",
//     "758409",
//     "759000",
//     "759600",
//     "759010",
//     "759120",
//     "758500",
//     "758000",
//     "758100",
//     "758118",
//     "759300",
//     "759500",
//     "759400",
//     "759200",
//     "729732",
//     "731071",
//     "731500",
//     "729450",
//     "731000",
//     "729930",
//     "729700",
//     "729110",
//     "729400",
//     "729430",
//     "731200",
//     "731722",
//     "732110",
//     "729635",
//     "731900",
//     "729160",
//     "729540",
//     "729033",
//     "731100",
//     "729100",
//     "729213",
//     "729800",
//     "731701",
//     "731624",
//     "731300",
//     "756036",
//     "754000",
//     "756100",
//     "754100",
//     "756600",
//     "756110",
//     "756700",
//     "756000",
//     "756923",
//     "756336",
//     "756200",
//     "755071",
//     "740165",
//     "740030",
//     "743800",
//     "740500",
//     "743000",
//     "743500",
//     "740200",
//     "743100",
//     "740310",
//     "743010",
//     "740100",
//     "742000",
//     "744910",
//     "740300",
//     "733038",
//     "733600",
//     "734631",
//     "734200",
//     "733900",
//     "734900",
//     "733000",
//     "734800",
//     "733800",
//     "734300",
//     "733530",
//     "733701",
//     "734901",
//     "734400",
//     "734001",
//     "734500",
//     "734700",
//     "733300",
//     "734100",
//     "733801",
//     "733400",
//     "733200",
//     "736114",
//     "760130",
//     "760000",
//     "736090",
//     "736300",
//     "760400",
//     "736100",
//     "736000",
//     "760310",
//     "736600",
//     "760320",
//     "737300",
//     "760717",
//     "760820",
//     "760551",
//     "736923",
//     "736919",
//     "760212",
//     "763430",
//     "738015",
//     "762800",
//     "739210",
//     "738100",
//     "763200",
//     "762300",
//     "738000",
//     "739500",
//     "762000",
//     "763710",
//     "763700",
//     "738300",
//     "738800",
//     "763310",
//     "762530",
//     "762742",
//     "738400",
//     "763100",
//     "739400",
//     "738600",
//     "739401",
//     "739300",
//     "738601",
//     "738101",
//     "739000",
//     "738500",
//   ];

//   for (const item of data) {
//     cons
//   }

  
// };
