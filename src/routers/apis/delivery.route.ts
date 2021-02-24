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

const DEFAULT_WEBHOOK_ORDER_ID = "00000000-0000-0000-0000-000000000000"
class DeliveryRoute extends BaseRoute {
  constructor() {
    super();
  }
  customRouting() {
    this.router.post("/webhook", this.route(this.webHook));
  }

  async webHook(req: Request, res: Response) {
    // console.log('test hook');
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

    if(data.Id === DEFAULT_WEBHOOK_ORDER_ID){
      return res.sendStatus(200);
    }

    const order = await OrderModel.findOne({code:data.OrderCode});
    if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");

    // console.log('data',data);
    // console.log('order',order);
    const deliveryLog = await DeliveryLogModel.create({
      orderId: order._id,
      memberId: order.sellerId,
      customerId: order.buyerId,
      deliveryCode : data.ItemCode, 
      deliveryId: data.Id,
      shipMethod: ShipMethod.VNPOST,
      status: data.OrderStatusId.toString(),
      statusName: GetVietnamPostDeliveryStatusText(data.OrderStatusId.toString()),
      statusDetail: GetVietnamPostDeliveryStatusText(data.OrderStatusId.toString()),
      statusDate: moment(data.LastUpdateTime),
      note: data.DeliveryNote,
      moneyCollection: parseFloat(data.CodAmountEvaluation),
      moneyFeeCOD: data.CodFreight,
      moneyTotal: data.TotalFreightIncludeVat,
      expectedDelivery: data.DeliveryDateEvaluation,
      productWeight: data.WeightConvert,
      orderService: data.ServiceDisplayName,
      detail: data.PackageContent,
    });

    order.deliveryInfo.status = deliveryLog.status;
    order.deliveryInfo.statusText = deliveryLog.statusName;

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
