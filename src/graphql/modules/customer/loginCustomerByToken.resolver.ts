import { ErrorHelper } from "../../../base/error";
import { firebaseHelper, UtilsHelper } from "../../../helpers";
import { ChatBotHelper } from "../../../helpers/chatbot.helper";
import { Context } from "../../context";
import { MemberModel } from "../member/member.model";
import { SubscriberInfo } from "../member/types/subscriberInfo.type";
import { CustomerHelper } from "./customer.helper";
import { CustomerModel } from "./customer.model";

const Mutation = {
  loginCustomerByToken: async (root: any, args: any, context: Context) => {
    let { idToken, psid, pageId } = args;
    // console.log('idToken', idToken);
    // console.log('psid', psid);
    // console.log("pageId", pageId);
    const tokenValid = !context.messengerSignPayload;
    // console.log('context.messengerSignPayload', context.messengerSignPayload);
    // console.log('!psid || !pageId', !psid || !pageId);
    // console.log("tokenValid", tokenValid);

    // console.log('psid', psid);
    // console.log('pageId', pageId);
    if (tokenValid) {
      throw ErrorHelper.permissionDeny();
    } else {
      if (context.messengerSignPayload) {
        //vuong fix - set psid pageId alwaits null
        psid = context.messengerSignPayload.psid;
        pageId = context.messengerSignPayload.pageId;
      }
    }

    let decode = await firebaseHelper.verifyIdToken(idToken);
    let phone = decode.phone_number;
    if (!phone) throw ErrorHelper.badToken();
    // console.log('psid', psid);
    // console.log('pageId', pageId);
    const member = await MemberModel.findOne({ fanpageId: pageId });
    // console.log('member', member);
    if (!member || !member.chatbotKey) throw Error("Fanpage này chưa được đăng ký.");

    phone = UtilsHelper.parsePhone(phone, "0");
    let customer = await CustomerModel.findOne({ uid: decode.uid });
    // Tạo mới tài khoản khách hàng nếu chưa có
    if (!customer) {
      const chatbotHelper = new ChatBotHelper(member.chatbotKey);
      const subscriberInfo = await chatbotHelper.getSubscriber(psid).catch((err) => {
        return {
          name: "Khách Vãng lai",
        } as SubscriberInfo;
      });
      customer = new CustomerModel({
        code: await CustomerHelper.generateCode(), // Mã khách hàng
        name: subscriberInfo.name,
        facebookName: subscriberInfo.name,
        uid: decode.uid,
        phone: phone,
        avatar: subscriberInfo.profilePic,
        gender: subscriberInfo.gender,
        pageAccounts: [],
      });
    }
    // Nếu tài khoản chưa từng đăng nhập bằng psid mới thì thêm vào danh sách tài khoản của page
    if (!customer.pageAccounts.find((a) => a.psid == psid)) {
      customer.pageAccounts.push({
        memberId: member._id,
        pageId: member.fanpageId,
        psid: psid,
      });
    }
    return {
      customer: await customer.save(),
      token: new CustomerHelper(customer).getToken({
        pageId,
        psid,
        sellerId: member._id,
      }),
    };
  },
};

export default { Mutation };

// (async () => {
//   const root: any = null;
//   const args: any = {

//   }

//   const context: any = null;

//   const result = await Mutation.loginCustomerByToken(root, args, context);

//   console.log('result', result);

// })();
