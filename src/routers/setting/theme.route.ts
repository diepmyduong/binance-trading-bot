import DataLoader from "dataloader";
import { Request, Response } from "express";
import { get, keyBy } from "lodash";
import { Types } from "mongoose";
import { MemberModel } from "../../graphql/modules/member/member.model";
import { IShopConfig } from "../../graphql/modules/shopConfig/shopConfig.model";

export const ttlCache = <K extends string, V = any>({
  ttl,
  maxSize,
}: {
  ttl: number;
  maxSize?: number;
}) => {
  let cache: Record<K, { value: V; expiresAt: number } | undefined> = Object.create(null);

  return {
    set: (key: K, value: V) => {
      const keys = Object.keys(cache) as K[];
      if (maxSize && keys.length === maxSize) {
        delete cache[keys[0]];
      }

      cache[key] = { value, expiresAt: Date.now() + ttl };
    },
    get: (key: K) => {
      const entry = cache[key];
      if (!entry) {
        return undefined;
      }

      if (entry.expiresAt < Date.now()) {
        delete cache[key];
        return undefined;
      }

      return entry.value;
    },
    clear: () => (cache = Object.create(null)),
    delete: (key: K) => delete cache[key],
  };
};
export default [
  {
    method: "get",
    path: "/api/setting/theme/:shopCode",
    midd: [],
    action: async (req: Request, res: Response) => {
      const { shopCode } = req.params;
      const shopColor = await ShopColorLoader.load(shopCode);
      res.type(".css");
      res.send(`:root {
        --color-primary-light: "${LightenDarkenColor(shopColor.primaryColor, 40)}";
        --color-primary: "${shopColor.primaryColor}";
        --color-primary-dark: "${LightenDarkenColor(shopColor.primaryColor, -40)}";
        --color-accent-light: "${LightenDarkenColor(shopColor.accentColor, 40)}";
        --color-accent: "${shopColor.accentColor}";
        --color-accent-dark: "${LightenDarkenColor(shopColor.accentColor, -40)}";
      }`);
      res.end();
    },
  },
];

const ShopColorLoader = new DataLoader<string, { primaryColor: string; accentColor: string }>(
  (ids: string[]) => {
    return MemberModel.aggregate([
      { $match: { code: { $in: ids } } },
      {
        $lookup: { from: "shopconfigs", localField: "_id", foreignField: "memberId", as: "config" },
      },
      { $unwind: "$config" },
    ]).then((list) => {
      const keyById = keyBy(list, "_id");
      return ids.map((code) =>
        get(keyById, code + ".config", { primaryColor: "#0D57EF", accentColor: "#38D0FF" })
      );
    });
  },
  { cache: true, cacheMap: ttlCache({ ttl: 30000, maxSize: 100 }) }
);

function LightenDarkenColor(color: string, percent: number) {
  var num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
