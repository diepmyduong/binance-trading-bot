import { Request, Response } from "express";
import { SettingKey } from "../../configs/settingData";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
export default [
  {
    method: "get",
    path: "/api/setting/script.js",
    midd: [],
    action: async (req: Request, res: Response) => {
      const script = await SettingHelper.load(SettingKey.SCRIPT);
      res.type(".js");
      res.send(script);
      res.end();
    },
  },
];
