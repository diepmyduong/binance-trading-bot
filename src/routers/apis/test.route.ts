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
import { CommissionLogModel, CommissionLogType } from "../../graphql/modules/commissionLog/commissionLog.model";
import { CollaboratorModel } from "../../graphql/modules/collaborator/collaborator.model";
import { CustomerModel } from "../../graphql/modules/customer/customer.model";
import { OrderLogModel } from "../../graphql/modules/orderLog/orderLog.model";
import { ObjectId } from "bson";
import { CustomerCommissionLogModel, CustomerCommissionLogType } from "../../graphql/modules/customerCommissionLog/customerCommissionLog.model";
import { orderService } from "../../graphql/modules/order/order.service";
import { ProductModel } from "../../graphql/modules/product/product.model";
import { OrderItemModel } from "../../graphql/modules/orderItem/orderItem.model";
import { ChatBotHelper } from "../../helpers/chatbot.helper";
import { SettingKey } from "../../configs/settingData";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import { MemberHelper } from "../../graphql/modules/member/member.helper";
import { Context } from "../../graphql/context";
import ConnectChatbotResolver from '../../graphql/modules/member/resolvers/connectChatbot.resolver'
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

// hoi tao lai member Đặng Công Tín
// Khoi tao lai member Bùi Thị Thanh Hương
// Khoi tao lai member Trương Hoàng Ngọc Vân
// Khoi tao lai member Trần Ngọc Huyền
// Khoi tao lai member Phạm Thị Kim Hương
// Khoi tao lai member Lương Nguyễn Ngọc Quỳnh
// Khoi tao lai member Võ Hoàng Kim Ngân
// Khoi tao lai member Nguyễn Hoàng Anh Thư
// Khoi tao lai member Nguyễn Thị Xuân Anh
// Khoi tao lai member Võ Tâm Linh Phương
// Khoi tao lai member Phan Thị Thu Hoàng
// Khoi tao lai member Đỗ Thị Thanh Hương
// Khoi tao lai member Trần Thị Bảo Ngọc
// Khoi tao lai member Phạm Thị Bích Ngà
// Khoi tao lai member Huỳnh Thị Ngọc Lam
// Khoi tao lai member Đinh Thị Tô Hạnh
// Khoi tao lai member Trần Thị Thu Thanh
// Khoi tao lai member Ngô Thị Thu Mỹ
// Khoi tao lai member Đường Minh Trang
// Khoi tao lai member Nguyễn Thị Thuận Ngọc
// Khoi tao lai member Lê Thị Kim Ngân
// Khoi tao lai member Võ Tấn Lực
// Khoi tao lai member Đỗ Khánh Linh
// Khoi tao lai member Trần Thị Thanh Hằng
// Khoi tao lai member Lê Chơn Thị Bích Liên
// Khoi tao lai member Nguyễn Thái Thanh
// Khoi tao lai member Nguyễn Hùng Tấn
// Khoi tao lai member Lê Thanh Hiền
// Khoi tao lai member Nguyễn Thị Thiên Hương
// Khoi tao lai member Nguyễn Thị Kim Hồng
// Khoi tao lai member Lưu Thị Hiền
// Khoi tao lai member Nguyễn Thị Út Mười
// Khoi tao lai member Phạm Thị Bích Liễu
// Khoi tao lai member Võ Thị Út Mười
// Khoi tao lai member Nguyễn Thị Thanh
// Khoi tao lai member Võ Bích Xiên
// Khoi tao lai member Huỳnh Thị Kim Nhẹ
// Khoi tao lai member Huỳnh Thị Mỹ Phi
// Khoi tao lai member Nguyễn Kim Nhật Tâm
// Khoi tao lai member Bùi Thị Kiều Nga
// Khoi tao lai member Đinh Ngọc Phương Anh
// Khoi tao lai member Bùi Thị Liệt
// Khoi tao lai member Nguyễn Ngọc Hùng
// Khoi tao lai member Cao Thị Điệp
// Khoi tao lai member Nguyễn Thị Thu Hoài
// Khoi tao lai member Phan Thị Thanh Tâm
// Khoi tao lai member Nguyễn Thi Thu Hà
// Khoi tao lai member Hoàng Văn Cường
// Khoi tao lai member Trương Thị Tuyết Minh
// Khoi tao lai member Dương Minh Quỳnh Liên
// Khoi tao lai member Nguyễn Thị Ngọc Dung
// Khoi tao lai member Lê Hồng Hạnh
// Khoi tao lai member Trịnh Thị Ngọc Thủy
// Khoi tao lai member Trần Thị Thu Hà
// Khoi tao lai member Nguyễn Trần Phương Linh
// Khoi tao lai member Hồ Thị Thu Thảo
// Khoi tao lai member Phạm Lệ Vân Trang
// Khoi tao lai member Lê Thị Mộng Điệp
// Khoi tao lai member Huỳnh Dương Thanh
// Khoi tao lai member Nguyễn Thị Kim Thi
// Khoi tao lai member Võ Lê Thanh Huyền
// Khoi tao lai member Huỳnh Hồng Yến
// Khoi tao lai member Phan Thị Minh Thùy
// Khoi tao lai member Phan Thị Diệu
// Khoi tao lai member Huỳnh Quốc Dân
// Khoi tao lai member Hứa Thụy Anh Thư
// Khoi tao lai member Trần Võ Hoàng Thanh
// Khoi tao lai member Nguyễn Thị Kim Ngọc
// Khoi tao lai member Lê Hoa Sen
// Khoi tao lai member Ngô Thị Minh Đài
// Khoi tao lai member Nguyễn Thị Kim Loan
// Khoi tao lai member Nguyễn Thị Tâm
// Khoi tao lai member Trần Thị Nhật Phượng
// Khoi tao lai member Bùi Thị Kim Hoàng
// Khoi tao lai member Châu Ngọc Trâm
// Khoi tao lai member Dương Phương Linh
// Khoi tao lai member Trần Nữ Thể Nhi
// Khoi tao lai member Phạm Thị Thu Hương
// Khoi tao lai member Nguyễn Thị Thanh Loan
// Khoi tao lai member Võ Thị Tám
// Khoi tao lai member Lê Thị Cẩm Hằng
// Khoi tao lai member Nguyễn Thị Nga
// Khoi tao lai member Phan Thị Trang Đài
// Khoi tao lai member Trương Hạnh Uyên
// Khoi tao lai member Nguyễn Thị Mỹ Linh
// Khoi tao lai member Nguyễn Thị Thanh Nga
// Khoi tao lai member Nguyễn Thị Hương Thảo
// Khoi tao lai member Nguyễn Thị Chánh
// Khoi tao lai member TRẦN THỊ HỒNG TUYẾN
// Khoi tao lai member Huỳnh Minh Trung
// Khoi tao lai member NGUYỄN THỊ THANH MAI
// Khoi tao lai member Lê Thị Liễu
// Khoi tao lai member Phan Chí Thanh
// Khoi tao lai member Võ Thị Trang Thơ
// Khoi tao lai member Trần Thị Gái Sáu
// Khoi tao lai member LA NGỌC LAN
// Khoi tao lai member NGUYỄN THỊ ANH ĐÀO
// Khoi tao lai member TRẦN VŨ DIỄM
// Khoi tao lai member TRẦN THỊ THANH TÂM
// Khoi tao lai member HUỲNH PHƯƠNG BẢO CHI
// Khoi tao lai member TRẦN THỊ NGỌC CHÂU
// Khoi tao lai member LÊ KIM LOAN
// Khoi tao lai member NGUYỄN THỊ TUYẾT LOAN
// Khoi tao lai member NGUYỄN THỊ BÍCH VÂN
// Khoi tao lai member TRẦN THỊ NGỌC UYÊN
// Khoi tao lai member PHẠM THẢO QUỐC HƯƠNG
// Khoi tao lai member LƯU THỊ NGOAN
// Khoi tao lai member LÊ THỊ PHƯƠNG TÂM
// Khoi tao lai member TẠ THỊ MINH THƠ
// Khoi tao lai member ĐOÀN KIM KHOA
// Khoi tao lai member NGUYỄN THỊ HỒNG NGỌC
// Khoi tao lai member NGUYỄN THỊ KIM VÂN
// Khoi tao lai member NGUYỄN DÂN HỒNG
// Khoi tao lai member NGUYỄN THỊ NGỌC BÍCH
// Khoi tao lai member PHẠM THỊ CẨM VÂN
// Khoi tao lai member Trần Bạch Tuyết
// Khoi tao lai member Nguyễn Tường Vân
// Khoi tao lai member Hoàng Thị Thanh Nga
// Khoi tao lai member Hà Thỵ Thùy Lynh
// Khoi tao lai member Lê Thị Thanh Ngân
// Khoi tao lai member Khổng Thị Thu Hiền
// Khoi tao lai member Đinh Trần Minh Nguyệt 
// Khoi tao lai member Lê Thị Kiều Oanh
// Khoi tao lai member Nguyễn Thị Hồng Tuyết
// Khoi tao lai member NGUYỄN HOÀNG THANH
// Khoi tao lai member Đoàn Thị Minh Phụng
// Khoi tao lai member NGUYỄN THÁI THANH UYÊN
// Khoi tao lai member LƯU THỊ NGỌC THẢO
// Khoi tao lai member Nguyễn Thị Mai Trang
// Khoi tao lai member Nguyễn Võ Thị Thu Hà
// Khoi tao lai member Thi Thị Kim Nga
// Khoi tao lai member Võ Ngọc Anh
// Khoi tao lai member Nguyễn Thị Liễu
// Khoi tao lai member NGUYỄN THỊ YẾN LINH
// Khoi tao lai member Mai Hoàng Phúc
// Khoi tao lai member Huỳnh Huế Phương
// Khoi tao lai member Trần Thị Thúy Hồng
// Khoi tao lai member Lê Nguyễn Thị Tường Vy
// Khoi tao lai member NGUYỄN THỊ HỒNG NGỌC
// Khoi tao lai member TRẦN THỊ KIM SA
// Khoi tao lai member ĐINH THỊ TỐ QUYÊN
// Khoi tao lai member NGUYỄN THỊ NGỌC OANH
// Khoi tao lai member Nguyễn Ngọc Lan
// Khoi tao lai member Bùi Thị Mỹ Thuận
// Khoi tao lai member Phạm Thị Hoàng Hà
// Khoi tao lai member Lê Thị Phương Thảo
// Khoi tao lai member Lê Thị Kim Oanh
// Khoi tao lai member Tài chính Bưu chính
// Khoi tao lai member Nguyễn Duy Hiếu
// Khoi tao lai member Nguyễn Lâm Quốc
// Khoi tao lai member NGUYỄN TẤN DŨNG
// Khoi tao lai member Trần Thị Anh Đào