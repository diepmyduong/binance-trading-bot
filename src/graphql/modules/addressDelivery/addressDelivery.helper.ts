import { counterService } from "../counter/counter.service";
import { IAddressDelivery } from "./addressDelivery.model";

export class AddressDeliveryHelper {
  constructor(public addressDelivery: IAddressDelivery) {}
  static async generateCode() {
    return await counterService.trigger("addressdelivery").then((count) => "AD" + count);
  }
}
