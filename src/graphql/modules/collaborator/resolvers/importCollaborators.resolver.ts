import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper, KeycodeHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import {
  getDataFromExcelStream,
  modifyExcelData,
} from "../../../../helpers/workSheet";
import { CollaboratorImportingLogModel } from "../../collaboratorImportingLog/collaboratorImportingLog.model";
import { CollaboratorModel } from "../collaborator.model";
import { SettingHelper } from "../../setting/setting.helper";
import { SettingKey } from "../../../../configs/settingData";

const STT = "STT";
const CODE = "Mã";
const NAME = "Tên";
const PHONE = "Số điện thoại";
const LINE = "line";

const HEADER_DATA = [STT, CODE, NAME, PHONE];

const importCollaborators = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
  const { file: excelFile } = args;
  const { stream } = await excelFile;
  const result: any = await getDataFromExcelStream(stream);
  let [data, errors] = modifyExcelData(result, HEADER_DATA);

  errors = errors.map((err) => new CollaboratorImportingLogModel({ ...err }));
  const dataList = [],
    logList = [...errors];

  const logLength = await CollaboratorImportingLogModel.count({});
  if (logLength > 0) await CollaboratorImportingLogModel.collection.drop();


  const _host = await SettingHelper.load(SettingKey.APP_DOMAIN);
  
  for (let i = 0; i < data.length; i++) {
    let success = true;
    const errors = [];

    const excelRow = data[i];
    const line = excelRow[LINE];
    const no = excelRow[STT];
    const code = excelRow[CODE];
    const name = excelRow[NAME];
    const phone = excelRow[PHONE];

    if (!code) {
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${CODE}]`).message
      );
    }

    if (!phone) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${PHONE}]`).message
      );
    }

    const collaborator = await CollaboratorModel.findOne({
      code,
      phone,
      memberId: context.id,
    });

    // kiem tra co ctv nay ko?
    if (collaborator) {
      success = false;
      errors.push(ErrorHelper.duplicateError(`Cột [${PHONE}]`).message);
    }

    const params:any = {
      line,
      no,
      code,
      name,
      phone,
      memberId: context.id,
    };

    const secret = `${phone}-${context.id}`;

    let shortCode = KeycodeHelper.alpha(secret, 6);
    let shortUrl = `${_host}/ctv/${shortCode}`;

    let countShortUrl = await CollaboratorModel.count({ shortUrl });
    while (countShortUrl > 0) {
      shortCode = KeycodeHelper.alpha(secret, 6);
      shortUrl = `${_host}/ctv/${shortCode}`;
      countShortUrl = await CollaboratorModel.count({ shortUrl });
    }
    
    params.shortCode = shortCode;
    params.shortUrl = shortUrl;
    // console.log('params',params);

    logList.push({ ...params, success, error: errors.join("\n") });
    if (success === true) {
      dataList.push(new CollaboratorModel(params));
    }
  }

  await Promise.all([
    CollaboratorModel.insertMany(dataList),
    CollaboratorImportingLogModel.insertMany(logList),
  ]);

  const host = await SettingHelper.load(SettingKey.APP_DOMAIN);
//   const host = "http://localhost:5555";
  return `${host}/api/collaborator/export-import-results?x-token=${context.token}`;
};

const Mutation = {
  importCollaborators,
};
export default { Mutation };
