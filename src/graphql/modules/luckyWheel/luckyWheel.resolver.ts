import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { AgencyType, ILuckyWheel, LuckyWheelModel, WheelStatus } from "./luckyWheel.model";
import { luckyWheelService } from "./luckyWheel.service";
import { ErrorHelper } from "../../../base/error";
import { GiftType, ILuckyWheelGift, LuckyWheelGiftLoader, LuckyWheelGiftModel } from "../luckyWheelGift/luckyWheelGift.model";
import { LuckyWheelHelper } from "./luckyWheel.helper";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { LuckyWheelGiftHelper } from "../luckyWheelGift/luckyWheelGift.helper";
import { LuckyWheelResultLoader } from "../luckyWheelResult/luckyWheelResult.model";
import _, { set } from "lodash";
import { EVoucherModel } from "../eVoucher/eVoucher.model";

const Query = {
  getAllLuckyWheel: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR, ROLES.CUSTOMER]);

    console.log('--------------------> context.isCustomer', context.isCustomer());

    if (context.isCustomer()) {
      set(args, "q.filter.status", WheelStatus.OPEN);
      set(args, "q.filter.startDate", { $lte: new Date() });
      set(args, "q.filter.endDate", { $gte: new Date() });
    }

    return luckyWheelService.fetch(args.q);
  },
  getOneLuckyWheel: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    const { id } = args;
    return await luckyWheelService.findOne({ _id: id });
  },
};

const Mutation = {
  createLuckyWheel: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { data } = args;

    data.agencyType = AgencyType.MOBIFONE;

    if (context.isMember()) {
      data.agencyType = AgencyType.SHOPPER;
      data.memberId = context.sellerId;
    }

    data.code = data.code || (await LuckyWheelHelper.generateCode());

    const { gifts, startDate, endDate, successRatio, gamePointRequired, limitTimes } = data;

    const diff = LuckyWheelHelper.diffDate(startDate, endDate);
    if (diff <= 0)
      throw ErrorHelper.requestDataInvalid('. Ngày bắt đầu và ngày kết thúc không đúng.');

    // kiem tra ti le trung giai > 0
    if (successRatio <= 0)
      throw ErrorHelper.requestDataInvalid('. Tỉ lệ trúng thưởng phải lớn hơn 0');

    // kiem tra ti le trung giai > 0
    if (gamePointRequired < 0)
      throw ErrorHelper.requestDataInvalid('. Điểm tích lủy đủ để quay cần phải có phải lớn hơn hoặc bằng 0');

    if (limitTimes < 0)
      throw ErrorHelper.requestDataInvalid('. Giới hạn số lần quay phải > 0');


    // kiem tra gift có ko ?
    if (Object.keys(gifts).length < 1)
      throw ErrorHelper.requestDataInvalid('. Giải thưởng phải nhiều hơn 1 món');

    const luckyWheel = new LuckyWheelModel(data);
    // kiem tra chi tiet co gift ko ?
    //create OrderItem
    const newGifts: ILuckyWheelGift[] = [];

    for (let i = 0; i < gifts.length; i++) {
      const gift: ILuckyWheelGift = gifts[i];
      const {
        name,
        payPoint,
        qty,
      } = gift;
      gift.position = i;
      gift.code = gift.code || (await LuckyWheelGiftHelper.generateCode());

      if (payPoint < 0) {
        throw ErrorHelper.requestDataInvalid(`. Số lượng giải thưởng ${name} phải lớn hơn 0 `)
      }

      if (qty < 0) {
        throw ErrorHelper.requestDataInvalid(`. Số lượng giải thưởng ${name} phải lớn hơn 0 `)
      }


      if (gift.type === GiftType.EVOUCHER) {
        if (!gift.eVoucherId) {
          throw ErrorHelper.requestDataInvalid(`. Không có mã eVoucher`);
        }

        const evoucher = await EVoucherModel.findById(gift.eVoucherId);
        if (!evoucher)
          throw ErrorHelper.recoredNotFound(` mã eVoucher`);
      }

      gift.luckyWheelId = luckyWheel._id;
      newGifts.push(gift);
    }

    const giftItems: ILuckyWheelGift[] = newGifts.map((params: ILuckyWheelGift) => {
      const giftItem = new LuckyWheelGiftModel(params);
      return giftItem;
    });

    luckyWheel.giftIds = giftItems.sort((a, b) => a.position - b.position).map(i => i._id);

    // insert many
    // save
    return await Promise.all([
      luckyWheel.save(),
      LuckyWheelGiftModel.insertMany(giftItems),
    ]).then((res) => {
      return res[0];
    });
  },

  updateLuckyWheel: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id, data } = args;

    let { gifts, startDate, endDate, successRatio, gamePointRequired, limitTimes } = data;

    const luckyWheel = await LuckyWheelModel.findById(id);

    const diff = LuckyWheelHelper.diffDate(startDate, endDate);
    if (diff <= 0)
      throw ErrorHelper.requestDataInvalid('. Ngày bắt đầu và ngày kết thúc không đúng.');

    // kiem tra ti le trung giai > 0
    if (successRatio <= 0)
      throw ErrorHelper.requestDataInvalid('. Tỉ lệ trúng thưởng phải lớn hơn 0');

    // kiem tra ti le trung giai > 0
    if (gamePointRequired < 0)
      throw ErrorHelper.requestDataInvalid('. Điểm tích lủy đủ để quay cần phải có phải lớn hơn hoặc bằng 0');

    if (limitTimes < 0)
      throw ErrorHelper.requestDataInvalid('. Giới hạn số lần quay phải > 0');


    // kiem tra chi tiet co gift ko ?
    //create OrderItem
    const newGifts: ILuckyWheelGift[] = [];
    // console.log('luckyWheel', luckyWheel);

    for (let i = 0; i < gifts.length; i++) {
      const gift: ILuckyWheelGift = gifts[i];
      const {
        name,
        payPoint,
        qty,
      } = gift;
      gift.position = i;
      gift.code = gift.code || (await LuckyWheelGiftHelper.generateCode());
      gift.luckyWheelId = luckyWheel._id;
      if (payPoint < 0) {
        throw ErrorHelper.requestDataInvalid(`. Số lượng giải thưởng ${name} phải lớn hơn 0 `)
      }

      if (qty < 0) {
        throw ErrorHelper.requestDataInvalid(`. Số lượng giải thưởng ${name} phải lớn hơn 0 `)
      }

      if (gift.type === GiftType.EVOUCHER) {
        if (!gift.eVoucherId) {
          throw ErrorHelper.requestDataInvalid(`. Không có mã eVoucher`);
        }

        const evoucher = await EVoucherModel.findById(gift.eVoucherId);
        if (!evoucher)
          throw ErrorHelper.recoredNotFound(` mã eVoucher`);
      }

      if (gift.id) {
        const existed = await LuckyWheelGiftModel.findById(gift.id);
        if (!existed) {
          throw ErrorHelper.requestDataInvalid(`. Giải thưởng`);
        }
        const updated = await LuckyWheelGiftModel.findByIdAndUpdate(existed.id, gift, { new: true });
        newGifts.push(updated);
      } else {
        const newGift = new LuckyWheelGiftModel(gift);
        const created = await newGift.save();
        newGifts.push(created);
      }
    }

    const giftIds = newGifts.sort((a, b) => a.position - b.position).map(i => i._id);
    // console.log('giftIds', giftIds);

    data.giftIds = giftIds;

    const luckyWheelGiftBulk = LuckyWheelGiftModel.collection.initializeUnorderedBulkOp();
    luckyWheelGiftBulk.find({ luckyWheelId: luckyWheel._id, _id: { $nin: data.giftIds } }).remove()

    // save
    return Promise.all([
      LuckyWheelModel.findByIdAndUpdate(luckyWheel.id, { $set: data }, { new: true }),
      luckyWheelGiftBulk.execute()
    ]).then(([savedLuckyWheel]) => {
      return savedLuckyWheel;
    });
  },

  deleteOneLuckyWheel: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await luckyWheelService.deleteOne(id);
  },
};

const LuckyWheel = {
  gifts: luckyWheelService.getOrderedGiftsByLuckyWheelId(LuckyWheelGiftLoader, "giftIds"),
  results: luckyWheelService.getLuckyWheelResultByCutomerId("_id"),
};

export default {
  Query,
  Mutation,
  LuckyWheel,
};
