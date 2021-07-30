import { compact } from "lodash";

import { CrudService } from "../../../base/crudService";
import { Ahamove } from "../../../helpers/ahamove/ahamove";
import { IMember } from "../member/member.model";
import { ShopConfigModel } from "./shopConfig.model";

class ShopConfigService extends CrudService<typeof ShopConfigModel> {
  constructor() {
    super(ShopConfigModel);
  }
  getDefaultConfig() {
    return {
      shipPreparationTime: "30 phút",
      shipDefaultDistance: 2,
      shipDefaultFee: 15000,
      shipNextFee: 5000,
      shipOneKmFee: 0,
      shipUseOneKmFee: true,
      shipNote: "",
    };
  }

  async setAhamoveToken(m: IMember) {
    const ahamove = new Ahamove({});
    const address = compact([m.address, m.ward, m.district, m.province]).join(", ");
    const account = await ahamove.regisUserAccount({
      name: m.shopName,
      mobile: m.phone,
      address,
    });
    await ShopConfigModel.updateOne(
      { memberId: m._id },
      { $set: { shipAhamoveToken: account.token } },
      { upsert: true }
    ).exec();
  }
}

const shopConfigService = new ShopConfigService();

export { shopConfigService };
