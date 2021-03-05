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
    this.router.get("/", this.route(this.test));
  }

  async test(req: Request, res: Response) {
    // console.log("aaaaaaaaaa ........");
    res.sendStatus(200);
  }

  async addAddressToShop(req: Request, res: Response) {
    // console.log("aaaaaaaaaa ........");

    const shops = await MemberModel.find({});

    const addressDeliverys = await AddressDeliveryModel.find({});

    const addressStorehouses = await AddressStorehouseModel.find({});

    for (const shop of shops) {
      const shopAddressDeliveryIds = addressDeliverys
        .filter((addr) => addr.code !== shop.code)
        .map((addr) => addr._id);

      const filteredshopAddressStorehouse = addressStorehouses.find(
        (addr) => addr.code === shop.code
      );

      const shopAddressStorehouseId = filteredshopAddressStorehouse
        ? filteredshopAddressStorehouse.id
        : null;

      // console.log("shopAddressDeliveryIds", shopAddressDeliveryIds);
      // console.log("shopAddressStorehouseId", shopAddressStorehouseId);

      if (shopAddressStorehouseId) {
        await MemberModel.findByIdAndUpdate(
          shop.id,
          {
            // addressStorehouseIds: [shopAddressStorehouseId],
            // mainAddressStorehouseId: shopAddressStorehouseId,
            addressDeliveryIds: shopAddressDeliveryIds,
          },
          { new: true }
        );
      }
    }

    res.sendStatus(200);
  }
}

export default new TestRoute().router;
