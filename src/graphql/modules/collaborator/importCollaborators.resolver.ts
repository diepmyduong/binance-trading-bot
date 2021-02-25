import csv from "csv-parser";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import {
  getDataFromExcelStream,
  modifyExcelData,
} from "../../../helpers/workSheet";
import { CollaboratorImportingLogModel } from "../collaboratorImportingLog/collaboratorImportingLog.model";
import { CollaboratorModel } from "./collaborator.model";
import { SettingHelper } from "../setting/setting.helper";
import { SettingKey } from "../../../configs/settingData";

const STT = "STT";
const NAME = "Tên";
const PHONE = "Số điện thoại";
const LINE = "line";

const HEADER_DATA = [STT, NAME, PHONE];

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

  for (let i = 0; i < data.length; i++) {
    let success = true;
    const errors = [];

    const excelRow = data[i];
    const line = excelRow[LINE];
    const no = excelRow[STT];
    const name = excelRow[NAME];
    const phone = excelRow[PHONE];

    if (!phone) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${PHONE}]`).message
      );
    }

    const collaborator = await CollaboratorModel.findOne({
      phone,
      memberId: context.id,
    });

    // kiem tra co ctv nay ko?
    if (collaborator) {
      success = false;
      errors.push(ErrorHelper.duplicateError(`Cột [${PHONE}]`).message);
    }

    const params = {
      line,
      no,
      name,
      phone,
      memberId: context.id
    };

    // console.log('params',params);

    logList.push({ ...params, success, error: errors.join("\n") });
    if (success === true) {
      dataList.push(new CollaboratorModel(params));
    }
  }

  // console.log("dataList", dataList);
  // console.log("logList", logList);

  await Promise.all([
    CollaboratorModel.insertMany(dataList),
    CollaboratorImportingLogModel.insertMany(logList),
  ]);

  // const host = await SettingHelper.load(SettingKey.APP_DOMAIN);
  const host = "http://localhost:5555";
  return `${host}/api/collaborator/export-import-results?x-token=${context.token}`;
};

const Mutation = {
  importCollaborators,
};
export default { Mutation };
