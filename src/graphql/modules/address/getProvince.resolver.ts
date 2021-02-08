import { Context } from "../../context";
import { AddressModel } from "./address.model";

const Query = {
  getProvince: async (root: any, args: any, context: Context) => {
    let provinceData = await AddressModel.aggregate([
      { $group: { _id: "$provinceId", province: { $first: "$province" } } },
      { $project: { id: "$_id", province: 1 } },
      { $sort: { province: 1 } },
    ]);
    return provinceData;
  },
};

export default {
  Query,
};
