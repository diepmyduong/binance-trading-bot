
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { RegisSMSModel, RegisSMSStatus } from "./regisSMS.model";
import { onApprovedSMS } from '../../../events/onApprovedSMS.event';
import { getDataFromExcelStream, modifyExcelData } from "../../../helpers/workSheet";
import { ProductModel } from "../product/product.model";

const H1 = "Phone";
const H2 = "Code";

const HEADER_SVG = [
  H1,
  H2,
];


//[Backend] Cung cấp API import file excel chưa danh sách số điện thoại đăng ký cần duyệt
const importCsvForApprovingSMS = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { csvFile: excelFile } = args;
  const { stream } = await excelFile;

  const result: any = await getDataFromExcelStream(stream);

  // console.log('result', result);
  const [data, errorData] = modifyExcelData(result, HEADER_SVG, false);
  // console.log('data', data);
  if (data.length === 0) {
    throw ErrorHelper.requestDataInvalid("File import không có dữ liệu");
  }

  // console.log("dataImport", data);
  // { Phone: '0708890280', Code: 'SER10030' },
  // { Phone: '0708890280', Code: 'SER10028' },
  // { Phone: '0708890280', Code: 'SER10024' }

  // Kiểm tra số phone có hợp lệ
  // console.log('ids', ids);
  // cần thiết ?
  // lấy ra đơn đăng ký dịch vụ theo số phone và id
  const updatedRegisSMSs = [];
  for (let i = 0; i < data.length; i++) {
    const regisSMS = data[i];

    const registerPhone = regisSMS[H1];
    const productCode = regisSMS[H2];


    const alreadyProduct = await ProductModel.findOne({ code: productCode });

    const alreadyExistRegisSMS = await RegisSMSModel.findOne({
      registerPhone,
      productId: alreadyProduct._id,
      status: RegisSMSStatus.PENDING
    });

    if (!alreadyExistRegisSMS)
      return;

    alreadyExistRegisSMS.status = RegisSMSStatus.COMPLETED;
    const updated = await alreadyExistRegisSMS.save();
    updatedRegisSMSs.push(updated);
  }

  // console.log('updatedRegisSMSs', updatedRegisSMSs);

  // chạy promise 1 lần để lấy danh sách đã update status
  return Promise.all(updatedRegisSMSs).then((res) => {
    for (const r of res) {
      onApprovedSMS.next(r);
    }
    return {
      successLines: data.map(d => d.Line),
      errorLines: errorData.map(d => d.Line)
    }
  });
}

const Mutation = {
  importCsvForApprovingSMS,
};
export default { Mutation };

// (async () => {
//   const root: any = null;
//   const args: any = {
//     id: "5fd1d50e69ce6a342cf73bc2",
//   }

//   const context: any = null;

//   const result = await Mutation.approveRegisService(root, args, context);

//   console.log('result', result);

// })();