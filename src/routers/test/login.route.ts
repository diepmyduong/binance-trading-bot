import { Request, Response } from "express";
import config from "config";
export default [
  {
    method: "get",
    path: "/firebase/loginPhone",
    midd: [],
    action: async (req: Request, res: Response) => {
      res.render("loginPhone", { config: config.get("firebase.webConfig") });
    },
  },
  {
    method: "get",
    path: "/firebase/loginEmail",
    midd: [],
    action: async (req: Request, res: Response) => {
      res.render("loginEmail", { config: config.get("firebase.webConfig") });
    },
  },
];
