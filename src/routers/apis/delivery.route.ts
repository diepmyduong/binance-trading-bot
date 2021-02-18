import { type } from "os";
import { DeliveryLogModel } from "../../graphql/modules/deliveryLog/deliveryLog.model";
import { ShipMethod } from "../../graphql/modules/order/order.model";
import { OrderModel } from "../../graphql/modules/order/order.model";
import { WebhookLogModel } from "../../graphql/modules/webhookLog/webhookLog.model";
import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";
import { auth } from "../../middleware/auth";
import { GetVietnamPostDeliveryStatusText } from "../../helpers/vietnamPost/vietnamPostDeliveryStatus";
import moment from 'moment';

class DeliveryRoute extends BaseRoute {
  constructor() {
    super();
  }
  customRouting() {
    this.router.post("/webhook", this.route(this.webHook));
  }

  async webHook(req: Request, res: Response) {
    WebhookLogModel.create({
      name: "delivery",
      body: req.body,
      headers: req.headers,
      query: req.query,
    }).catch((err: any) => {});

    const { Data, SendDate, SignData } = req.body;

    // if (!req.body.SignData || req.body.SignData != configs.viettelPost.secret)
    //         throw ErrorHelper.badToken();

    const data: webhookResponseData = JSON.parse(Data);
    const order = await OrderModel.findById(data.OrderCode);
    if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");
    const deliveryLog = await DeliveryLogModel.create({
      orderId: order._id,
      // customerId: order.customerId,
      orderNumber: data.ItemCode,
      shipMethod: ShipMethod.VNPOST,
      status: data.OrderStatusId.toString(),
      statusName: GetVietnamPostDeliveryStatusText(data.OrderStatusId.toString()),
      statusDetail: GetVietnamPostDeliveryStatusText(data.OrderStatusId.toString()),
      statusDate: moment(data.LastUpdateTime, "DD/MM/YYYY HH:mm:ss"),
      note: data.DeliveryNote,
      moneyCollection: parseFloat(data.CodAmountEvaluation),
      moneyFeeCOD: data.CodFreight,
      moneyTotal: data.TotalFreightIncludeVat,
      // expectedDelivery: data["EXPECTED_DELIVERY"],
      productWeight: data.WeightConvert,
      orderService: data.ServiceDisplayName,
      // locationCurrently: data["LOCALION_CURRENTLY"],
      // detail: data["DETAIL"],
    });
    order.deliveryInfo.status = deliveryLog.status;
    order.deliveryInfo.statusName = deliveryLog.statusName;
    await order.save();
    res.sendStatus(200);
  }
}

export default new DeliveryRoute().router;

type webhookResponseData = {
  Id: string;
  ItemCode: string;
  CustomerId: string;
  CustomerCode: string;
  OrderCode: string;
  OrderStatusId: number;
  ShippingStatusId: number;
  PaymentStatusId: number;
  ServiceId: string;
  ServiceName: string;
  SenderFullname: string;
  SenderAddress: string;
  SenderTel: string;
  ReceiverFullname: string;
  ReceiverAddress: string;
  ReceiverTel: string;
  SenderProvinceId: string;
  SenderDistrictId: string;
  ReceiverProvinceId: string;
  ReceiverDistrictId: string;
  ShipperTel: string;
  OrderAmount: string;
  CodAmount: number;
  TotalFreightExcludeVat: number;
  TotalFreightIncludeVat: number;
  VatFreight: number;
  ShippingFreight: number;
  VasFreight: number;
  CodFreight: number;
  FuelFreight: string;
  RegionFreight: string;
  TotalFreightExcludeVatEvaluation: number;
  TotalFreightIncludeVatEvaluation: number;
  VatFreightEvaluation: number;
  ShippingFreightEvaluation: number;
  VasFreightEvaluation: number;
  CodFreightEvaluation: number;
  FuelFreightEvaluation: string;
  RegionFreightEvaluation: string;
  PackageContent: string;
  PickupType: string;
  IsPackageViewable: string;
  Weight: number;
  WeightConvert: number;
  Width: number;
  Length: number;
  Height: number;
  ValueAddedServiceList: string;
  Opt: string;
  AcceptancePoscode: string;
  DestinationPoscode: string;
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
  VendorId: number;
  CreateTime: string;
  LastUpdateTime: string;
  SenderWardId: string;
  ReceiverWardId: string;
  IsReceiverPayFreight: string;
  DeliveryDateEvaluation: string;
  WidthEvaluation: string;
  LengthEvaluation: string;
  HeightEvaluation: string;
  WeightEvaluation: string;
  ServiceDisplayName: string;
  CustomerNote: string;
  CodAmountEvaluation: string;
  OrderAmountEvaluation: string;
  OriginalCodAmountEvaluation: string;
  OldCustomerCode: string;
  OldAcceptancePoscode: string;
  OldToPOSCode: string;
  OldReceiverTel: string;
  BatchCode: string;
  CodAmountNotForBatch: string;
  SenderAddressType: string;
  ReceiverAddressType: string;
  AdditionalDatas: string;
  SoLanIn: string;
};
