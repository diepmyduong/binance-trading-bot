import Axios from "axios";
import { get } from "lodash";
import moment from "moment";
import { configs } from "../../configs";
import { ShipServicePricing } from "../../graphql/modules/order/types/shipServicePricing.type";
import { ErrorHelper } from "../error.helper";

export type IWardType = {
  MaPhuongXa: string;
  TenPhuongXa: string;
  MaQuanHuyen: string;
  TenQuanHuyen: string;
  MaTinhThanh: string;
  TenTinhThanh: string;
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
  static getWards() {
    return Axios.get(`${this.host}/PhuongXa/GetAll`).then((res) =>
      get(res, "data")
    );
  }
  static getPriceAll({
    senderProvince,
    senderDistrict,
    receiverProvince,
    receiverDistrict,
    producType = "HH",
    productWeight = 300,
    productPrice,
    moneyCollection,
    type = 1,
  }: GetAllPriceProps) {
    return Axios.post(`${this.host}/order/getPriceAll`, {
      SENDER_PROVINCE: parseInt(senderProvince.toString()),
      SENDER_DISTRICT: parseInt(senderDistrict.toString()),
      RECEIVER_PROVINCE: parseInt(receiverProvince.toString()),
      RECEIVER_DISTRICT: parseInt(receiverDistrict.toString()),
      PRODUCT_TYPE: producType,
      PRODUCT_WEIGHT: productWeight,
      PRODUCT_PRICE: productPrice,
      MONEY_COLLECTION: moneyCollection.toString(),
      TYPE: type,
    }).then(
      (res) =>
        get(res, "data", []).map(
          (r: any) =>
            ({
              code: r["MA_DV_CHINH"],
              name: r["TEN_DICHVU"],
              price: r["GIA_CUOC"],
              time: r["THOI_GIAN"],
              exchangeWeight: r["EXCHANGE_WEIGHT"],
            } as ShipServicePricing)
        ) as ShipServicePricing[]
    );
  }
  static getListService() {
    return Axios.post(`${this.host}/categories/listService`, {
      TYPE: 2,
    }).then((res) => get(res, "data.data"));
  }
  static getPricing({
    productWeight = 300,
    productPrice,
    moneyCollection,
    orderServiceAdd = "",
    orderService = "VCN",
    senderProvince,
    senderDistrict,
    receiverProvince,
    receiverDistrict,
    productType = "HH",
    nationalType = 1,
  }: GetPricingProps) {
    return Axios.post(`${this.host}/order/getPriceAll`, {
      PRODUCT_WEIGHT: productWeight,
      PRODUCT_PRICE: productPrice,
      MONEY_COLLECTION: moneyCollection,
      ORDER_SERVICE_ADD: orderServiceAdd,
      ORDER_SERVICE: orderService,
      SENDER_PROVINCE: parseInt(senderProvince.toString()),
      SENDER_DISTRICT: parseInt(senderDistrict.toString()),
      RECEIVER_PROVINCE: parseInt(receiverProvince.toString()),
      RECEIVER_DISTRICT: parseInt(receiverDistrict.toString()),
      PRODUCT_TYPE: productType,
      NATIONAL_TYPE: nationalType,
    }).then((res) => get(res, "data"));
  }
  static createOrder(data: CreateBillProps) {
    return Axios.post(
      `${this.host}/order/createOrder`,
      {
        ORDER_NUMBER: data.orderNumber,
        GROUPADDRESS_ID: data.groupAddress,
        CUS_ID: data.customerId,
        DELIVERY_DATE: moment(data.deliveryDate).format("DD/MM/YYYY HH:mm:ss"),
        SENDER_FULLNAME: data.senderName,
        SENDER_ADDRESS: data.senderAddress,
        SENDER_PHONE: data.senderPhone,
        SENDER_EMAIL: data.senderEmail,
        SENDER_WARD: data.senderWard,
        SENDER_DISTRICT: data.senderDistrict,
        SENDER_PROVINCE: data.senderProvince,
        SENDER_LATITUDE: data.senderLat,
        SENDER_LONGITUDE: data.senderLng,
        RECEIVER_FULLNAME: data.receiverName,
        RECEIVER_ADDRESS: data.receiverAddress,
        RECEIVER_PHONE: data.receiverPhone,
        RECEIVER_EMAIL: data.receiverEmail,
        RECEIVER_WARD: data.receiverWard,
        RECEIVER_DISTRICT: data.receiverDistrict,
        RECEIVER_PROVINCE: data.receiverProvince,
        RECEIVER_LATITUDE: data.receiverLat,
        RECEIVER_LONGITUDE: data.receiverLng,
        PRODUCT_NAME: data.productName,
        PRODUCT_DESCRIPTION: data.productDesc,
        PRODUCT_QUANTITY: data.productQty,
        PRODUCT_PRICE: data.productPrice,
        PRODUCT_WEIGHT: data.productWeight,
        PRODUCT_LENGTH: data.productLength,
        PRODUCT_WIDTH: data.productWidth,
        PRODUCT_HEIGHT: data.productHeight,
        PRODUCT_TYPE: data.productType,
        ORDER_PAYMENT: data.orderPayment,
        ORDER_SERVICE: data.orderService,
        ORDER_SERVICE_ADD: data.orderServiceAdd,
        ORDER_VOUCHER: data.orderVoucher,
        ORDER_NOTE: data.orderNote,
        MONEY_COLLECTION: data.moneyCollection,
        MONEY_TOTALFEE: data.moneyTotalFee,
        MONEY_FEECOD: data.moneyFeeCOD,
        MONEY_FEEVAS: data.moneyFeeVAS,
        MONEY_FEEINSURRANCE: data.moneyFeeInsurance,
        MONEY_FEE: data.moneyFee,
        MONEY_FEEOTHER: data.moneyFeeOther,
        MONEY_TOTALVAT: data.moneyTotalVAT,
        MONEY_TOTAL: data.moneyTotal,
        LIST_ITEM: data.listItems.map((i) => ({
          PRODUCT_NAME: i.productName,
          PRODUCT_PRICE: i.productPrice,
          PRODUCT_WEIGHT: i.productWeight,
          PRODUCT_QUANTITY: i.productQty,
        })),
      },
      {
        headers: {
          token: configs.viettelPost.token,
        },
      }
    ).then((res) => {
      const bill = get(res, "data.data");
      return {
        orderNumber: bill["ORDER_NUMBER"],
        moneyCollection: bill["MONEY_COLLECTION"],
        exchangeWeight: bill["EXCHANGE_WEIGHT"],
        moneyTotal: bill["MONEY_TOTAL"],
        moneyTotalFee: bill["MONEY_TOTAL_FEE"],
        moneyFee: bill["MONEY_FEE"],
        moneyCollectionFee: bill["MONEY_COLLECTION_FEE"],
        moneyOtherFee: bill["MONEY_OTHER_FEE"],
        moneyVAS: bill["MONEY_VAS"],
        moneyVAT: bill["MONEY_VAT"],
        KPI_HT: bill["KPI_HT"],
        receiverProvince: bill["RECEIVER_PROVINCE"].toString(),
        receiverDistrict: bill["RECEIVER_DISTRICT"].toString(),
        receiverWard: bill["RECEIVER_WARDS"].toString(),
      } as Bill;
    });
  }

  static getListInventory() {
    return Axios.get(`${this.host}/user/listInventory`, {
      headers: { token: configs.viettelPost.token },
    }).then((res) => {
      return get(res, "data.data", []).map((r: any) => {
        return {
          groupaddressId: r["groupaddressId"].toString(),
          cusId: r["cusId"].toString(),
          name: r["name"],
          phone: r["phone"],
          address: r["address"],
          provinceId: r["provinceId"].toString(),
          districtId: r["districtId"].toString(),
          wardsId: r["wardsId"].toString(),
        };
      }) as Inventory[];
    });
  }
  static registerInventory({ name, phone, address, wardId }: any) {
    return Axios.post(
      `${this.host}/user/registerInventory`,
      {
        PHONE: phone,
        NAME: name,
        ADDRESS: address,
        WARDS_ID: parseInt(wardId),
      },
      {
        headers: { token: configs.viettelPost.token },
      }
    ).then((res) => {
      return get(res, "data.data", [])
        .map((r: any) => {
          return {
            groupaddressId: r["groupaddressId"].toString(),
            cusId: r["cusId"].toString(),
            name: r["name"],
            phone: r["phone"],
            address: r["address"],
            provinceId: r["provinceId"].toString(),
            districtId: r["districtId"].toString(),
            wardsId: r["wardsId"].toString(),
          };
        })
        .find((r: any) => r.wardsId == parseInt(wardId)) as Inventory;
    });
  }
  static updateOrder({ orderNumber, type, note, date }: UpdateOrderProps) {
    return Axios.post(
      `${this.host}/order/UpdateOrder`,
      {
        TYPE: type,
        ORDER_NUMBER: orderNumber,
        NOTE: note,
        DATE:
          type == UpdateOrderType.reorder
            ? moment(date).format("DD/MM/YYYY HH:mm:ss")
            : undefined,
      },
      {
        headers: { token: configs.viettelPost.token },
      }
    ).then((res) => {
      if (get(res, "data.status") == 200) return get(res, "data.message");
      else throw ErrorHelper.externalRequestFailed(get(res, "data.message"));
    });
  }
  static trackingOrderStatus(orderNumber: string) {
    return Axios.get(
      `https://api.viettelpost.vn/api/setting/listOrderTrackingVTP`,
      {
        headers: { token: configs.viettelPost.token },
        params: { OrderNumber: orderNumber },
      }
    ).then((res) => {
      return get(res, "data.0");
    });
  }
  static getLinkPrint(orderNumbers: string[]) {
    if (!configs.viettelPost.printToken)
      throw ErrorHelper.somethingWentWrong(
        "Chưa cấu hình khoá in vận đơn từ Viettel Post."
      );
    return Axios.post(
      `${this.host}/order/encryptLinkPrint`,
      {
        TYPE: 1,
        ORDER_ARRAY: orderNumbers,
        EXPIRY_TIME: moment().add(5, "minutes").toDate().getTime(),
        PRINT_TOKEN: configs.viettelPost.printToken,
      },
      {
        headers: { token: configs.viettelPost.token },
      }
    ).then((res) => {
      if (get(res, "data.status") == 200)
        return get(res, "data.message") as string;
      else throw ErrorHelper.externalRequestFailed(get(res, "data.message"));
    });
  }
}
type UpdateOrderProps = {
  orderNumber: string;
  type: UpdateOrderType;
  note: string;
  date: Date;
};
enum UpdateOrderType {
  confirm = 1,
  returnShipping = 2,
  deliveryAgain = 3,
  cancel = 4,
  reorder = 5,
  deleteCancel = 11,
}
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

type CreateBillProps = {
  orderNumber?: string;
  groupAddress?: string;
  customerId?: string;
  deliveryDate?: Date;
  senderName?: string;
  senderAddress?: string;
  senderPhone?: string;
  senderEmail?: string;
  senderWard?: string;
  senderDistrict?: string;
  senderProvince?: string;
  senderLat?: number;
  senderLng?: number;
  receiverName?: string;
  receiverAddress?: string;
  receiverPhone?: string;
  receiverEmail?: string;
  receiverWard?: string;
  receiverDistrict?: string;
  receiverProvince?: string;
  receiverLat?: number;
  receiverLng?: number;
  productName?: string;
  productDesc?: string;
  productQty?: number;
  productPrice?: number;
  productWeight?: number;
  productLength?: number;
  productWidth?: number;
  productHeight?: number;
  productType?: "TH" | "HH";
  orderPayment?: 1 | 2 | 3 | 4;
  orderService?: string;
  orderServiceAdd?: string;
  orderVoucher?: string;
  orderNote?: string;
  moneyCollection?: number;
  moneyTotalFee?: number;
  moneyFeeCOD?: number;
  moneyFeeVAS?: number;
  moneyFeeInsurance?: number;
  moneyFee?: number;
  moneyFeeOther?: number;
  moneyTotalVAT?: number;
  moneyTotal?: number;
  listItems?: BillItem[];
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
