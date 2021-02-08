import { Context } from "../../context";
import { AddressModel } from "./address.model";

const Query = {
  getWard: async (root: any, args: any, context: Context) => {
    const { districtId } = args;
    let wardOfDistricData = [];
    if (districtId) {
      wardOfDistricData = await AddressModel.aggregate([
        { $match: { districtId, wardId: { $ne: null } } },
        { $group: { _id: "$wardId", ward: { $first: "$ward" } } },
        { $project: { id: "$_id", ward: 1 } },
        { $sort: { ward: 1 } },
      ]);
    }
    return wardOfDistricData;
  },
};

export default {
  Query,
};
