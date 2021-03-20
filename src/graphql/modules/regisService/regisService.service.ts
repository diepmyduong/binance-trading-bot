import { CrudService } from "../../../base/crudService";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { RegisServiceModel, RegisServiceStatus } from "./regisService.model";
// import { onApprovedRegisService } from "../../../events/onApprovedRegisService.event";
import { getJsonFromCSVStream, modifyCSVData } from "../../../helpers/workSheet";


const H1 = "Phone";
const H2 = "Code";

const HEADER_SVG = [H1, H2];

class RegisServiceService extends CrudService<typeof RegisServiceModel> {
  constructor() {
    super(RegisServiceModel);
  }

  //[Backend] Cung cấp API import file excel chưa danh sách số điện thoại đăng ký dịch vụ cần duyệt
  importCsvForApprovingRegisService = async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { csvFile } = args;
    // console.log('csvFile', csvFile);
    const { stream } = await csvFile;

    const result: any = await getJsonFromCSVStream(stream);

    // console.log('result', result);
    const data = modifyCSVData(result, HEADER_SVG);
    if (data.length === 0) {
      throw ErrorHelper.requestDataInvalid("File import không có dữ liệu");
    }

    // console.log("dataImport", data);
    // { Phone: '0708890280', Code: 'SER10030' },
    // { Phone: '0708890280', Code: 'SER10028' },
    // { Phone: '0708890280', Code: 'SER10024' }

    const registerPhones = data.map((res) => res[H1]);
    const ids = data.map((res) => res[H2]);
    // Kiểm tra số phone có hợp lệ
    // cần thiết ?
    // lấy ra đơn đăng ký dịch vụ theo số phone và id
    const alreadyExistRegisServices = await RegisServiceModel.find({
      registerPhone: { $in: registerPhones },
      code: { $in: ids },
      status: RegisServiceStatus.PENDING,
    });

    if (alreadyExistRegisServices.length === 0) {
      throw ErrorHelper.requestDataInvalid("Db ko có dữ liệu");
    }

    // đẩy hết update từng record vào promise
    await RegisServiceModel.updateMany(
      { _id: { $in: alreadyExistRegisServices.map((s) => s._id) } },
      { $set: { status: RegisServiceStatus.COMPLETED } }
    ).exec();
    const modificationList = alreadyExistRegisServices.map((r) => {
      r.status = RegisServiceStatus.COMPLETED;
      return r;
    });
    // chạy promise 1 lần để lấy danh sách đã update status
    return Promise.all(modificationList).then((res) => {
      for (const r of res) {
        // onApprovedRegisService.next(r);
      }
      return res;
    });
  };

}

const regisServiceService = new RegisServiceService();

export { regisServiceService };
