import { Context } from "../../context";
import { AddressModel } from "./address.model";

const Query = {
  getDistrict: async (root: any, args: any, context: Context) => {
    const { provinceId } = args;
    let districtOfProvinceData = [];
    if (provinceId) {
      districtOfProvinceData = await AddressModel.aggregate([
        { $match: { provinceId, districtId: { $ne: null } } },
        { $group: { _id: "$districtId", district: { $first: "$district" } } },
        { $project: { id: "$_id", district: 1 } },
        { $sort: { district: 1 } },
      ]);
    }
    return districtOfProvinceData;
  },
};

export default {
  Query,
};
