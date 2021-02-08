import { ErrorHelper } from "../../../base/error";
import { AddressModel } from "../address/address.model";
import { counterService } from "../counter/counter.service";
import { IRegisService } from "./regisService.model";

export class RegisServiceHelper {
  constructor(public regisService: IRegisService) { }

  static generateCode() {
    return counterService.trigger("regisService").then((c) => "SER" + c);
  }

  static validatePhone(phone: string) {
    if (!/^\d{9,10}$/g.test(phone)) {
      throw ErrorHelper.requestDataInvalid("Sai định dạng số điện thoại");
    }
    return this;
  }
  async setProvinceName() {
    if (!this.regisService.provinceId) return this;
    const address = await AddressModel.findOne({ provinceId: this.regisService.provinceId });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Tỉnh / thành");
    this.regisService.province = address.province;
    return this;
  }
  async setDistrictName() {
    if (!this.regisService.districtId) return this;
    const address = await AddressModel.findOne({ districtId: this.regisService.districtId });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Quận / Huyện");
    this.regisService.district = address.district;
    return this;
  }
  async setWardName() {
    if (!this.regisService.wardId) return this;
    const address = await AddressModel.findOne({ wardId: this.regisService.wardId });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Phường / Xã");
    this.regisService.ward = address.ward;
    return this;
  }
}
