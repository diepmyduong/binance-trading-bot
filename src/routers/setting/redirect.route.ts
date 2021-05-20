import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import { Request, Response } from "express";
export default [
  {
    method: "get",
    path: "/api/setting/redirect/:key",
    midd: [],
    action: async (req: Request, res: Response) => {
      const redirect = await SettingHelper.load(req.params["key"] as any, { secure: true });
      return res.redirect(redirect);
    },
  },
];
