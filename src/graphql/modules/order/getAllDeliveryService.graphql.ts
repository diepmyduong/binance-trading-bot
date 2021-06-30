import { gql } from "apollo-server-express";
import { compact, get } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { Ahamove } from "../../../helpers/ahamove/ahamove";
import { Context } from "../../context";
import { ShopBranchModel } from "../shopBranch/shopBranch.model";
import { ShopConfigModel } from "../shopConfig/shopConfig.model";
import { OrderModel, ShipMethod } from "./order.model";

type DeliveryService = {
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
    }
  `,
  resolver: {
    Query: {
      getAllDeliveryService: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.ADMIN_EDITOR_MEMBER_STAFF);
        const { orderId } = args;
        const shopConfig = await ShopConfigModel.findOne({ memberId: context.sellerId });
        const order = await OrderModel.findById(orderId);
        const services: DeliveryService[] = [];
        const ahamove = new Ahamove({});
        const ahamoveServices = await ahamove
          .fetchAllServices(order.latitude, order.longitude)
          .then((res) => res.filter((r: any) => /\-(BIKE|EXPRESS)/.test(r._id)));
        const branch = await ShopBranchModel.findById(order.shopBranchId);
        const lat: number = get(branch, "location.coordinates.1");
        const lng: number = get(branch, "location.coordinates.0");
        const address = compact([
          branch.address,
          branch.ward,
          branch.district,
          branch.province,
        ]).join(", ");
        // const estimatedFee = await ahamove.estimatedFeeMutilService(
        //   {
        //     token: shopConfig.shipAhamoveToken,
        //     order_time: parseInt((Date.now() / 1000).toFixed(0)),
        //     path: [
        //       {
        //         lat: lat,
        //         lng: lng,
        //         address: address,
        //         short_address: branch.district,
        //         name: branch.name,
        //         remarks: order.note,
        //       },
        //       {
        //         lat: parseFloat(order.latitude),
        //         lng: parseFloat(order.longitude),
        //         address: address,
        //         short_address: branch.district,
        //         name: branch.name,
        //         remarks: order.note,
        //       },
        //     ],
        //     payment_method: "CASH",
        //     remarks: order.note,
        //   },
        //   ahamoveServices.map((s: any) => ({ _id: s._id }))
        // );
      },
    },
  },
};
