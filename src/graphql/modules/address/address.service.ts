import { CrudService } from "../../../base/crudService";
import { ErrorHelper } from "../../../base/error";
import { IWardTypeResponse, VietnamPostHelper } from "../../../helpers";
import { AddressModel } from "./address.model";
class AddressService extends CrudService<typeof AddressModel> {
  constructor() {
    super(AddressModel);
  }

  async setProvinceName(doc: any) {
    if (!doc.provinceId) return this;
    const address = await AddressModel.findOne({ provinceId: doc.provinceId });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Tỉnh / thành");
    doc.province = address.province;
    return this;
  }
  async setDistrictName(doc: any) {
    if (!doc.districtId) return this;
    const address = await AddressModel.findOne({ districtId: doc.districtId });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Quận / Huyện");
    doc.district = address.district;
    return this;
  }
  async setWardName(doc: any) {
    if (!doc.wardId) return this;
    const address = await AddressModel.findOne({ wardId: doc.wardId });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Phường / Xã");
    doc.ward = address.ward;
    return this;
  }

  async syncAddressWithVietnamPost() {
    const wards: IWardTypeResponse[] = await VietnamPostHelper.getWards();
    for (const address of wards) {
      const data: any = {
        province: address.TenTinhThanh,
        provinceId: address.MaTinhThanh,
        district: address.TenQuanHuyen,
        districtId: address.MaQuanHuyen,
        ward: address.TenPhuongXa,
        wardId: address.MaPhuongXa,
      };
      await addressService.create(data);
    }
  }
}

const addressService = new AddressService();

export { addressService };

// syns data tại đây
// (async () => {
//   console.log(
//     "----------------------------- Start sync here -----------------------------"
//   );
//   await addressService.syncAddressWithVietnamPost();
//   console.log(
//     "----------------------------- End sync here -----------------------------"
//   );
// })();
