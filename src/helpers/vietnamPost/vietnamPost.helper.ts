import Axios from "axios";
import { get } from "lodash";
import moment from "moment";
import { configs } from "../../configs";
import { ShipServicePricing } from "../../graphql/modules/order/types/shipServicePricing.type";
import { ErrorHelper } from "../error.helper";

export enum ServiceCode {
  EMS = "EMS", //"Chuyển phát nhanh",
  BK = "BK", //"Chuyển phát thường",
  ECOD = "ECOD", //ECOD
  TMDT_EMS = "TMDT_EMS", //"TMĐT-Chuyển phát nhanh EMS",
  TMDT_BK = "TMDT_BK", //TMĐT-Chuyển phát tiêu chuẩn
  TMDT_EMS_TK = "TMDT_EMS_TK", // TMĐT-Chuyển phát nhanh EMS tiết kiệm (liên vùng)
}

export enum AdditionService {
  GIAO_HANG_THU_TIEN= 3,
  BAO_PHAT = 2,
  DICH_VU_HOA_DON = 4
}

export type IWardTypeResponse = {
  MaPhuongXa: string;
  TenPhuongXa: string;
  MaQuanHuyen: string;
  TenQuanHuyen: string;
  MaTinhThanh: string;
  TenTinhThanh: string;
};

export type ICalculateAllShipFeeRequest = {
  MaDichVu: string;
  MaTinhGui: string;
  MaQuanGui: string;
  MaTinhNhan: string;
  MaQuanNhan: string;
  Dai: number;
  Rong: number;
  Cao: number;
  KhoiLuong: number;
  ThuCuocNguoiNhan: boolean;
  LstDichVuCongThem: any[];
};

export type IServiceResponse = {
  IDDanhMucDichVu: number;
  TenDanhMucDichVu: string;
  MaDichVu: string;
  ServiceType: number;
  IsLo: Boolean;
  IsDonLe: Boolean;
  CanPhanQuyen: Boolean;
  Checked: Boolean;
  IsGanKhachHang: Boolean;
};

export type ICreateDeliveryOrderRequest = {
  OrderCode: string; // mã đơn hàng
  VendorId: number; // 1;
  PickupType: number; //1;
  IsPackageViewable: boolean; // cho xem hàng
  PackageContent: string; //"Món hàng A + Món hàng B"; // nội dung hàng
  ServiceName: string; //"BK"; // tên dịch vụ
  SenderFullname: string; // tên người gửi
  SenderAddress: string; // địa chỉ gửi
  SenderTel: string; // phone người gửi
  SenderProvinceId: string; // mã tỉnh người gửi
  SenderDistrictId: string; // mã quận người gửi
  SenderWardId: string; // mã phường người gửi
  ReceiverFullname: string; // tên người nhận
  ReceiverAddress: string; // địa chỉ nhận
  ReceiverTel: string; // phone người nhận
  ReceiverProvinceId: string; // mã tỉnh người nhận
  ReceiverDistrictId: string; // mã quận người nhận
  ReceiverWardId: string; // mã phường người nhận
  CodAmountEvaluation: string; // giá trị tiền thu hộ
  OrderAmountEvaluation: string; // giá trị đơn hàng
  WeightEvaluation: string; // cân nặng
  WidthEvaluation: string; // chiều rộng
  LengthEvaluation: string; // chiều dài
  HeightEvaluation: string; // chiều cao
  VASIds: number[]; //[3, 1, 2, 4]; // dịch vụ cộng thêm
  // 0: {IDDichVuCongThem: 3, TenDichVuCongThem: "Giao hàng thu tiền", Sotien: 0, CuocDVCT: 17000}
  // 1: {IDDichVuCongThem: 1, TenDichVuCongThem: "Khai giá", Sotien: 0, CuocDVCT: 16500}
  // 2: {IDDichVuCongThem: 2, TenDichVuCongThem: "Báo phát", Sotien: 0, CuocDVCT: 5500}
  // 3: {IDDichVuCongThem: 4, TenDichVuCongThem: "Dịch vụ hóa đơn", Sotien: 0, CuocDVCT: 11000}
  IsReceiverPayFreight: boolean; // thu cước người nhận
  CustomerNote: string; // yêu cầu khác
  DraftOrderId: string; // đơn nháp id
  IsDeleteDraft: boolean; // true; // xóa đơn nháp
  LstImageId: []; // danh sách hàng ảnh
  SenderAddressType: number; // loại địa chỉ người gửi
  ReceiverAddressType: number; // loại địa chỉ người nhận
};

export type ICalculateAllShipFeeRespone = {
  TrongLuongQuyDoiGoc: number; //500;
  MaDichVu: string; //"EMS";
  TrongLuongQuyDoi: number; //630;
  CuocChinh: number; //41800;
  PhuPhiVungXa: number; //0;
  PhuPhiXangDau: number; //7106;
  TongCuocTruocVAT: number; //48906;
  VAT: number; //4891;
  TongCuocSauVAT: number; //53797,
  NgayNhan: string; //"0001-01-01T00:00:00",
  NgayDen: string; //"0001-01-01T00:00:00",
  LstDichVuCongThem: any[];
  TongCuocBaoGomDVCT: number;
  SoTienCodThuNoiNguoiNhan: number;
  TongCuocDichVuCongThem: number;
  CuocCod: number;
  OrtherFreight: number;
  OriginalMainFreight: number;
  OriginalSubFreight: number;
  OriginalFuelSurchargeFreight: number;
  OriginalFarRegionFreight: number;
  OriginalAirSurchargeFreight: number;
  OriginalVATFreight: number;
  OriginalVATPercentage: number;
  OriginalTotalFreight: number;
  OriginalTotalFreightVAT: number;
  OriginalTotalFreightDiscount: number;
  OriginalTotalFreightDiscountVAT: number;
  OriginalPaymentFreight: number;
  OriginalPaymentFreightVAT: number;
  OriginalPaymentFreightDiscount: number;
  OriginalPaymentFreightDiscountVAT: number;
  OriginalRemainingFreight: number;
  OriginalRemainingFreightVAT: number;
  OriginalRemainingFreightDiscount: number;
  OriginalRemainingFreightDiscountVAT: number;
  NoiTinh: boolean;
  HeSoVungXa: number;
  HeSoXangDau: number;
  HeSoHaiDao: number;
  TiLeQuyDoiTrongLuong: number;
  HaiDao: boolean;
  CuocChinhChuaNhanHeSo: number;
  NguoiGuiVxhd: memberProps;
  NguoiNhanVxhd: memberProps;
  Success: boolean;
  Message: string;
  MaDichVuBccp: string;
  IsVungXa: boolean;
  BangGiaNoiTinh: any;
  BangCuocNoiTinh: any;
  ThoiGianPhatDuKien: string;
  ThoiGianThuGomDuKien: string;
  KhuVuc: any;
};

export class VietnamPostHelper {
  static host = configs.vietnamPost.host;
  static getProvinces() {
    return Axios.get(`${this.host}/TinhThanh/GetAll`).then((res) =>
      get(res, "data")
    );
  }
  static getDistricts() {
    return Axios.get(`${this.host}/QuanHuyen/GetAll`).then((res) =>
      get(res, "data")
    );
  }
  static getWards(): IWardTypeResponse[] {
    const result: any = Axios.get(`${this.host}/PhuongXa/GetAll`).then((res) =>
      get(res, "data")
    );
    return result;
  }

  static getListServiceOffline() {
    return [
      { code: "EMS", name: "Chuyển phát nhanh" },
      { code: "BK", name: "Chuyển phát thường" },
      { code: "ECOD", name: "ECOD" },
      { code: "TMDT_EMS", name: "TMĐT-Chuyển phát nhanh EMS" },
      { code: "TMDT_BK", name: "TMĐT-Chuyển phát tiêu chuẩn" },
      {
        code: "TMDT_EMS_TK",
        name: " TMĐT-Chuyển phát nhanh EMS tiết kiệm (liên vùng)",
      },
    ];
  }

  static getListService() {
    const url = `${this.host}/CustomerOrder/GetListDichVuChuyenPhatDonLe`;
    return Axios.get(url, {
      // TYPE: 2,
    })
      .then((res) => {
        let services: IServiceResponse[] = get(res, "data");
        return services.map((service) => {
          return {
            code: service.MaDichVu,
            name: service.TenDanhMucDichVu,
          };
        });
      })
      .catch(() => {
        return {
          code: null,
          name: null,
        };
      });
  }

  static createDeliveryOrder(data: ICreateDeliveryOrderRequest) {
    return Axios.post(`${this.host}/order/createOrder`, data, {
      headers: {
        "h-token": configs.vietnamPost.token,
      },
    }).then((res) => {
      const data = get(res, "data");
      console.log("data", data);
      // return {
      //   orderNumber: bill["ORDER_NUMBER"],
      //   moneyCollection: bill["MONEY_COLLECTION"],
      //   exchangeWeight: bill["EXCHANGE_WEIGHT"],
      //   moneyTotal: bill["MONEY_TOTAL"],
      //   moneyTotalFee: bill["MONEY_TOTAL_FEE"],
      //   moneyFee: bill["MONEY_FEE"],
      //   moneyCollectionFee: bill["MONEY_COLLECTION_FEE"],
      //   moneyOtherFee: bill["MONEY_OTHER_FEE"],
      //   moneyVAS: bill["MONEY_VAS"],
      //   moneyVAT: bill["MONEY_VAT"],
      //   KPI_HT: bill["KPI_HT"],
      //   receiverProvince: bill["RECEIVER_PROVINCE"].toString(),
      //   receiverDistrict: bill["RECEIVER_DISTRICT"].toString(),
      //   receiverWard: bill["RECEIVER_WARDS"].toString(),
      // } as Bill;
    });
  }

  static calculateAllShipFee(
    data: ICalculateAllShipFeeRequest
  ): ICalculateAllShipFeeRespone {
    //https://donhang.vnpost.vn/api/api/TinhCuoc/TinhTatCaCuoc
    // console.log("data", data);
    const result: any = Axios.post(
      `${this.host}/TinhCuoc/TinhTatCaCuoc`,
      data
    ).then((res) => get(res, "data"));
    return result;
  }

  // static getPriceAll({
  //   senderProvince,
  //   senderDistrict,
  //   receiverProvince,
  //   receiverDistrict,
  //   producType = "HH",
  //   productWeight = 300,
  //   productPrice,
  //   moneyCollection,
  //   type = 1,
  // }: GetAllPriceProps) {
  //   return Axios.post(`${this.host}/order/getPriceAll`, {
  //     SENDER_PROVINCE: parseInt(senderProvince.toString()),
  //     SENDER_DISTRICT: parseInt(senderDistrict.toString()),
  //     RECEIVER_PROVINCE: parseInt(receiverProvince.toString()),
  //     RECEIVER_DISTRICT: parseInt(receiverDistrict.toString()),
  //     PRODUCT_TYPE: producType,
  //     PRODUCT_WEIGHT: productWeight,
  //     PRODUCT_PRICE: productPrice,
  //     MONEY_COLLECTION: moneyCollection.toString(),
  //     TYPE: type,
  //   }).then(
  //     (res) =>
  //       get(res, "data", []).map(
  //         (r: any) =>
  //           ({
  //             code: r["MA_DV_CHINH"],
  //             name: r["TEN_DICHVU"],
  //             price: r["GIA_CUOC"],
  //             time: r["THOI_GIAN"],
  //             exchangeWeight: r["EXCHANGE_WEIGHT"],
  //           } as ShipServicePricing)
  //       ) as ShipServicePricing[]
  //   );
  // }

  // static getPricing({
  //   productWeight = 300,
  //   productPrice,
  //   moneyCollection,
  //   orderServiceAdd = "",
  //   orderService = "VCN",
  //   senderProvince,
  //   senderDistrict,
  //   receiverProvince,
  //   receiverDistrict,
  //   productType = "HH",
  //   nationalType = 1,
  // }: GetPricingProps) {
  //   return Axios.post(`${this.host}/order/getPriceAll`, {
  //     PRODUCT_WEIGHT: productWeight,
  //     PRODUCT_PRICE: productPrice,
  //     MONEY_COLLECTION: moneyCollection,
  //     ORDER_SERVICE_ADD: orderServiceAdd,
  //     ORDER_SERVICE: orderService,
  //     SENDER_PROVINCE: parseInt(senderProvince.toString()),
  //     SENDER_DISTRICT: parseInt(senderDistrict.toString()),
  //     RECEIVER_PROVINCE: parseInt(receiverProvince.toString()),
  //     RECEIVER_DISTRICT: parseInt(receiverDistrict.toString()),
  //     PRODUCT_TYPE: productType,
  //     NATIONAL_TYPE: nationalType,
  //   }).then((res) => get(res, "data"));
  // }

  // static getListInventory() {
  //   return Axios.get(`${this.host}/user/listInventory`, {
  //     headers: { token: configs.viettelPost.token },
  //   }).then((res) => {
  //     return get(res, "data.data", []).map((r: any) => {
  //       return {
  //         groupaddressId: r["groupaddressId"].toString(),
  //         cusId: r["cusId"].toString(),
  //         name: r["name"],
  //         phone: r["phone"],
  //         address: r["address"],
  //         provinceId: r["provinceId"].toString(),
  //         districtId: r["districtId"].toString(),
  //         wardsId: r["wardsId"].toString(),
  //       };
  //     }) as Inventory[];
  //   });
  // }

  // static registerInventory({ name, phone, address, wardId }: any) {
  //   return Axios.post(
  //     `${this.host}/user/registerInventory`,
  //     {
  //       PHONE: phone,
  //       NAME: name,
  //       ADDRESS: address,
  //       WARDS_ID: parseInt(wardId),
  //     },
  //     {
  //       headers: { token: configs.viettelPost.token },
  //     }
  //   ).then((res) => {
  //     return get(res, "data.data", [])
  //       .map((r: any) => {
  //         return {
  //           groupaddressId: r["groupaddressId"].toString(),
  //           cusId: r["cusId"].toString(),
  //           name: r["name"],
  //           phone: r["phone"],
  //           address: r["address"],
  //           provinceId: r["provinceId"].toString(),
  //           districtId: r["districtId"].toString(),
  //           wardsId: r["wardsId"].toString(),
  //         };
  //       })
  //       .find((r: any) => r.wardsId == parseInt(wardId)) as Inventory;
  //   });
  // }

  // static updateOrder({ orderNumber, type, note, date }: UpdateOrderProps) {
  //   return Axios.post(
  //     `${this.host}/order/UpdateOrder`,
  //     {
  //       TYPE: type,
  //       ORDER_NUMBER: orderNumber,
  //       NOTE: note,
  //       DATE:
  //         type == UpdateOrderType.reorder
  //           ? moment(date).format("DD/MM/YYYY HH:mm:ss")
  //           : undefined,
  //     },
  //     {
  //       headers: { token: configs.viettelPost.token },
  //     }
  //   ).then((res) => {
  //     if (get(res, "data.status") == 200) return get(res, "data.message");
  //     else throw ErrorHelper.externalRequestFailed(get(res, "data.message"));
  //   });
  // }

  // static trackingOrderStatus(orderNumber: string) {
  //   return Axios.get(
  //     `https://api.viettelpost.vn/api/setting/listOrderTrackingVTP`,
  //     {
  //       headers: { token: configs.viettelPost.token },
  //       params: { OrderNumber: orderNumber },
  //     }
  //   ).then((res) => {
  //     return get(res, "data.0");
  //   });
  // }

  // static getLinkPrint(orderNumbers: string[]) {
  //   if (!configs.viettelPost.printToken)
  //     throw ErrorHelper.somethingWentWrong(
  //       "Chưa cấu hình khoá in vận đơn từ Viettel Post."
  //     );
  //   return Axios.post(
  //     `${this.host}/order/encryptLinkPrint`,
  //     {
  //       TYPE: 1,
  //       ORDER_ARRAY: orderNumbers,
  //       EXPIRY_TIME: moment().add(5, "minutes").toDate().getTime(),
  //       PRINT_TOKEN: configs.viettelPost.printToken,
  //     },
  //     {
  //       headers: { token: configs.viettelPost.token },
  //     }
  //   ).then((res) => {
  //     if (get(res, "data.status") == 200)
  //       return get(res, "data.message") as string;
  //     else throw ErrorHelper.externalRequestFailed(get(res, "data.message"));
  //   });
  // }
}

///////////////////////////

enum UpdateOrderType {
  confirm = 1,
  returnShipping = 2,
  deliveryAgain = 3,
  cancel = 4,
  reorder = 5,
  deleteCancel = 11,
}
type UpdateOrderProps = {
  orderNumber: string;
  type: UpdateOrderType;
  note: string;
  date: Date;
};
type Ward = {
  wardId: string;
  wardName: string;
  districtId: string;
};

type GetAllPriceProps = {
  senderProvince?: string;
  senderDistrict?: string;
  receiverProvince?: string;
  receiverDistrict?: string;
  producType?: string;
  productWeight?: number;
  productPrice?: number;
  moneyCollection?: number;
  type?: number;
};

type GetPricingProps = {
  productWeight?: number;
  productPrice?: number;
  moneyCollection?: number;
  orderServiceAdd?: string;
  orderService?: string;
  senderProvince?: string;
  senderDistrict?: string;
  receiverProvince?: string;
  receiverDistrict?: string;
  productType?: string;
  nationalType?: number;
};

type BillItem = {
  productName: string;
  productPrice: number;
  productWeight: number;
  productQty: number;
};

type Inventory = {
  groupaddressId: string; // Mã kho
  cusId: string; // Mã khách hàng
  name: string; // Tên kho
  phone: string; // Điện thoại
  address: string; // Địa chỉ
  provinceId: string; // Mã tỉnh thành
  districtId: string; // Mã quận huyện
  wardsId: string; // Mã phường xã
};

type Bill = {
  orderNumber: string;
  moneyCollection: number;
  exchangeWeight: number;
  moneyTotal: number;
  moneyTotalFee: number;
  moneyFee: number;
  moneyCollectionFee: number;
  moneyOtherFee: number;
  moneyVAS: number;
  moneyVAT: number;
  KPI_HT: number;
  receiverProvince: string;
  receiverDistrict: string;
  receiverWard: string;
};

export type memberProps = {
  QuyUocVungXaHaiDaoId: string;
  VungXa: boolean;
  HaiDao: boolean;
  MaDichVu: string;
  MaTinhThanh: string;
  MaQuanHuyen: string;
  MaPhuongXa: string;
};
