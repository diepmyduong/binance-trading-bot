import crypto from "crypto";
import { Request, Response } from "express";
import moment from "moment-timezone";
import getPem from "rsa-pem-from-mod-exp";

import { ErrorHelper } from "../../base/error";
import { configs } from "../../configs";
import { onDelivering } from "../../events/onDelivering.event";
import { DeliveryLogModel } from "../../graphql/modules/deliveryLog/deliveryLog.model";
import { OrderModel, ShipMethod } from "../../graphql/modules/order/order.model";
import {
  VNPostOrderStatusDetailMap,
  VNPostOrderStatusMap,
} from "../../helpers/vietnamPost/vietnamPostDeliveryStatus";
import { Logger } from "../../loaders/logger";

const publicKeyPem = getPem(configs.vietnamPost.publicKey, "AQAB");
export default [
  {
    method: "post",
    path: "/api/shippingTracking/vnpost",
    midd: [],
    action: action,
  },
  {
    method: "post",
    path: "/api/delivery/webhook",
    midd: [],
    action: action,
  },
];
async function action(req: Request, res: Response) {
  verifyWebhookData(req.body);
  res.sendStatus(200);
  try {
    const data = JSON.parse(req.body.Data);
    const order = await OrderModel.findOne({ code: data.OrderCode });
    if (!order || order.deliveryInfo.itemCode != data.ItemCode) {
      throw Error("Đơn hàng không hợp lệ");
    }
    // if (order.deliveryInfo.status == data.OrderStatusId.toString()) {
    //   console.log("Trạng thái bị trùng");
    //   return res.sendStatus(200);
    // }
    const deliveryLog = await DeliveryLogModel.create({
      orderId: order._id,
      memberId: order.sellerId,
      customerId: order.buyerId,
      orderNumber: data.ItemCode,
      deliveryCode: data.ItemCode,
      deliveryId: data.Id,
      shipMethod: ShipMethod.VNPOST,
      status: data.OrderStatusId.toString(),
      statusName: VNPostOrderStatusMap.get(data.OrderStatusId),
      statusDetail: VNPostOrderStatusDetailMap.get(data.OrderStatusId),
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
    onDelivering.next(order);
  } catch (err) {
    Logger.error(`[WEBHOOK VNPOST]: ${err.message}`);
  }
}
function verifyWebhookData(body: any) {
  const stringToSign = body.Data + body.SendDate;
  const verified = crypto.verify(
    "sha256",
    Buffer.from(stringToSign, "utf-8"),
    {
      key: publicKeyPem,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    } as any,
    Buffer.from(body.SignData, "base64")
  );
  if (!verified) {
    throw ErrorHelper.permissionDeny();
  }
}
