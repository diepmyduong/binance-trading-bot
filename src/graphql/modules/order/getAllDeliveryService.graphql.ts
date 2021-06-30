import { gql } from "apollo-server-express";
import { compact, get } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { Ahamove } from "../../../helpers/ahamove/ahamove";
import { CreateOrderProps } from "../../../helpers/ahamove/type";
import { Context } from "../../context";
import { IShopBranch, ShopBranchModel } from "../shopBranch/shopBranch.model";
import { IShopConfig, ShopConfigModel } from "../shopConfig/shopConfig.model";
import { IOrder, OrderModel, ShipMethod } from "./order.model";

export type DeliveryService = {
  shipMethod: ShipMethod;
  serviceId: string;
  serviceName: string;
  iconUrl: string;
  duration: string;
  shipFee: number;
};

export default {
  schema: gql`
    extend type Query {
      getAllDeliveryService(orderId: ID!): [DeliveryService]
    }
    type DeliveryService {
      "Phương thức vận chuyển ${Object.values(ShipMethod)}"
      shipMethod: String
      "Mã dịch vụ"
      serviceId: String
      "Tên dịch vụ"
      serviceName: String
      "Hình icon"
      iconUrl: String
      "Thời gian ước tính"
      duration: String
      "Phí ship"
      shipFee: Float
    }
  `,
  resolver: {
    Query: {
      getAllDeliveryService: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.ADMIN_EDITOR_MEMBER_STAFF);
        const { orderId } = args;
        const [shopConfig, order] = await Promise.all([
          ShopConfigModel.findOne({ memberId: context.sellerId }),
          OrderModel.findById(orderId),
        ]);
        const branch = await ShopBranchModel.findById(order.shopBranchId);
        const services: DeliveryService[] = [];
        await setAhamoveServices(order, shopConfig, services, branch);
        services.push({
          shipMethod: ShipMethod.DRIVER,
          serviceId: ShipMethod.DRIVER,
          serviceName: "Tài xế nội bộ",
          duration: branch.shipPreparationTime,
          iconUrl: null,
          shipFee: order.shipfee,
        });
        return services;
      },
    },
  },
};
async function setAhamoveServices(
  order: IOrder,
  shopConfig: IShopConfig,
  services: DeliveryService[],
  branch: IShopBranch
) {
  const ahamove = new Ahamove({});
  const ahamoveServices = await ahamove
    .fetchAllServices(order.latitude, order.longitude)
    .then((res) => res.filter((r: any) => /\-(BIKE|EXPRESS)/.test(r._id)));

  const lat: number = get(branch, "location.coordinates.1");
  const lng: number = get(branch, "location.coordinates.0");
  const address = compact([branch.address, branch.ward, branch.district, branch.province]).join(
    ", "
  );
  const estimatedFees = await ahamove.estimatedFeeMutilService(
    {
      token: shopConfig.shipAhamoveToken,
      order_time: parseInt((Date.now() / 1000).toFixed(0)),
      path: [
        {
          lat: lat,
          lng: lng,
          address: address,
          short_address: branch.district,
          name: branch.name,
          remarks: order.note,
        },
        {
          lat: parseFloat(order.latitude),
          lng: parseFloat(order.longitude),
          address: address,
          short_address: branch.district,
          name: branch.name,
          remarks: order.note,
        },
      ],
      payment_method: "CASH",
      remarks: order.note,
    } as CreateOrderProps,
    ahamoveServices.map((s: any) => ({ _id: s._id }))
  );
  estimatedFees.forEach((fee: any) => {
    const service = ahamoveServices.find((s: any) => s._id == fee._id);
    services.push({
      shipMethod: ShipMethod.AHAMOVE,
      serviceId: fee._id,
      serviceName: service.name,
      iconUrl: service.icon_url,
      duration: (fee.duration / 60).toFixed(0),
      shipFee: fee.total_pay,
    });
  });
}
