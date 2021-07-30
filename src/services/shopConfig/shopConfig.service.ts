import DataLoader from "dataloader";
import { keyBy, get } from "lodash";
import { ServiceSchema } from "moleculer";
import { IShopConfig, ShopConfigModel } from "../../graphql/modules/shopConfig/shopConfig.model";
import { ttlCache } from "../../helpers/ttlCache";

export default {
  name: "shopConfig",

  actions: {
    get: {
      params: { id: { type: "string" } },
      async handler(ctx) {
        const { id } = ctx.params;
        return ShopConfigByCodeLoader.load(id);
      },
    },
  },
} as ServiceSchema;

const ShopConfigByCodeLoader = new DataLoader<string, IShopConfig>(
  (ids: string[]) => {
    return ShopConfigModel.find({ memberId: { $in: ids } }).then((list) => {
      const keyByIds = keyBy(list, "memberId");
      return ids.map((id) => get(keyByIds, id));
    });
  },
  { cache: true, cacheMap: ttlCache({ ttl: 30000, maxSize: 100 }) }
);
