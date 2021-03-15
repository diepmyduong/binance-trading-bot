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
            addressStorehouseIds: [shopAddressStorehouseId],
            // mainAddressStorehouseId: shopAddressStorehouseId,
            addressDeliveryIds: shopAddressDeliveryIds,
          },
          { new: true }
        );
      }
    }

    res.sendStatus(200);
  }

  async addAddressStorehouseToShop(req: Request, res: Response) {
    const shops = await MemberModel.find({});

    const addressStorehouses = await AddressStorehouseModel.find({});

    for (const shop of shops) {
      const addressStorehouseIds = addressStorehouses
        .filter(
          (addr) =>
            addr.code !== shop.mainAddressStorehouseId &&
            !["60336471423465cf3b0f4dfa", "60336471423465cf3b0f4dfb"].includes(
              addr.id
            )
        )
        .map((store) => store.id);
      await MemberModel.findByIdAndUpdate(
        shop.id,
        { addressStorehouseIds },
        { new: true }
      );
    }

    res.sendStatus(200);
  }


  async updateAddressByShop(req: Request, res: Response) {
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
