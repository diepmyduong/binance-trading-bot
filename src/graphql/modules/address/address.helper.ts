import { ErrorHelper } from "../../../base/error";
import { AddressModel } from "./address.model";

export class AddressHelper {
  static async setProvinceName(doc: any) {
    if (!doc.provinceId) return this;
    const address = await AddressModel.findOne({ provinceId: doc.provinceId });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Tỉnh / thành");
    doc.province = address.province;
    return this;
  }
  static async setDistrictName(doc: any) {
    if (!doc.districtId) return this;
    const address = await AddressModel.findOne({ districtId: doc.districtId });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Quận / Huyện");
    doc.district = address.district;
    return this;
  }
  static async setWardName(doc: any) {
    if (!doc.wardId) return this;
    const address = await AddressModel.findOne({ wardId: doc.wardId });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Phường / Xã");
    doc.ward = address.ward;
    return this;
  }
}
