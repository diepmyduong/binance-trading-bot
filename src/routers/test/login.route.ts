import { Request, Response } from "express";
import { configs } from "../../configs";
export default [
  {
    method: "get",
    path: "/firebase/loginPhone",
    midd: [],
    action: async (req: Request, res: Response) => {
      res.render("loginPhone", { config: configs.firebaseView });
    },
  },
  {
    method: "get",
    path: "/firebase/loginEmail",
    midd: [],
    action: async (req: Request, res: Response) => {
      res.render("loginEmail", { config: configs.firebaseView });
    },
  },
];
