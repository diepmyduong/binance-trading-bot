import { CrudService } from "../../../base/crudService";
import { notFoundHandler } from "../../../helpers/common";
import { AddressModel } from "./address.model";

class AddressService extends CrudService {
  constructor() {
    super(AddressModel);
  }

  async setProvinceName(doc: any, key = "provinceId", name = "province") {
    if (!doc[key]) return this;
    const address = notFoundHandler(await AddressModel.findOne({ provinceId: doc[key] }));
    doc[name] = address.province;
    return this;
  }
  async setDistrictName(doc: any, key = "districtId", name = "district") {
    if (!doc[key]) return this;
    const address = notFoundHandler(await AddressModel.findOne({ districtId: doc[key] }));
    doc[name] = address.district;
    return this;
  }
  async setWardName(doc: any, key = "wardId", name = "ward") {
    if (!doc[key]) return this;
    const address = notFoundHandler(await AddressModel.findOne({ wardId: doc[key] }));
    doc[name] = address.ward;
    return this;
  }
  async setAddress(doc: any) {
    return await Promise.all([
      this.setProvinceName(doc),
      this.setDistrictName(doc),
      this.setWardName(doc),
    ]);
  }
}

const addressService = new AddressService();

export { addressService };
