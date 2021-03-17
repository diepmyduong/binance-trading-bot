import Axios from "axios";
import { bindAll, get } from "lodash";
import moment from "moment";
import { configs } from "../../configs";
import { ShipServicePricing } from "../../graphql/modules/order/types/shipServicePricing.type";
import { ErrorHelper } from "../error.helper";

export enum ServiceCode {
  EMS = "EMS", //"Chuyển phát nhanh",
  BK = "BK", //"Chuyển phát thường",
  ECOD = "ECOD", //ECOD
  DONG_GIA = "DONG_GIA", //đồng giá
  TMDT_EMS = "TMDT_EMS", //"TMĐT-Chuyển phát nhanh EMS",
  TMDT_BK = "TMDT_BK", //TMĐT-Chuyển phát tiêu chuẩn
  TMDT_EMS_TK = "TMDT_EMS_TK", // TMĐT-Chuyển phát nhanh EMS tiết kiệm (liên vùng)
}

export const DeliveryServices = [
  { code: ServiceCode.EMS, name: "Chuyển phát nhanh" },
  { code: ServiceCode.BK, name: "Chuyển phát thường" },
  { code: ServiceCode.DONG_GIA, name: "Đồng giá" },
  { code: ServiceCode.ECOD, name: "ECOD" },
  { code: ServiceCode.TMDT_EMS, name: "TMĐT-Chuyển phát nhanh EMS" },
  { code: ServiceCode.TMDT_BK, name: "TMĐT-Chuyển phát tiêu chuẩn" },
  {
    code: ServiceCode.TMDT_EMS_TK,
    name: "TMĐT-Chuyển phát nhanh EMS tiết kiệm (liên vùng)",
  },
];

export enum AddressType {
  NHA_RIENG = 1,
  CO_QUAN = 2,
  KHONG_CO = null,
}

export const AddressTypes = [
  { code: AddressType.NHA_RIENG, name: "Nhà riêng" },
  { code: AddressType.CO_QUAN, name: "Cơ quan" },
];

export enum PickupType {
  PICK_UP = 1,
  DROP_OFF = 2,
}

export const PickupTypes = [
  { code: PickupType.PICK_UP, name: "Thu gom tận nơi" },
  { code: PickupType.DROP_OFF, name: "Gửi hàng tại bưu cục" },
];

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
  SenderFullname?: string; // tên người gửi *
  SenderTel?: string; // Số điện thoại người gửi * (maxlength: 50)
  SenderAddress?: string; // địa chỉ gửi *
  SenderWardId?: string; // mã phường người gửi *
  SenderProvinceId?: string; // mã tỉnh người gửi *
  SenderDistrictId?: string; // mã quận người gửi *

  ReceiverFullname?: string; // tên người nhận *
  ReceiverAddress?: string; // địa chỉ nhận *
  ReceiverTel?: string; // phone người nhận *
  ReceiverProvinceId?: string; // mã tỉnh người nhận *
  ReceiverDistrictId?: string; // mã quận người nhận *
  ReceiverWardId?: string; // mã phường người nhận *

  ReceiverAddressType: AddressType; // Kiểu địa chỉ người nhận: 1 Nhà riêng, 2: Cơ quan Nếu không có thông tin thì để null

  ServiceName: ServiceCode; //"BK"; // tên dịch vụ *

  OrderCode: string; // mã đơn hàng
  PackageContent: string; //"Món hàng A + Món hàng B"; // nội dung hàng

  WeightEvaluation?: number; // cân nặng *
  WidthEvaluation: number; // chiều rộng
  LengthEvaluation: number; // chiều dài
  HeightEvaluation: number; // chiều cao

  CodAmountEvaluation: number; // tiền thu hộ tạm tính

  IsPackageViewable?: boolean; // cho xem hàng

  PickupType?: PickupType; //1;

  OrderAmountEvaluation: number; // giá trị đơn hàng tạm tính

  IsReceiverPayFreight: boolean; // Cộng thêm cước vào tiền thu hộ
  CustomerNote: string; // yêu cầu khác
  UseBaoPhat: boolean;
  UseHoaDon: boolean;
};

export type ICreateDeliveryOrderResponse = {
  Id: string; //"96d25919-98cd-4662-82ce-2b7decf03901",
  ItemCode: string; //"EL491610889VN",
  CustomerId: string; //"bf15bb9c-51cb-48c9-86da-69df295ec33d",
  OrderCode: string; //"DH102",
  OrderStatus: string; //null,
  OrderStatusColor: string; //null,
  OrderStatusId: number; //20,
  OrderStatusName: string; //null,
  ShippingStatusId: number;
  PaymentStatusId: number;
  TotalFreightExcludeVat: number;
  TotalFreightIncludeVat: number;
  VatFreight: number;
  ShippingFreight: number;
  VasFreight: number;
  CodFreight: number;
  CodAmount: number;
  CodAmountEvaluation: number; //550805,
  SenderFullname: string;
  SenderFullAddress: string;
  SenderAddress: string;
  SenderTel: string;
  ReceiverFullname: string; //"Nguyễn Văn B";
  ReceiverFullAddress: string; //null;
  ReceiverAddress: string; //"123 Đoàn Văn Bơ ,Phường 15, Quận 4";
  ReceiverOldAddress: string; //null;
  ReceiverTel: string; //"0284088888";
  Weight: number; //: 0,
  WeightConvert: number; // 1000,
  Width: number; //0,
  Length: number; //0,
  Height: number; //0,
  ValueAddedServiceList: string; // "[{"IDDichVuCongThem":3,"CuocDVCT":15000.0},{"IDDichVuCongThem":1,"CuocDVCT":16500.0}]",
  AddedServiceList: string;
  Opt: string;
  AcceptancePoscode: string;
  AcceptanceName: string;
  DestinationPoscode: string;
  DestinationName: string;
  DeliveryID: number;
  ToPOSCode: string;
  CauseCode: string;
  DeliveryTimes: number;
  DeliveryNote: string;
  CauseName: string;
  InputTime: string;
  IsDeliverable: false;
  IsReturn: false;
  SolutionName: string;
  SolutionCode: string;
  DeliveryTime: string;
  BccpCreateTime: string;
  BccpLastUpdateTime: string;
  PaypostTracedate: string;
  PaypostTransferDate: string;
  PaypostStatus: number;
  CancelTime: string;
  CancelNotes: string;
  CancelStatus: string;
  CancelStatusDesc: string;
  SendingTime: string;
  CreateTime: string;
  DeliveryDateEvaluation: string;
  LastUpdateTime: string;
  CustomerCode: string;
  TotalFreightExcludeVatEvaluation: number;
  TotalFreightIncludeVatEvaluation: number;
  VatFreightEvaluation: number;
  ShippingFreightEvaluation: number;
  VasFreightEvaluation: number;
  CodFreightEvaluation: number;
  VendorId: string;
  SenderProvinceId: string;
  SenderProvince: string;
  ReceiverProvinceId: string;
  FuelFreight: string;
  RegionFreight: string;
  OrderAmount: number;
  OrderAmountEvaluation: number;
  PickupType: number;
  IsPackageViewable: boolean;
  PackageContent: string;
  ServiceName: string;
  ShipperTel: string;
  ServiceId: number;
  SenderDistrictId: string;
  ReceiverDistrictId: string;
  FuelFreightEvaluation: number;
  RegionFreightEvaluation: number;
  SenderWardId: string;
  ReceiverWardId: string;
  CustomerNote: string;
  MaChia: string;
  MaChiaBarCodeSrc: string;
  SoHieuBuuGuiBarCodeSrc: string;
  SoHieuBuuGuiQrCodeSrc: string;
  SoDienThoaiBuuCuc: string;
  WidthEvaluation: number;
  LengthEvaluation: number;
  HeightEvaluation: number;
  WeightEvaluation: number;
  OriginalCodAmountEvaluation: number;
  PickupTypeName: string;
  IsCancelable: boolean;
  OrderStatusCustomer: string;
  ReceiverProvince: string;
  IsReceiverPayFreight: boolean;
  IsWarningPhuongXa: boolean;
  IsWarningQuanHuyen: boolean;
  IsWarningTinhThanh: boolean;
  IsXuLySau: boolean;
  IsSuccess: boolean;
  Message: string;
  BatchCode: string;
  ReceiverInBlacklist: string;
  CodAmountNotForBatch: string;
  TrangThaiYeuCau: string;
  TenTrangThaiYeuCau: string;
  CoThongTinChuyenPhatDonHang: boolean;
  SenderAddressType: number;
  ReceiverAddressType: number;
  LstImage: string;
  TenNguonTaoDon: string;
  AdditionalDatas: string;
  AdditionalDatasObject: string;
  IsCreateDanhBaNguoiGui: boolean;
  IsCreateDanhBaNguoiNhan: boolean;
  SoLanIn: number;
  IsBatchOrder: boolean;
  IsCodAmountChung: boolean;
  IsUseSmartlockerSender: boolean;
  IsUseSmartlockerReceiver: boolean;
  ServiceNameCode: string;
  OrderStatusColorVersion2: string;
  OrderStatusBackgroundVersion2: string;
  IsShowWarning: boolean;
  HubOfSenderName: string;
  HubOfReceiverName: string;
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
      const data: ICreateDeliveryOrderResponse = get(res, "data");
      return data;
    });
  }

  static calculateAllShipFee(data: any): ICalculateAllShipFeeRespone {
    //https://donhang.vnpost.vn/api/api/TinhCuoc/TinhTatCaCuoc
    // console.log('vao vnpost')
    // console.log("data", data);
    const result: any = Axios.post(
      `${this.host}/TinhCuoc/TinhTatCaCuoc`,
      data,
      {
        headers: {
          "h-token": configs.vietnamPost.token,
        },
      }
    )
      .then((res) => get(res, "data"))
      .catch((error) => {
        console.log("=======================>error", error);
        throw error;
      });
    return result;
  }

  static cancelOrder(orderId: string) {
    // console.log("testcancelOrdercancelOrdercancelOrder");
    const result: any = Axios.post(
      `${this.host}/Order/CancelOrder?orderId=${orderId}`,
      {},
      {
        headers: {
          "h-token": configs.vietnamPost.token,
        },
      }
    ).then((res) => get(res, "data"));
    return result;
  }

  static getOrdersByItemCodes(itemCodes: string[]) {
    //https://donhang.vnpost.vn/api/api/TinhCuoc/TinhTatCaCuoc
    const result: any = Axios.post(
      `${this.host}/Order/GetListOrderByManagerWithCustomCode`,
      {
        PageSize: 1,
        ListItemCode: itemCodes,
      },
      {
        headers: {
          "h-token": configs.vietnamPost.token,
        },
      }
    ).then((res) => get(res, "data"));
    return result;
  }

  static getPostByAddress(
    provinceId: string,
    districtId: string,
    wardId: string
  ):IPostByAddress {
    //https://donhang.vnpost.vn/api/api/TinhCuoc/TinhTatCaCuoc
    const result: any = Axios.post(
      `${this.host}/BuuCuc/GetListBuuCucByXaHuyenTinh`,
      {
        MaTinhThanh: provinceId,
        MaQuanHuyen: districtId,
        MaPhuongXa: wardId,
      },
      {
        headers: {
          "h-token": configs.vietnamPost.token,
        },
      }
    ).then((res) => get(res, "data")[0]);
    return result;
  }
}

export type IPostByAddress = {
  MaBuuCuc: string;
  TenBuuCuc: string;
  SoDienThoai: string;
  DiaChi: string;
  TenDayDuKhongDau: string;
  MaTinhThanh: string;
  MaQuanHuyen: string;
  MaPhuongXa: string;
  DiaChiDayDu: string;
  Longitude: number;
  Latitude: number;
  POSTypeCode: number;
  StatusName: string;
  ThoiGianLamViec: string;
  NgayCapNhat: string;
  MaTrungTam: string;
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
