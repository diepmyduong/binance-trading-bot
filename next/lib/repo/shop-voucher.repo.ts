import { BaseModel, CrudRepository } from "./crud.repo";
import { Product } from "./product.repo";

export interface ShopVoucher extends BaseModel {
  memberId: string;
  code: string;
  description: string;
  isActive: boolean;
  type: string;
  issueNumber: number;
  issueByDate: boolean;
  useLimit: number;
  useLimitByDate: boolean;
  discountUnit: string;
  discountValue: number;
  maxDiscount: number;
  offerItems: OfferItem[];
  discountItems: DiscountItem[];
  applyItemIds: string[];
  exceptItemIds: string[];
  minSubtotal: number;
  applyPaymentMethods: string[];
  minItemQty: number;
  startDate: string;
  endDate: string;
  isPrivate: boolean;
}
interface OfferItem {
  productId: string;
  qty: string;
  note: string;
  product: Product;
}
interface DiscountItem {
  productId: string;
  discountUnit: string;
  discountValue: number;
  maxDiscount: number;
  product: Product;
}
export class ShopVoucherRepository extends CrudRepository<ShopVoucher> {
  apiName: string = "ShopVoucher";
  displayName: string = "coupon";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    code: String
    description: String
    isActive: Boolean
    type: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    code: String
    description: String
    isActive: Boolean
    type: String
    issueNumber: Int
    issueByDate: Boolean
    useLimit: Int
    useLimitByDate: Boolean
    discountUnit: String
    discountValue: Float
    maxDiscount: Float
    offerItems {
      productId: string
      qty: string
      note: string
      product {
        id: String
        code: String
        image: String
      }: Product
    }: [OfferItem]
    discountItems {
      productId: string
      discountUnit: string
      discountValue: number
      maxDiscount: number
      product {
        id: String
        code: String
        image: String
      }: Product
    }: [DiscountItem]
    applyItemIds: [ID]
    exceptItemIds: [ID]
    minSubtotal: Float
    applyPaymentMethods: [String]
    minItemQty: Int
    startDate: DateTime
    endDate: DateTime
    isPrivate: Boolean
  `);
}
export const ShopVoucherService = new ShopVoucherRepository();

export const SHOP_VOUCHER_TYPES: Option[] = [
  { value: "DISCOUNT_BILL", label: "Giảm giá đơn hàng", color: "danger" },
  { value: "DISCOUNT_ITEM", label: "Giảm giá sản phẩm", color: "orange" },
  { value: "OFFER_ITEM", label: "Tặng sản phẩm", color: "info" },
  { value: "SHIP_FEE", label: "Giảm phí giao hàng", color: "success" },
];
