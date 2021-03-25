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


    let decode = await firebaseHelper.verifyIdToken(idToken);
    let phone = decode.phone_number;
    if (!phone) throw ErrorHelper.badToken();

    if (context.messengerSignPayload) {
      psid = context.messengerSignPayload.psid;
      pageId = context.messengerSignPayload.pageId;
    }

    let member = null;
    // kiem tra co pageid ko ?
    if (pageId) {
      member = await MemberModel.findOne({ fanpageId: pageId });
      if (!member) {
        throw Error("Fanpage này chưa được đăng ký.");
      }
      if (!member.activated) {
        throw Error("Fanpage này chưa được kích hoạt.");
      }
      if (!member.chatbotKey) {
        throw Error("Fanpage này chưa được đăng ký chatbot.");
      }
    }
    else {
      member = await MemberModel.findOne({ code: context.memberCode });
      if (!member) {
        throw Error("Cửa hàng này chưa được đăng ký.");
      }
      if (!member.activated) {
        throw Error("Cửa hàng này chưa được kích hoạt.");
      }
    }

    const getInfo = async (chatbotHelper: any, psid: string) => await chatbotHelper.getSubscriber(psid)
      .catch((err: any) => {
        return {
          name: "Khách vãng lai",
        } as SubscriberInfo;
      });


    phone = UtilsHelper.parsePhone(phone, "0");
    let customer = await CustomerModel.findOne({ uid: decode.uid });

    if (customer) {
      if (psid) {
        if (customer.pageAccounts.findIndex((a) => a.psid == psid) === -1) {
          customer.pageAccounts.push({
            memberId: member._id,
            pageId: member.fanpageId,
            psid,
          });
        }

        const chatbotHelper = new ChatBotHelper(member.chatbotKey);

        const subscriberInfo = await getInfo(chatbotHelper, psid);
        customer.name = subscriberInfo.name;
        customer.facebookName = subscriberInfo.name;
        customer.avatar = subscriberInfo.profilePic;
        customer.gender = subscriberInfo.gender;
      }
    }
    else {
      customer = new CustomerModel({
        code: await CustomerHelper.generateCode(), // Mã khách hàng
        name: "Khách vãng lai",
        uid: decode.uid,
        phone: phone,
        avatar: "https://i.imgur.com/NN9xQ5Q.png",
        pageAccounts: [{
          memberId: member._id,
          pageId: member.fanpageId,
        }],
      });
      if (psid) {
        const chatbotHelper = new ChatBotHelper(member.chatbotKey);
        const subscriberInfo = await getInfo(chatbotHelper, psid);
        customer.name = subscriberInfo.name;
        customer.facebookName = subscriberInfo.name;
        customer.avatar = subscriberInfo.profilePic;
        customer.gender = subscriberInfo.gender;
      }
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