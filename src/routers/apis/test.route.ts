import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { firebaseHelper, VietnamPostHelper } from "../../helpers";
import { OrderModel, OrderStatus } from "../../graphql/modules/order/order.model";
import { CommissionLogModel, CommissionLogType } from "../../graphql/modules/commissionLog/commissionLog.model";
import { CollaboratorModel } from "../../graphql/modules/collaborator/collaborator.model";
import { CustomerModel } from "../../graphql/modules/customer/customer.model";
import { CustomerCommissionLogModel, CustomerCommissionLogType } from "../../graphql/modules/customerCommissionLog/customerCommissionLog.model";
import { orderService } from "../../graphql/modules/order/order.service";
import { ProductModel } from "../../graphql/modules/product/product.model";
import { OrderItemModel } from "../../graphql/modules/orderItem/orderItem.model";
import { Context } from "../../graphql/context";
import ConnectChatbotResolver from '../../graphql/modules/member/resolvers/connectChatbot.resolver';
import { AddressDeliveryModel } from "../../graphql/modules/addressDelivery/addressDelivery.model";
import { AddressStorehouseModel } from "../../graphql/modules/addressStorehouse/addressStorehouse.model";
import { MemberModel, MemberType } from "../../graphql/modules/member/member.model";
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
    await MemberModel.find({ chatbotKey: { $exists: true } }).then(async res => {
      for (const member of res) {
        try {
          console.log('Khoi tao lai member', member.name);
          const context = new Context();
          context.tokenData = { _id: member._id } as any;
          await ConnectChatbotResolver.Mutation.connectChatbot(null, { apiKey: member.chatbotKey }, context);
        } catch (err) {
          console.log('loi', err.message);
        }
      }
    });
    res.sendStatus(200);
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
      console.log('order', order.id);

      await orderService.updateLogToOrder({ order, log: null });

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

  //b1: chinh sua commission trong product
  async changeProduction(req: Request, res: Response) {
    const products = await ProductModel.find({});
    for (const product of products) {
      const hhCTV = product.commission1;
      const hhDiemban = product.commission2;
      console.log('product', product.id);
      await ProductModel.findByIdAndUpdate(product.id, { $set: { commission1: hhDiemban, commission2: hhCTV } }, { new: true });
    }
    res.sendStatus(200);
  }

  //b2: chinh sua commission trong order;
  async changeOrder(req: Request, res: Response) {
    const orders = await OrderModel.find({});
    for (const order of orders) {
      console.log('orderId', order.id);
      const orderItems = await OrderItemModel.find({ orderId: order.id });
      for (const orderItem of orderItems) {
        const hhCTV = orderItem.commission1;
        const hhDiemban = orderItem.commission2;
        console.log('orderItem', orderItem.id);
        await OrderItemModel.findByIdAndUpdate(orderItem.id, { $set: { commission1: hhDiemban, commission2: hhCTV } }, { new: true });
      }
      const hhCTV = order.commission1;
      const hhDiemban = order.commission2;
      await OrderModel.findByIdAndUpdate(order.id, { $set: { commission1: hhDiemban, commission2: hhCTV } }, { new: true });
    }
    res.sendStatus(200);
  }

  async compareOrder(req: Request, res: Response) {
    const orders = await OrderModel.find({});
    for (const order of orders) {
      console.log('orderId', order.id);
      const orderItems = await OrderItemModel.find({ orderId: order.id });
      for (const orderItem of orderItems) {
        if (orderItem.commission1 > orderItem.commission2) {
          console.log('orderId', orderItem.id, "Chua doi");
        }
      }
      if (order.commission1 > order.commission2) {
        console.log('orderId', order.id, "Chua doi");
      }
    }
    res.sendStatus(200);
  }

  async updateCommissionLog(req: Request, res: Response) {
    const orders = await OrderModel.find({});
    const commissions = await CommissionLogModel.find({});
    for (const commission of commissions) {

      const order = orders.find(o => o.id.toString() === commission.orderId.toString());
      console.log('order', order);
      if (order) {
        if (commission.type === CommissionLogType.RECEIVE_COMMISSION_1_FROM_ORDER) {
          await CommissionLogModel.findByIdAndUpdate(commission.id, { $set: { value: order.commission1 } }, { new: true });
        }

        if (commission.type === CommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER_FOR_COLLABORATOR) {
          await CommissionLogModel.findByIdAndUpdate(commission.id, { $set: { value: order.commission2 } }, { new: true });
        }
      }
    }
    res.sendStatus(200);
  }

  async updateCustomerCommissionLog(req: Request, res: Response) {
    const orders = await OrderModel.find({});
    const commissions = await CustomerCommissionLogModel.find({});
    for (const commission of commissions) {

      const order = orders.find(o => o.id.toString() === commission.orderId.toString());
      // console.log('order', order);
      if (order) {
        if (commission.type === CustomerCommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER) {
          await CustomerCommissionLogModel.findByIdAndUpdate(commission.id, { $set: { value: order.commission2 } }, { new: true });
        }
      }
    }
    res.sendStatus(200);
  }

  async modifyCustomerCommissionLog(req: Request, res: Response) {
    const orders = await OrderModel.find({});

    for (const order of orders) {
      if (order.collaboratorId && order.status === OrderStatus.COMPLETED) {
        const collaborator = await CollaboratorModel.findById(order.collaboratorId);
        if (collaborator) {
          const customer = await CustomerModel.findById(collaborator.customerId);
          if (customer) {
            const customerCommissionLog = await CustomerCommissionLogModel.findOne({ customerId: customer.id, orderId: order.id });
            if (customerCommissionLog) {
              if (!customerCommissionLog.collaboratorId) {
                console.log('em no ko co collaboratorId', order.collaboratorId);
                await CustomerCommissionLogModel.findByIdAndUpdate(customerCommissionLog.id, { $set: { collaboratorId: order.collaboratorId } }, { new: true });
              }
            }
            else {
              console.log('em bi dinh chuong may thang', order.id);
              await CustomerCommissionLogModel.create({
                customerId: customer.id,
                memberId: order.sellerId,  // mã shop
                value: order.commission2, // Giá trị
                type: CustomerCommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER, // Loại sự kiện
                orderId: order.id, // Mã đơn hàng
                collaboratorId: order.collaboratorId // Mã cộng tác viên
              });
            }
          }
          else {
            console.log('co collaborator nhung ko thay customer', order.id);
          }
        }
        else {
          console.log('co collaboratorId trong don nhung ko co collaborator', order.id);
        }
      }
    }

    const commission = await CustomerCommissionLogModel.find({});



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
