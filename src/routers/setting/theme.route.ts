import DataLoader from "dataloader";
import { Request, Response } from "express";
import { get, keyBy } from "lodash";

import { MemberModel } from "../../graphql/modules/member/member.model";
import { ttlCache } from "../../helpers/ttlCache";

export default [
  {
    method: "get",
    path: "/api/setting/theme/:shopCode",
    midd: [],
    action: async (req: Request, res: Response) => {
      const { shopCode } = req.params;
      const shopColor = await ShopColorLoader.load(shopCode);
      const primaryHSL = HexToHSL(shopColor.primaryColor);
      const accentHSL = HexToHSL(shopColor.accentColor);
      res.type(".css");
      res.send(`:root {
        --color-primary-light: ${HSLtoHex(primaryHSL[0], primaryHSL[1], 96)};
        --color-primary: ${shopColor.primaryColor};
        --color-primary-dark: ${LightenDarkenColor(shopColor.primaryColor, -6)};
        --color-accent-light: ${HSLtoHex(accentHSL[0], accentHSL[1], 96)};
        --color-accent: ${shopColor.accentColor};
        --color-accent-dark: ${LightenDarkenColor(shopColor.accentColor, -6)};
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
      const keyById = keyBy(list, "code");
      console.log(keyById, list);
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

function HSLtoHex(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function HexToHSL(H: string) {
  // Convert hex to RGB first
  let r: any = 0,
    g: any = 0,
    b: any = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
  // return "hsl(" + h + "," + s + "%," + l + "%)";
}
