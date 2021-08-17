import { Request, Response } from "express";
import { SettingHelper } from "../../graphql/modules/setting/common";
export default [
  {
    method: "get",
    path: "/api/setting/script.js",
    midd: [],
    action: async (req: Request, res: Response) => {
      const script = await SettingHelper.load("ad-script");
      res.type(".js");
      res.send(script);
      res.end();
    },
  },
];
