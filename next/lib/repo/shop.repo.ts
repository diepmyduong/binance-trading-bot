import { ShopConfig } from "./shop-config.repo";
import { BaseModel, CrudRepository } from "./crud.repo";

export interface Shop extends BaseModel {
  id: string;
  username: string;
  uid: string;
  name: string;
  avatar: string;
  shopCover: string;
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
  config: ShopConfig;
}
export class ShopRepository extends CrudRepository<Shop> {
  apiName: string = "Shop";
  displayName: string = "shop";
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
  shopCover:String
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
  addressDeliveryIds: [ID]
  deliveryDistricts: [String]
  config{
    vnpostCode: String
    vnpostPhone: String
    vnpostName: String
    shipPreparationTime: String
    shipDefaultDistance: Int
    shipDefaultFee: Float
    shipNextFee: Float
    shipOneKmFee: Float
    shipUseOneKmFee: Boolean
    shipNote: String
    rating: Float
    ratingQty: Int
    soldQty: Int
    tags{
      name:String
      icon:String
      qty:Int
    }: [ShopTag]
    banners{
      image:String
      title:String
      subtitle:String
      actionType:String
      link:String
      product{
        name:String
        image:String
        code:String
      }
      voucher{
        code:String
      }
    }:[ShopBanner]
    productGroups{
      name:String
      products{
        image :String
        name :String
        priority 
        basePrice:Float 
        downPrice :Float
        code :String
        labels{
          name :String
          color:String
        }:[ProductLabel]
      }
    }
  }:[ShopConfig]
  `);

  async getShopData() {
    return await this.apollo
      .query({
        query: this.gql`query {  getShopData { ${this.fullFragment} }}`,
      })
      .then((res) => res.data["getShopData"] as Shop);
  }
  async loginAnonymous(shopCode: string) {
    return await this.apollo
      .mutate({
        mutation: this.gql`mutation{
          loginAnonymous(shopCode:"${shopCode}")
        }`,
      })
      // .then((res) => console.log(res));
      .then((res) => res.data["loginAnonymous"] as string);
  }
}
export const ShopService = new ShopRepository();
