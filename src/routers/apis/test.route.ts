import { AddressDeliveryModel } from "../../graphql/modules/addressDelivery/addressDelivery.model";
import { AddressStorehouseModel } from "../../graphql/modules/addressStorehouse/addressStorehouse.model";
import { MemberModel, MemberType } from "../../graphql/modules/member/member.model";
import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { FirebaseHelper, firebaseHelper, VietnamPostHelper } from "../../helpers";
// import { ObjectId } from "mongodb";
// import khongdau from "khong-dau";

class TestRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/", this.route(this.updateAddressStorehouseByShop));
  }

  async test(req: Request, res: Response) {
    // console.log("aaaaaaaaaa ........");
    res.sendStatus(200);
  }


  async addAddressToShop(req: Request, res: Response) {
    // console.log("aaaaaaaaaa ........");

    const shops = await MemberModel.find({ type: MemberType.BRANCH });

    const addressDeliverys = await AddressDeliveryModel.find({ isPost: true });

    const addressStorehouses = await AddressStorehouseModel.find({
      isPost: true, allowPickup:true
    });

    for (const member of shops) {
      const params: any = {
        addressStorehouseIds: addressStorehouses.map((id) => id),
        addressDeliveryIds: addressDeliverys.map((id) => id),
      };

      const mainAddressStorehouseId = addressStorehouses.find(
        (addr) => addr.code === member.code
      );

      params.mainAddressStorehouseId = mainAddressStorehouseId;

      await MemberModel.findByIdAndUpdate(
        member.id,
        { $set: params },
        { new: true }
      );
    }

    res.sendStatus(200);
  }

  async updateAddressStorehouseByShop(req: Request, res: Response) {
    const members = await MemberModel.find({ type: MemberType.BRANCH });

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      // console.log("member.code", i,member.code);

      const post = await VietnamPostHelper.getPostByAddress(
        member.provinceId,
        member.districtId,
        member.wardId
      );

      const location = {
        coordinates: [post ? post.Longitude : 0, post ? post.Latitude : 0],
        type: "Point",
      };

      console.log('getMember',member.shopName);

      const params: any = {
        code: member.code,
        province: member.province,
        district: member.district,
        ward: member.ward,
        provinceId: member.provinceId,
        districtId: member.districtId,
        wardId: member.wardId,
        name: member.shopName,
        email: member.username,
        phone: member.phone,
        address: member.address,
        isPost: true,
      };

      if (location) {
        params.location = location;
      } else {
        params.location = {
          coordinates: [0, 0],
          type: "Point",
        };
      }

      const addressStorehouse = await AddressStorehouseModel.findOne({
        code: member.code,
      });

      if (addressStorehouse) {
        // await AddressStorehouseModel.findOneAndUpdate(
        //   { code: member.code },
        //   params,
        //   { new: true }
        // );
      } else {
        const created = await AddressStorehouseModel.create(params);
        console.log('created',created.name);
      }
    }

    res.sendStatus(200);
  }

  async updateAddressDeliveryByShop(req: Request, res: Response) {
    const members = await MemberModel.find({ type: MemberType.BRANCH });

    for (let i = 0; i < members.length; i++) {
      const member = members[i];

      const addressDelivery = await AddressDeliveryModel.findOne({
        code: member.code,
      });

      const params: any = {
        code: member.code,
        province: member.province,
        district: member.district,
        ward: member.ward,
        provinceId: member.provinceId,
        districtId: member.districtId,
        wardId: member.wardId,
        name: member.shopName,
        email: member.username,
        phone: member.phone,
        address: member.address,
        isPost: true,
      };

      if (addressDelivery) {
        // await AddressDeliveryModel.findOneAndUpdate(
        //   { code: member.code },
        //   params,
        //   { new: true }
        // );
      } else {
        await AddressDeliveryModel.create(params);
      }
    }

    res.sendStatus(200);
  }

  async updateStorehouseLocation(req: Request, res: Response) {
    const storehouses = await AddressStorehouseModel.find({});

    // console.log("storehouses", storehouses);

    for (const storehouse of storehouses) {
      const post = await VietnamPostHelper.getPostByAddress(
        storehouse.provinceId,
        storehouse.districtId,
        storehouse.wardId
      );

      const location = {
        coordinates: [post.Longitude, post.Latitude],
        type: "Point",
      };

      // console.log("location", location);
      await AddressStorehouseModel.findByIdAndUpdate(
        storehouse.id,
        {
          location,
        },
        { new: true }
      );
    }

    res.sendStatus(200);
  }


  async changePassAll(req: Request, res: Response) {

    const members = await MemberModel.find({
      isPost: true,
      activated: true,
    });

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      try {
        const user = await firebaseHelper.app.auth().getUserByEmail(member.username);
        if (user.uid) {
          firebaseHelper.app.auth().updateUser(user.uid, { password: "Pshop#2021" });
        }
        console.log('user', user);
      } catch (error) {
        console.log("ko update dc")
      }
    }

    res.sendStatus(200);
  }

}

export default new TestRoute().router;
