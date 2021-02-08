import { CounterModel } from "../counter/counter.model";
import { counterService } from "../counter/counter.service";
import { IProduct } from "./product.model";

export class ProductHelper {
  constructor(public product: IProduct) {}
  static async generateCode() {
    return await counterService.trigger("product").then((count) => "P" + count);
  }
}
