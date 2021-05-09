import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { TokenHelper } from "../../../helpers/token.helper";
import { Context } from "../../context";
import { counterService } from "../counter/counter.service";
import { CustomerModel, ICustomer } from "./customer.model";
import { SubscriberInfo } from "../member/types/subscriberInfo.type";

export class CustomerHelper {
  constructor(public customer: ICustomer) {}

  static async fromContext(context: Context) {
    if (![ROLES.CUSTOMER].includes(context.tokenData.role)) return null;
    const member = await CustomerModel.findById(context.tokenData._id);
    if (!member) throw ErrorHelper.permissionDeny();
    return new CustomerHelper(member);
  }
  static async generateCode() {
    return counterService.trigger("customer").then((c) => c.toString());
  }
  getToken({ pageId, psid, sellerId }: any) {
    return TokenHelper.generateToken({
      role: ROLES.CUSTOMER,
      _id: this.customer._id,
      pageId,
      psid,
      sellerId,
      username:
        this.customer.name || this.customer.facebookName || this.customer.phone,
    });
  }

  static getInfo = async (chatbotHelper: any, psid: string) =>
    await chatbotHelper.getSubscriber(psid).catch((err: any) => {
      return {
        name: "Khách vãng lai",
      } as SubscriberInfo;
    });
}
