import { ServiceSchema } from "moleculer";

import { CustomerLoader } from "../../graphql/modules/customer/customer.model";
import {
  CustomerVoucherModel,
  CustomerVoucherStatus,
} from "../../graphql/modules/customerVoucher/customerVoucher.model";
import { ShopVoucherLoader } from "../../graphql/modules/shopVoucher/shopVoucher.model";

export default {
  name: "voucher",
  actions: {
    issueUnlimit: {
      params: {
        voucherId: { type: "string" },
        customerId: { type: "string" },
        qty: { type: "number" },
        expired: { type: "date", optional: true },
      },
      async handler(ctx) {
        const { voucherId, customerId, qty, expired } = ctx.params;
        const [voucher, customer] = await Promise.all([
          ShopVoucherLoader.load(voucherId),
          CustomerLoader.load(customerId),
        ]);
        if (!voucher || !customer) throw Error("Dữ liệu không hợp lệ");
        const code =
          voucher.code + (await this.broker.call("counter.incr", { key: "customerVoucher:codes" }));
        const customerVoucher = new CustomerVoucherModel({
          code: code,
          memberId: voucher.memberId,
          customerId: customerId,
          voucherId: voucherId,
          voucherCode: voucher.code,
          issueNumber: qty < 1 ? 1 : qty,
          used: 0,
          expiredDate: expired,
          status: CustomerVoucherStatus.STILL_ALIVE,
          logs: [],
        });
        await customerVoucher.save();
        return customerVoucher;
      },
    },
  },
} as ServiceSchema;
