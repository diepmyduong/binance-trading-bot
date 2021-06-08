import { gql } from "apollo-server-express";
import { uniq } from "lodash";
import { Context } from "../../context";
import { AddressDeliveryLoader, IAddressDelivery } from "../addressDelivery/addressDelivery.model";
import { IMember } from "./member.model";

export default {
  schema: gql`
    extend type Member {
      deliveryDistricts: [String]
    }
  `,
  resolver: {
    Member: {
      deliveryDistricts: async (root: IMember, args: any, context: Context) => {
        if (root.addressDeliveryIds) {
          const addressDeliveries = await AddressDeliveryLoader.loadMany(
            root.addressDeliveryIds.map((id) => id.toString())
          );
          return uniq(addressDeliveries.map((a: IAddressDelivery) => a.districtId));
        } else {
          return [];
        }
      },
    },
  },
};
