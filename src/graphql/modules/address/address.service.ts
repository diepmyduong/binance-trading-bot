import { CrudService } from "../../../base/crudService";
import { ErrorHelper } from "../../../base/error";
import { IWardTypeResponse, VietnamPostHelper } from "../../../helpers";
import { AddressModel } from "./address.model";
class AddressService extends CrudService<typeof AddressModel> {
  constructor() {
    super(AddressModel);
  }

  async setProvinceName(doc: any, key = "provinceId", name = "province") {
    if (!doc[key]) return this;
    const address = await AddressModel.findOne({ provinceId: doc[key] });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Tỉnh / thành");
    doc[name] = address.province;
    return this;
  }
  async setDistrictName(doc: any, key = "districtId", name = "district") {
    if (!doc[key]) return this;
    const address = await AddressModel.findOne({ districtId: doc[key] });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Quận / Huyện");
    doc[name] = address.district;
    return this;
  }
  async setWardName(doc: any, key = "wardId", name = "ward") {
    if (!doc[key]) return this;
    const address = await AddressModel.findOne({ wardId: doc[key] });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Phường / Xã");
    doc[name] = address.ward;
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
