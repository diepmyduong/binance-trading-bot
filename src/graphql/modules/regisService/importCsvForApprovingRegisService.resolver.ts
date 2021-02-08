import csv from "csv-parser";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { RegisServiceModel, RegisServiceStatus } from "./regisService.model";
import { onApprovedRegisService } from "../../../events/onApprovedRegisService.event";
import { getDataFromExcelStream, getJsonFromCSVStream, modifyCSVData, modifyExcelData } from "../../../helpers/workSheet";
import { ProductModel } from "../product/product.model";


const H1 = "Phone";
const H2 = "Code";

const HEADER_SVG = [H1, H2];

//[Backend] Cung cấp API import file excel chưa danh sách số điện thoại đăng ký dịch vụ cần duyệt
const importCsvForApprovingRegisService = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { csvFile: excelFile } = args;
  // console.log('csvFile', csvFile);
  const { stream } = await excelFile;

  const result: any = await getDataFromExcelStream(stream);

  // console.log('result', result);
  const [data, errorData] = modifyExcelData(result, HEADER_SVG, false);
  // console.log('data', data);
  if (data.length === 0) {
    throw ErrorHelper.requestDataInvalid("File import không có dữ liệu");
  }

  const updatedRegisServices = [];

  for (let i = 0; i < data.length; i++) {
    const regisService = data[i];

    const registerPhone = regisService[H1];
    const productCode = regisService[H2];

    const alreadyProduct = await ProductModel.findOne({ code: productCode });

    const alreadyExistRegisService = await RegisServiceModel.findOne({
      registerPhone,
      productId: alreadyProduct._id,
      status: RegisServiceStatus.PENDING
    });

    if (!alreadyExistRegisService)
      return;

    alreadyExistRegisService.status = RegisServiceStatus.COMPLETED;
    const updated = await alreadyExistRegisService.save();
    updatedRegisServices.push(updated);
  }

  // chạy promise 1 lần để lấy danh sách đã update status
  return Promise.all(updatedRegisServices).then((res) => {
    for (const r of res) {
      onApprovedRegisService.next(r);
    }
    return {
      successLines: data.map(d => d.Line),
      errorLines: errorData.map(d => d.Line)
    }
  });
};

const Mutation = {
  importCsvForApprovingRegisService,
};
export default { Mutation };