import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../../helpers";
import { Context } from "../../../context";
import {
  getDataFromExcelStream,
  modifyExcelData,
} from "../../../../helpers/workSheet";
import { SettingHelper } from "../../setting/setting.helper";
import { SettingKey } from "../../../../configs/settingData";
import { ProductImportingLogModel } from "../../productImportingLog/productImportingLog.model";
import { ProductModel, ProductType } from "../product.model";
import { CategoryModel } from "../../category/category.model";

const STT = "STT";
const CODE = "Mã sản phẩm";
const NAME = "Tên sản phẩm";
const DESC = "Mô tả";
const TYPE = "Loại sản phẩm";
const CATEGORY = "Danh mục";
const IMAGE = "Hình ảnh (đường link)";
const PRICE = "Giá tiền";
const LENGTH = "Chiều dài (cm)";
const WIDTH = "Chiều rộng (cm)";
const HEIGHT = "Chiều cao (cm)";
const WEIGHT = "Khối lượng (gr)";
const COMMISSION_1 = "Hoa hồng cho người bán trực tiếp";
const COMMISSION_2 = "Hoa hồng cho người giới thiệu";
const COMMISSION_3 = "Hoa hồng kho";
const LINE = "line";

const HEADER_DATA = [
  STT,
  NAME,
  CODE,
  DESC,
  TYPE,
  CATEGORY,
  IMAGE,
  PRICE,
  LENGTH,
  WIDTH,
  HEIGHT,
  WEIGHT,
  COMMISSION_1,
  COMMISSION_2,
  COMMISSION_3,
];

//[Backend] Cung cấp API import file excel chưa danh sách số điện thoại đăng ký dịch vụ cần duyệt
const importProducts = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
  const { file: excelFile } = args;
  const { stream } = await excelFile;
  const result: any = await getDataFromExcelStream(stream);
  let [data, errors] = modifyExcelData(result, HEADER_DATA);

  errors = errors.map((err) => new ProductImportingLogModel({ ...err }));
  const dataList = [],
    logList = [...errors];

  const logLength = await ProductImportingLogModel.count({});
  if (logLength > 0) await ProductImportingLogModel.collection.drop();

  for (let i = 0; i < data.length; i++) {
    let success = true;
    const errors = [];

    const excelRow = data[i];
    const line = excelRow[LINE];
    const no = excelRow[STT];
    const code = excelRow[CODE];
    const name = excelRow[NAME];
    const desc = excelRow[DESC]; // Mô tả	Loại sản phẩm
    const category = excelRow[CATEGORY]; // Danh mục
    const image = excelRow[IMAGE]; // Hình ảnh (đường link)
    const price = excelRow[PRICE]; // Giá tiền
    const productLength = excelRow[LENGTH]; // Chiều dài (cm)
    const productWidth = excelRow[WIDTH]; // Chiều rộng (cm)
    const productHeight = excelRow[HEIGHT]; // Chiều cao (cm)
    const productWeight = excelRow[WEIGHT]; // Khối lượng (gr)
    const commission1 = excelRow[COMMISSION_1]; // Hoa hồng cho người bán trực tiếp
    const commission2 = excelRow[COMMISSION_2]; // Hoa hồng cho người giới thiệu
    const commission3 = excelRow[COMMISSION_3]; // Hoa hồng cho người giới thiệu

    if (!code) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${CODE}]`).message
      );
    }

    if (!name) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${NAME}]`).message
      );
    }

    if (!name) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${NAME}]`).message
      );
    }

    if (!desc) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${DESC}]`).message
      );
    }

    if (!category) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${CATEGORY}]`)
          .message
      );
    }

    // if (!image) {
    //   success = false;
    //   errors.push(
    //     ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${IMAGE}]`).message
    //   );
    // }

    if (!price) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${PRICE}]`).message
      );
    }

    if (!productLength) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${LENGTH}]`)
          .message
      );
    }

    if (!productWidth) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${WIDTH}]`).message
      );
    }

    if (!productHeight) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${HEIGHT}]`)
          .message
      );
    }

    if (!productWeight) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${WEIGHT}]`)
          .message
      );
    }

    if (!commission1) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${COMMISSION_1}]`)
          .message
      );
    }

    if (!commission2) {
      success = false;
      errors.push(
        ErrorHelper.requestDataInvalid(`. Thiếu dữ liệu cột [${COMMISSION_2}]`)
          .message
      );
    }

    console.log("vào đây");

    console.log("category", category);

    const categoryEnt = await CategoryModel.findOne({ name: category });

    const params = {
      line,
      no,
      code,
      name,
      desc,
      category,
      categoryId: categoryEnt.id,
      image,
      price,
      productLength,
      productWidth,
      productHeight,
      productWeight,
      commission1,
      commission2,
      commission3,
    };

    logList.push({ ...params, success, error: errors.join("\n") });
    if (success === true) {
      dataList.push(
        new ProductModel({
          code: params.code,
          name: params.name,
          isPrimary: true,
          isCrossSale: false,
          crossSaleInventory: 0,
          crossSaleOrdered: 0,
          type: ProductType.RETAIL,
          categoryId: params.categoryId,

          basePrice: params.price, // Gía bán
          subtitle: params.desc, // Mô tả ngắn
          intro: params.desc, // Giới thiệu sản phẩm
          image: params.image, // Hình ảnh đại diện
          commission0: 0, // Hoa hồng Mobifone
          commission1: params.commission1, // Hoa hồng điểm bán
          commission2: params.commission2, // Hoa hồng giới thiệu
          commission3: params.commission3, // hoa hồng điểm bán
          // baseCommission: number; // Hoa hồng CHO ĐIỂM BÁN
          enabledMemberBonus: false, // Thưởng cho điểm bán
          enabledCustomerBonus: false, // Thưởng cho khách hàng
          // categoryId: string; // Danh mục sản phẩm
          // smsSyntax: string; // Cú pháp SMS
          // smsPhone: string; // SMS tới số điện thoại
          priority: 99, // độ ưu tiên
          allowSale: true, // Mở bán
          // memberId: string; // Mã thành viên quản lý sản phẩm
          // qty: 100

          width: params.productWidth, // chiều rộng
          length: params.productLength, // chiều dài
          height: params.productHeight, // chiều cao
          weight: params.productWeight, // cân nặng
        })
      );
    }
  }

  // console.log("dataList", dataList);
  // console.log("logList", logList);

  for (const data of dataList) {
    const product = await ProductModel.findOne({ name: data.name });
    if(product){
      await ProductModel.findByIdAndUpdate(
        product.id,
        {
          code: data.code,
          name: data.name,
          isPrimary: true,
          isCrossSale: false,
          crossSaleInventory: 0,
          crossSaleOrdered: 0,
          type: ProductType.RETAIL,
          categoryId: data.categoryId,
  
          basePrice: data.basePrice, // Gía bán
          subtitle: data.subtitle, // Mô tả ngắn
          intro: data.intro, // Giới thiệu sản phẩm
          commission0: 0, // Hoa hồng Mobifone
          commission1: data.commission1, // Hoa hồng điểm bán
          commission2: data.commission2, // Hoa hồng giới thiệu
          commission3: data.commission3, // hoa hồng điểm bán
          // baseCommission: number; // Hoa hồng CHO ĐIỂM BÁN
          enabledMemberBonus: false, // Thưởng cho điểm bán
          enabledCustomerBonus: false, // Thưởng cho khách hàng
          // categoryId: string; // Danh mục sản phẩm
          // smsSyntax: string; // Cú pháp SMS
          // smsPhone: string; // SMS tới số điện thoại
          priority: 99, // độ ưu tiên
          allowSale: true, // Mở bán
          // memberId: string; // Mã thành viên quản lý sản phẩm
          // qty: 100
  
          width: data.width, // chiều rộng
          length: data.length, // chiều dài
          height: data.height, // chiều cao
          weight: data.weight, // cân nặng
        },
        { new: true }
      );
    }
    else{
      ProductModel.insertMany(data);
    }
  }

  await Promise.all([
    // ProductModel.insertMany(dataList),
    ProductImportingLogModel.insertMany(logList),
  ]);

  const host = await SettingHelper.load(SettingKey.APP_DOMAIN);
  return `${host}/api/product/export-import-results?x-token=${context.token}`;
};

const Mutation = {
  importProducts,
};
export default { Mutation };
