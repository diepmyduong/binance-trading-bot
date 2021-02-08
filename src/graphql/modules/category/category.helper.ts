import { counterService } from "../counter/counter.service";
import { ICategory } from "./category.model";

export class CategoryHelper {
  constructor(public category: ICategory) {}

  static generateCode() {
    return counterService.trigger("category").then((c) => "DM" + c);
  }
}
