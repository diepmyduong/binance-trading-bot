import { AddressDeliveryModel } from "../../graphql/modules/addressDelivery/addressDelivery.model";
import { AddressStorehouseModel } from "../../graphql/modules/addressStorehouse/addressStorehouse.model";
import { MemberModel } from "../../graphql/modules/member/member.model";
import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
// import { ObjectId } from "mongodb";
// import khongdau from "khong-dau";

class TestRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/", this.route(this.addAddressToShop));
  }

  async test(req: Request, res: Response) {
    // console.log("aaaaaaaaaa ........");
    res.sendStatus(200);
  }

  async addAddressToShop(req: Request, res: Response) {
    const members = await MemberModel.find({});

    for (const member of members) {
      await AddressDeliveryModel.findOneAndUpdate(
        { code: member.code },
        {
          province:member.province,
          district:member.district,
          ward:member.ward,
          provinceId: member.provinceId,
          districtId: member.districtId,
          wardId: member.wardId,
          email:member.username,
        },
        { new: true }
      );

      await AddressStorehouseModel.findOneAndUpdate(
        { code: member.code },
        {
          province:member.province,
          district:member.district,
          ward:member.ward,
          provinceId: member.provinceId,
          districtId: member.districtId,
          wardId: member.wardId,
          email:member.username,
        },
        { new: true }
      );
    }

    res.sendStatus(200);
  }
}

export default new TestRoute().router;
