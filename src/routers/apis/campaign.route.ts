import { BaseRoute, Request, Response, NextFunction } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";
import { CampaignModel } from "../../graphql/modules/campaign/campaign.model";
import { ProductModel, ProductType } from "../../graphql/modules/product/product.model";
import { UtilsHelper } from "../../helpers";
import { auth } from "../../middleware/auth";
import Excel from "exceljs";
import { ObjectId } from "mongodb";
import { CampaignSocialResultModel, ICampaignSocialResult } from "../../graphql/modules/campaignSocialResult/campaignSocialResult.model";
import { IOrderItem } from "../../graphql/modules/orderItem/orderItem.model";
import { OrderStatus } from "../../graphql/modules/order/order.model";
import { IRegisSMS, RegisSMSStatus } from "../../graphql/modules/regisSMS/regisSMS.model";
import { IRegisService, RegisServiceStatus } from "../../graphql/modules/regisService/regisService.model";
class CampaignRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/export", [auth], this.route(this.exportToExcel));
  }

  async exportToExcel(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR);

    const campaignId = req.query.campaignId;

    // console.log('campaignId', campaignId);
    const campaign = await CampaignModel.findById(campaignId);

    if (!campaign)
      throw ErrorHelper.mgQueryFailed("Chiến dịch");

    const product = await ProductModel.findById(campaign.productId);

    // console.log('product', product);

    let data: any[] = [];

    // do {
    //   resultCount = await LuckyWheelResultModel.count({ luckyWheelId });

    //   console.log("fetch from ", campaign, resultCount);


    //   console.log("stop do");
    // } while (resultCount > 0);

    const results = await CampaignSocialResultModel.aggregate([
      {
        $match: {
          //campaignId: ObjectId('60002197df6e7774fda235df')
          campaignId: new ObjectId(campaign.id)
        }
      },
      {
        $lookup: {
          from: "campaigns",
          localField: "campaignId",
          foreignField: "_id",
          as: "campaign"
        },
      },
      {
        $unwind: "$campaign",
      },
      {
        $lookup: {
          from: "members",
          localField: "memberId",
          foreignField: "_id",
          as: "member"
        },
      },
      {
        $unwind: "$member",
      },
      {
        $lookup: {
          from: "regissms",
          localField: "campaignId",
          foreignField: "campaignId",
          as: "regissms"
        },
      },
      {
        $lookup: {
          from: "regisservices",
          localField: "campaignId",
          foreignField: "campaignId",
          as: "regisservices"
        },
      },
      {
        $lookup: {
          from: "orderitems",
          localField: "campaignId",
          foreignField: "campaignId",
          as: "orderitems"
        },
      },
      {
        $project: {
          _id: 1,
          campaign: 1,
          likeCount: 1,
          shareCount: 1,
          commentCount: 1,
          campaignId: 1,
          affiliateLink: 1,
          memberId: 1,
          productId: 1,
          createdAt: 1,
          updatedAt: 1,
          member: 1,
          memberName: "$member.name",
          memberShopName: "$member.shopName",
          regissms: 1,
          regisservices: 1,
          orderitems: 1
        },
      },
      {
        $sort: { memberName: -1 }
      },
    ]);

    // console.log('test', results);


    const newResults = [];

    const filterOrderItemsByMemberId = (item: IOrderItem, result: ICampaignSocialResult) => item.sellerId.toString() === result.memberId.toString();

    const filterCompletedOrderItems = (item: IOrderItem, result: ICampaignSocialResult) => {
      if (item.sellerId.toString() !== result.memberId.toString()) return false;
      return item.status === OrderStatus.COMPLETED;
    }

    const filterCanceledOrderItems = (item: IOrderItem, result: ICampaignSocialResult) => {
      if (item.sellerId.toString() !== result.memberId.toString()) return false;
      return item.status === OrderStatus.CANCELED;
    }

    const filterPendingOrderItems = (item: IOrderItem, result: ICampaignSocialResult) => {
      if (item.sellerId.toString() !== result.memberId.toString()) return false;
      return item.status === OrderStatus.PENDING;
    }

    const filterSMSByMemberId = (sms: IRegisSMS, result: ICampaignSocialResult) => sms.sellerId === result.memberId.toString();
    const filterCompletedSMS = (sms: IRegisSMS, result: ICampaignSocialResult) => {
      if (sms.sellerId !== result.memberId.toString()) return false;
      return sms.status === RegisSMSStatus.COMPLETED
    }
    const filterCanceledSMS = (sms: IRegisSMS, result: ICampaignSocialResult) => {
      if (sms.sellerId !== result.memberId.toString()) return false;
      return sms.status === RegisSMSStatus.CANCELED;
    }

    const filterPendingSMS = (sms: IRegisSMS, result: any) => {
      if (sms.sellerId !== result.memberId.toString()) return false;
      return sms.status === RegisSMSStatus.PENDING;
    }

    const filterServiceByMember = (service: IRegisService, result: ICampaignSocialResult) => service.sellerId === result.memberId.toString();
    const filterCompletedService = (service: IRegisService, result: ICampaignSocialResult) => {
      if (service.sellerId !== result.memberId.toString()) return false;
      return service.status === RegisServiceStatus.COMPLETED;
    }
    const filterPendingService = (service: IRegisService, result: ICampaignSocialResult) => {
      if (service.sellerId !== result.memberId.toString()) return false;
      return service.status === RegisServiceStatus.PENDING;
    }
    const filterCanceledService = (service: IRegisService, result: any) => {
      if (service.sellerId !== result.memberId.toString()) return false;
      return service.status === RegisServiceStatus.CANCELED;
    }

    for (const result of results) {
      if (product.type === ProductType.RETAIL) {
        result.orderTotal = Object.keys(result.orderitems.filter((item: IOrderItem) => filterOrderItemsByMemberId(item, result))).length;
        result.completedOrderTotal = Object.keys(result.orderitems.filter((item: IOrderItem) => filterCompletedOrderItems(item, result))).length;
        result.canceledOrderTotal = Object.keys(result.orderitems.filter((item: IOrderItem) => filterCanceledOrderItems(item, result))).length;
        result.pendingOrderItems = Object.keys(result.orderitems.filter((item: IOrderItem) => filterPendingOrderItems(item, result))).length;
      }

      if (product.type === ProductType.SERVICE) {
        result.smsTotal = Object.keys(result.regissms.filter((sms: IRegisSMS) => filterSMSByMemberId(sms, result))).length;
        result.completedSMSTotal = Object.keys(result.regissms.filter((sms: IRegisSMS) => filterCompletedSMS(sms, result))).length;
        result.canceledSMSTotal = Object.keys(result.regissms.filter((sms: IRegisSMS) => filterCanceledSMS(sms, result))).length;
        result.pendingSMSTotal = Object.keys(result.regissms.filter((sms: IRegisSMS) => filterPendingSMS(sms, result))).length;
      }

      if (product.type === ProductType.SMS) {
        result.serviceTotal = Object.keys(result.regisservices.filter((service: IRegisService) => filterServiceByMember(service, result))).length;
        result.completedServiceTotal = Object.keys(result.regisservices.filter((service: IRegisService) => filterCompletedService(service, result))).length;
        result.canceledServiceTotal = Object.keys(result.regisservices.filter((service: IRegisService) => filterPendingService(service, result))).length;
        result.pendingServiceTotal = Object.keys(result.regisservices.filter((service: IRegisService) => filterCanceledService(service, result))).length;
      }
      newResults.push(result);
    }
    // console.log('newResults', newResults);

    // resultCount = res.length;
    data = [...data, ...newResults];


    // console.log('data', data);

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Danh sách chiến dịch");
    const excelHeaders = [
      "Mã số",
      "Cửa hàng",
      "Chủ cửa hàng",
      "SĐT",
      "Chiến dịch",
      "Mã chiến dịch",
      "Link affiliateLink",
      "Lượt thích",
      "Lượt chia sẻ",
      "Lượt bình luận",
      "Lần cập nhật cuối cùng",
    ]

    if (product.type === ProductType.RETAIL)
      excelHeaders.push(
        "Số đơn hàng",
        "Số đơn hàng chờ duyệt",
        "Số đơn hàng đã duyệt",
        "Số đơn hàng đã hủy",
      );

    if (product.type === ProductType.SMS)
      excelHeaders.push(
        "Số SMS",
        "Số SMS chờ duyệt",
        "Số SMS đã duyệt",
        "Số SMS đã hủy",
      );

    if (product.type === ProductType.SERVICE)
      excelHeaders.push(
        "Số Dịch vụ",
        "Số Dịch vụ chờ duyệt",
        "Số Dịch vụ đã duyệt",
        "Số Dịch vụ đã hủy",
      );

    sheet.addRow(excelHeaders);

    data.forEach((d: any, i) => {
      const dataRow = [
        i + 1,
        d.memberShopName,
        d.memberName,
        d.member.phone,
        d.campaign.name,
        d.campaign.code,
        d.affiliateLink,
        d.likeCount,
        d.shareCount,
        d.commentCount,
        d.updatedAt
      ];

      if (product.type === ProductType.RETAIL)
        dataRow.push(
          // "Số đơn hàng",
          // "Số đơn hàng chờ duyệt",
          // "Số đơn hàng đã duyệt",
          // "Số đơn hàng đã hủy",
          d.orderTotal,
          d.pendingOrderItems,
          d.completedOrderTotal,
          d.canceledOrderTotal,
        );

      if (product.type === ProductType.SMS)
        dataRow.push(
          // "Số SMS",
          // "Số SMS chờ duyệt",
          // "Số SMS đã duyệt",
          // "Số SMS đã hủy",
          d.smsTotal,
          d.pendingSMSTotal,
          d.completedSMSTotal,
          d.canceledSMSTotal,

        );

      if (product.type === ProductType.SERVICE)
        dataRow.push(
          // "Số Dịch vụ",
          // "Số Dịch vụ chờ duyệt",
          // "Số Dịch vụ đã duyệt",
          // "Số Dịch vụ đã hủy",
          d.serviceTotal,
          d.pendingServiceTotal,
          d.completedServiceTotal,
          d.canceledServiceTotal,
        );

      sheet.addRow(dataRow);
    });
    
    UtilsHelper.setThemeExcelWorkBook(sheet);

    return UtilsHelper.responseExcel(res, workbook, `danh_sach_chien_dich_${campaign.code}`);
  }
}


export default new CampaignRoute().router;
