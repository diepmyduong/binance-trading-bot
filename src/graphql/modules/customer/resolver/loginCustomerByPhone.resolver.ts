import { ErrorHelper } from "../../../../base/error";
import { firebaseHelper, UtilsHelper } from "../../../../helpers";
import { ChatBotHelper } from "../../../../helpers/chatbot.helper";
import { Context } from "../../../context";
import { MemberModel } from "../../member/member.model";
import { CustomerHelper } from "../customer.helper";
import { CustomerModel } from "../customer.model";

const Mutation = {
  loginCustomerByPhone: async (root: any, args: any, context: Context) => {
    let { phone, psid, pageId } = args;

    if (!phone) throw ErrorHelper.error("Chưa nhập số điện thoại");

    if (context.messengerSignPayload) {
      psid = context.messengerSignPayload.psid;
      pageId = context.messengerSignPayload.pageId;
    }
    let member: any = null;
    if (context.memberCode) {
      member = await MemberModel.findOne({ code: context.memberCode });
    }
    if (!member && context.xPageId) {
      member = await MemberModel.findOne({ fanpageId: context.xPageId });
    }
    if (!member) {
      throw Error("Cửa hàng này chưa được đăng ký.");
    }
    phone = UtilsHelper.parsePhone(phone, "0");
    let customer = await CustomerModel.findOne({ phone });
    // có customer
    if (customer) {
      // có psid
      if (psid) {
        // console.log('customer + psid', psid);
        // kiem tra nếu không có Index Page

        const pageAccountByPsID = customer.pageAccounts.find((a: any) => a.psid == psid);
        if (!pageAccountByPsID) {
          const pageAccountIndexByMember = customer.pageAccounts.findIndex(
            (a: any) => a.memberId.toString() == member.id
          );
          if (pageAccountIndexByMember > -1) {
            customer.pageAccounts.splice(pageAccountIndexByMember, 1);
          }
          customer.pageAccounts.push({
            memberId: member._id,
            pageId: member.fanpageId,
            psid,
          });
        }

        const chatbotHelper = new ChatBotHelper(member.chatbotKey);
        const subscriberInfo = await CustomerHelper.getInfo(chatbotHelper, psid);
        customer.facebookName = customer.facebookName ? customer.facebookName : subscriberInfo.name;
        customer.gender = customer.gender ? customer.gender : subscriberInfo.gender;
        customer.name = customer.name === "Khách vãng lai" ? subscriberInfo.name : customer.name;
        customer.avatar =
          customer.avatar === "https://i.imgur.com/NN9xQ5Q.png"
            ? subscriberInfo.profilePic
            : customer.avatar;
      } else {
        // console.log("customer - psid");
        const params = {
          memberId: member._id,
          pageId: member.fanpageId,
        };
        const pageAccountByMember = customer.pageAccounts.find(
          (a: any) => a.memberId.toString() == member.id
        );
        if (!pageAccountByMember) {
          customer.pageAccounts.push(params);
        }
      }
    } else {
      // console.log("no customer");
      customer = new CustomerModel({
        code: await CustomerHelper.generateCode(), // Mã khách hàng
        name: "Khách vãng lai",
        phone: phone,
        avatar: "https://i.imgur.com/NN9xQ5Q.png",
        pageAccounts: [
          {
            memberId: member._id,
            pageId: member.fanpageId,
          },
        ],
      });
      if (psid) {
        console.log("no customer + psId", psid);
        const chatbotHelper = new ChatBotHelper(member.chatbotKey);
        const subscriberInfo = await CustomerHelper.getInfo(chatbotHelper, psid);
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
