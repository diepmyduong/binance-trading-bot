import { BaseModel, CrudRepository } from "./crud.repo";

export interface Shop extends BaseModel {
  id: string;
  username: string;
  uid: string;
  name: string;
  avatar: string;
  phone: string;
  fanpageId: string;
  fanpageName: string;
  fanpageImage: string;
  shopName: string;
  shopLogo: string;
  address: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  province: string;
  district: string;
  ward: string;
  allowSale: boolean;
  deliveryDistricts: string[];
}
export class ShopRepository extends CrudRepository<Shop> {
  apiName: string = "Shop";
  displayName: string = "Shop";
  shortFragment: string = this.parseFragment(`
  id: String
  username: String
  uid: String
  name: String
  avatar: String
  phone: String
  fanpageId: String
  fanpageName: String
  fanpageImage: String
  shopName: String
  shopLogo: String
  address: String
  provinceId: String
  districtId: String
  wardId: String
  province: String
  district: String
  ward: String
  allowSale: Boolean`);
  fullFragment: string = this.parseFragment(`
  id: String
  username: String
  uid: String
  name: String
  avatar: String
  phone: String
  fanpageId: String
  fanpageName: String
  fanpageImage: String
  shopName: String
  shopLogo: String
  address: String
  provinceId: String
  districtId: String
  wardId: String
  province: String
  district: String
  ward: String
  allowSale: Boolean
  deliveryDistricts: [String]`);

  async getShopData() {
    return await this.apollo
      .query({
        query: this.gql`query {  getShopData { ${this.fullFragment} }}`,
      })
      .then((res) => res.data["getShopData"] as Shop);
  }
}
export const ShopService = new ShopRepository();
