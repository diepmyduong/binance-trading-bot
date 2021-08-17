import path from "path";
import express from "express";
import { walkSyncFiles } from "../helpers/common";
import BaseError from "../base/error";

const router = express.Router() as any;
const RouterFiles = walkSyncFiles(path.join(__dirname));

RouterFiles.filter((f) => /(.*).route.js$/.test(f)).map((f) => {
  const { default: routes } = require(f);
  for (const route of routes) {
    router[route.method](route.path, route.midd, (req: express.Request, res: express.Response) =>
      route.action(req, res).catch((error: any) => {
        if (!(error instanceof BaseError)) {
          error = new BaseError("unknow_error", error.message, 500, false);
          res.status(500).json(error);
        } else {
          res.status(error.httpCode).json({
            error: error.name,
            message: error.description,
          });
        }
      })
    );
  }
});

export default router;
