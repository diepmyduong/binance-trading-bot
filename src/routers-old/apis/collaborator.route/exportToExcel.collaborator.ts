import Excel from "exceljs";
import { get, set } from "lodash";
import { Types } from "mongoose";

import { Request, Response } from "../../../base/baseRoute";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../../graphql/context";
import {
  CollaboratorModel,
  ICollaborator,
} from "../../../graphql/modules/collaborator/collaborator.model";
import { Gender } from "../../../graphql/modules/member/member.model";
import { UtilsHelper } from "../../../helpers";

const STT = "STT";
const NAME = "Tên";
const PHONE = "Số điện thoại";
const RESULT = "Kết quả";
const ERROR = "Lỗi";
const THANH_CONG = "Thành công";
const LOI = "Lỗi";
const RESULT_IMPORT_FILE_NAME = "ket_qua_import_cong_tac_vien";
const RESULT_FILE_NAME = "danh_sach_cong_tac_vien";
const SHEET_NAME = "Sheet1";

const IS_COLLABORATOR = "Đã đăng nhập";
const ADDRESS = "Địa chỉ";
const GENDER = "Giới tính";

export const exportToExcel = async (req: Request, res: Response) => {
  const context = (req as any).context as Context;
  context.auth(ROLES.ADMIN_EDITOR_MEMBER);

  const $match = {};
  if (context.isMember()) {
    set($match, "memberId", Types.ObjectId(context.id));
  }
  const data: ICollaborator[] = await CollaboratorModel.aggregate([
    { $match: $match },
    {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer",
      },
    },
    { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
  ]);

  const workbook = new Excel.Workbook();
  const sheet = workbook.addWorksheet(SHEET_NAME);
  const excelHeaders = [STT, NAME, PHONE, IS_COLLABORATOR, ADDRESS, GENDER];
  sheet.addRow(excelHeaders);

  data.forEach((d: ICollaborator, i) => {
    const dataRow = [
      i + 1,
      d.name,
      d.phone,
      get(d, "customer") ? "√" : "",
      get(d, "customer.address", ""),
      get(d, "customer") ? (get(d, "customer.gender") === Gender.MALE ? "Nam" : "Nữ") : "",
    ];
    sheet.addRow(dataRow);
  });

  UtilsHelper.setThemeExcelWorkBook(sheet);

  return UtilsHelper.responseExcel(res, workbook, RESULT_FILE_NAME);
};
