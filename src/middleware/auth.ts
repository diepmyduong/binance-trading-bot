import { ErrorHelper } from "../base/error";
import { Context } from "../graphql/context";

export const auth = (req: any, res: any, next: any) => {
  const params: any = { req };

  // const token = this.getXToken(req);
  // console.log('params', params);
  req.context = new Context({ req });
  next();
};
