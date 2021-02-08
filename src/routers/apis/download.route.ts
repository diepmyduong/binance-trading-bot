import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";
import { auth } from "../../middleware/auth";

const path = require("path");
class DownloadRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/sms-template.xlsx", [auth], this.route(this.smsTemplate));
    this.router.get(
      "/service-template.xlsx",
      [auth],
      this.route(this.serviceTemplate)
    );
    this.router.get(
      "/diligence-template.xlsx",
      [auth],
      this.route(this.diligenceTemplate)
    );
    this.router.get(
      "/evoucher-template.xlsx",
      [auth],
      this.route(this.evoucherTemplate)
    );
    this.router.get(
      "/address-storehouse-template.xlsx",
      [auth],
      this.route(this.addressStorehouse)
    );
    this.router.get(
      "/address-delivery-template.xlsx",
      [auth],
      this.route(this.addressDelivery)
    );
  }

  async smsTemplate(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR);
    const file = path.resolve("public/templates", "sms-template.xlsx");
    res.sendFile(file);
  }

  async serviceTemplate(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR);
    const file = path.resolve("public/templates", "service-template.xlsx");
    res.sendFile(file);
  }

  async diligenceTemplate(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR);
    const file = path.resolve("public/templates", "diligence-template.xlsx");
    res.sendFile(file);
  }

  async evoucherTemplate(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR);
    const file = path.resolve("public/templates", "evoucher-template.xlsx");
    res.sendFile(file);
  }

  async addressStorehouse(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR);
    const file = path.resolve("public/templates", "storehouse-template.xlsx");
    res.sendFile(file);
  }

  async addressDelivery(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR);
    const file = path.resolve("public/templates", "delivery-template.xlsx");
    res.sendFile(file);
  }
}

export default new DownloadRoute().router;
