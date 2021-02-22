import { counterService } from "../counter/counter.service";
import { IAddressStorehouse } from "./addressStorehouse.model";

export class AddressStorehouseHelper {
  constructor(public addressStorehouse: IAddressStorehouse) {}
  static async generateCode() {
    return await counterService.trigger("addressstorehouse").then((count) => "AS" + count);
  }
}
