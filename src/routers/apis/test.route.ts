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
import { IOrder, OrderModel, OrderStatus } from "../../graphql/modules/order/order.model";
import { CommissionLogModel } from "../../graphql/modules/commissionLog/commissionLog.model";
import { CollaboratorModel } from "../../graphql/modules/collaborator/collaborator.model";
import { CustomerModel } from "../../graphql/modules/customer/customer.model";
import { OrderLogModel } from "../../graphql/modules/orderLog/orderLog.model";
import { ObjectId } from "bson";
import { CustomerCommissionLogModel } from "../../graphql/modules/customerCommissionLog/customerCommissionLog.model";
import { orderService } from "../../graphql/modules/order/order.service";
// import { ObjectId } from "mongodb";
// import khongdau from "khong-dau";

class TestRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/", this.route(this.updateOrders));
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
      isPost: true, allowPickup: true
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

      console.log('getMember', member.shopName);

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
        console.log('created', created.name);
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

  async updateChatbotKey(req: Request, res: Response) {

  }

  async updateOrders(req: Request, res: Response) {
    const orders = await OrderModel.find({});
    for (const order of orders) {
      // const member = await MemberModel.findById(order.sellerId);
      // if(!order.sellerCode){
      //   await OrderModel.findByIdAndUpdate(order.id, { 
      //     $set: { 
      //       sellerCode: member.code ? member.code : "", 
      //       sellerName: member.shopName ? member.shopName : member.name, 
      //     } 
      //   }, { new: true })
      // }
      console.log('order',order.id);
      
      await orderService.updateLogToOrder({order, log:null});

      // const orderLog = await OrderLogModel.findOne({ 
      //   orderId: order.id , 
      //   orderStatus:{$in:[ 
      //     OrderStatus.CANCELED,
      //     OrderStatus.COMPLETED,
      //     OrderStatus.FAILURE,
      //   ]}});
      // if(orderLog){
      //   // console.log('orderLog',orderLog.createdAt);
      //   await OrderModel.findByIdAndUpdate(order.id , {$set:{
      //     finishedAt: orderLog.createdAt
      //   }}, {new: true})
      // }
    }

    res.sendStatus(200);
  }

  async updateNameMembers(req: Request, res: Response) {
    const members = await MemberModel.find({});

    for (const member of members) {
      const { shopName } = member;
      const shopNamePart = shopName.split("-");
      let newShopName = "";
      if (shopNamePart.length > 1) {
        newShopName = `PSHOP BC ${shopNamePart[1]}`;
      }

      // console.log("newShopName", newShopName);

      // await MemberModel.findByIdAndUpdate(member.id, { $set: { shopName: "" } }, { new: true });
    }
  }

}

export default new TestRoute().router;

// (async () => {

//   const customerCommissionLogs = await CustomerCommissionLogModel.find({});
//   for (const commission of customerCommissionLogs) {
//     if (commission.collaboratorId) {
//       const order = await OrderModel.findById(commission.orderId);
//       if (order) {
//         if (order.collaboratorId) {
//           await CustomerCommissionLogModel.findByIdAndUpdate(commission.id, {
//             $set: {
//               collaboratorId: order.collaboratorId
//             }
//           }, { new: true })
//         }
//       }
//     }
//   }

//   // // cap nhat ten chu shop
//   // const member = await MemberModel.findOne({ code: "PKDBDTTGD" });
//   // console.log("member",member);



//   // const orderLogs = await OrderLogModel.find({ memberId: member.id });
//   // const orderIds = orderLogs.map(o => new ObjectId(o.orderId));
//   // // console.log("orderIds", orderIds);

//   // const orders = await OrderModel.find({ _id: { $in: orderIds } });
//   // const completedOrders = orders.filter((o: IOrder) => o.status === OrderStatus.COMPLETED);

//   // console.log("orders",completedOrders.length);

//   // const commissionLog = await CommissionLogModel.find({
//   //   memberId: member.id, createdAt: {
//   //     $gte: new Date("2021-04-02T00:00:00+07:00"),
//   //     $lte: new Date("2021-04-04T24:00:00+07:00")
//   //   }
//   // });
//   // console.log("member", member.id);

//   // console.log("commissionLogaaa", commissionLog.length);

//   // console.log('commissionLog',commissionLog.reduce((total: number, m: any) => {
//   //   console.log(m.value);
//   //   return total += m.value;
//   // }, 0));

//   // const orders = await OrderModel.find({ sellerId: bdgd.id, status: OrderStatus.COMPLETED });
//   // console.log('orders.length',orders.length);
//   // console.log('orders.length',orders.reduce((total: number, m: any) => {
//   //   console.log(m.amount);
//   //   return total += m.amount;
//   // }, 0));
//   // console.log('bdgd',bdgd);


//   // cap nhat ten khách hàng
//   // const collaborators = await CollaboratorModel.find({});
//   // for (const collaborator of collaborators) {
//   //   await CustomerModel.findByIdAndUpdate(collaborator.customerId, { $set: {
//   //     name: collaborator.name
//   //   } }, { new: true });
//   // }

// })()