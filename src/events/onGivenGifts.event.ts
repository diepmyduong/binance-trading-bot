import { Subject } from "rxjs";

import { SettingKey } from "../configs/settingData";
import { CustomerLoader, CustomerModel } from "../graphql/modules/customer/customer.model";
import { CustomerPointLogType } from "../graphql/modules/customerPointLog/customerPointLog.model";
import { LuckyWheelModel } from "../graphql/modules/luckyWheel/luckyWheel.model";
import { GiftType, LuckyWheelGiftModel } from "../graphql/modules/luckyWheelGift/luckyWheelGift.model";
import { ILuckyWheelResult, SpinStatus } from "../graphql/modules/luckyWheelResult/luckyWheelResult.model";
import { MemberLoader, MemberModel } from "../graphql/modules/member/member.model";

import { SettingHelper } from "../graphql/modules/setting/setting.helper";
import { UserModel } from "../graphql/modules/user/user.model";
// import { ErrorHelper } from "../helpers/error.helper";
import { EventHelper } from "./event.helper";
import { onSendChatBotText } from "./onSendToChatbot.event";
export const onGivenGifts = new Subject<ILuckyWheelResult>();


// tính điểm thưởng cho khách hàng
// gửi cho khách hàng 
onGivenGifts.subscribe(async (result) => {
    if (result.status === SpinStatus.WIN) {

        const { customerId, memberId, luckyWheelId, giftId } = result;
        const [seller, customer, luckyWheel, luckyWheelGift] = await Promise.all([
            MemberModel.findById(memberId),
            CustomerModel.findById(customerId),
            LuckyWheelModel.findById(luckyWheelId),
            LuckyWheelGiftModel.findById(giftId)
        ]);
        const pageAccount = customer.pageAccounts.find((p) => p.pageId == seller.fanpageId);

        if (result.giftType === GiftType.COMMISSION) {

        }
        if (result.giftType === GiftType.EVOUCHER) {
            if (pageAccount) {
                // Quý khách đã may mắn trúng thưởng {{}} điểm sau khi quay vòng quay {{}}.
                const defaultMsg = await SettingHelper.load(SettingKey.LUCKYWHEEL_WIN_EVOUCHER_MSG_FOR_CUSTOMER);
                const msg = luckyWheelGift.desc ? luckyWheelGift.desc : defaultMsg;

                onSendChatBotText.next({
                    apiKey: seller.chatbotKey,
                    psids: [pageAccount.psid],
                    message: msg,
                    context: {
                        maVongQuay: luckyWheel.code,
                        maQua: result.code,
                        tenQua: luckyWheelGift.name,
                        chiTiet: result.eVoucherCode,
                    },
                });
            }
        }

        if (result.giftType === GiftType.PRESENT) {
            if (pageAccount) {
                // Quý khách đã may mắn trúng thưởng {{}} điểm sau khi quay vòng quay {{}}.
                const defaultMsg = await SettingHelper.load(SettingKey.LUCKYWHEEL_WIN_PRESENT_MSG_FOR_CUSTOMER);
                const msg = luckyWheelGift.desc ? luckyWheelGift.desc : defaultMsg;

                onSendChatBotText.next({
                    apiKey: seller.chatbotKey,
                    psids: [pageAccount.psid],
                    message: msg,
                    context: {
                        maVongQuay: luckyWheel.code,
                        maQua: result.code,
                        tenQua: luckyWheelGift.name,
                        chiTiet: luckyWheelGift.payPresent,
                    },
                });
            }
        }

        if (result.giftType === GiftType.CUMMULATIVE_POINT) {
            //   ghi log - customerPointLogService - lại trước
            await EventHelper.payCustomerPoint({
                customerId: result.customerId,
                id: result._id,
                type: CustomerPointLogType.RECEIVE_FROM_LUCKY_WHEEL,
                buyerBonusPoint: result.payPoint,
            });

            if (pageAccount) {

                const defaultMsg = await SettingHelper.load(SettingKey.LUCKYWHEEL_WIN_CUMMULATIVE_POINT_MSG_FOR_CUSTOMER);
                const msg = luckyWheelGift.desc ? luckyWheelGift.desc : defaultMsg;

                onSendChatBotText.next({
                    apiKey: seller.chatbotKey,
                    psids: [pageAccount.psid],
                    message: msg,
                    context: {
                        diem: result.payPoint,
                        maVongQuay: luckyWheel.code,
                        maQua: result.code,
                        tenQua: luckyWheelGift.name,
                        tongDiem: customer.cumulativePoint
                    },
                });
            }
        }
    }
});

onGivenGifts.subscribe(async (result) => {
    if (result.status === SpinStatus.LOSE) {
        const { customerId, memberId, luckyWheelId, giftId } = result;
        const [seller, customer, luckyWheel, luckyWheelGift] = await Promise.all([
            MemberModel.findById(memberId),
            CustomerModel.findById(customerId),
            LuckyWheelModel.findById(luckyWheelId),
            LuckyWheelGiftModel.findById(giftId)
        ]);

        const pageAccount = customer.pageAccounts.find((p) => p.pageId == seller.fanpageId);
        if (pageAccount) {

            const defaultMsg = await SettingHelper.load(SettingKey.LUCKYWHEEL_LOSE_MSG_FOR_CUSTOMER);
            const msg = luckyWheelGift.desc ? luckyWheelGift.desc : defaultMsg;

            onSendChatBotText.next({
                apiKey: seller.chatbotKey,
                psids: [pageAccount.psid],
                message: msg,
                context: {
                    maVongQuay: luckyWheel.code,
                    maQua: result.code,
                    tenQua: luckyWheelGift.name,
                },
            });
        }
    }
});

// duyệt đơn thành công
// tính hoa hồng mobifone - f0 - commission0
// gửi cho mobiphone khi 

onGivenGifts.subscribe(async (result) => {

    const { customerId, memberId, status, luckyWheelId, giftId } = result;
    const [seller, customer, users, luckyWheel, luckyWheelGift, apiKey] = await Promise.all([
        MemberLoader.load(memberId),
        CustomerLoader.load(customerId),
        UserModel.find({ psid: { $exists: true } }),
        LuckyWheelModel.findById(luckyWheelId),
        LuckyWheelGiftModel.findById(giftId),
        SettingHelper.load(SettingKey.CHATBOT_API_KEY),
    ]);

    if (status === SpinStatus.WIN) {
        if (result.giftType === GiftType.COMMISSION) {

        }
        if (result.giftType === GiftType.DILIGENCE_POINT) {

        }
        if (result.giftType === GiftType.CUMMULATIVE_POINT) {
            SettingHelper.load(SettingKey.LUCKYWHEEL_WIN_CUMMULATIVE_POINT_MSG_FOR_MOBIFONE).then((msg) => {
                onSendChatBotText.next({
                    apiKey: apiKey,
                    psids: users.map((u) => u.psid),
                    message: msg,
                    context: {
                        maQua: result.code,
                        maVongQuay: luckyWheel.code,
                        tenKhachHang: customer.facebookName,
                        diem: result.payPoint
                    },
                });
            });
        }
        if (result.giftType === GiftType.PRESENT) {
            SettingHelper.load(SettingKey.LUCKYWHEEL_WIN_PRESENT_MSG_FOR_MOBIFONE).then((msg) => {
                onSendChatBotText.next({
                    apiKey: apiKey,
                    psids: users.map((u) => u.psid),
                    message: msg,
                    context: {
                        maQua: result.code,
                        tenQua: luckyWheelGift.name,
                        maVongQuay: luckyWheel.code,
                        tenKhachHang: customer.facebookName,
                    },
                });
            });
        }

        if (result.giftType === GiftType.EVOUCHER) {
            SettingHelper.load(SettingKey.LUCKYWHEEL_WIN_EVOUCHER_MSG_FOR_MOBIFONE).then((msg) => {
                onSendChatBotText.next({
                    apiKey: apiKey,
                    psids: users.map((u) => u.psid),
                    message: msg,
                    context: {
                        maQua: result.code,
                        tenQua: luckyWheelGift.name,
                        maVongQuay: luckyWheel.code,
                        tenKhachHang: customer.facebookName,
                        chiTiet: result.eVoucherCode
                    },
                });
            });
        }
    }
});