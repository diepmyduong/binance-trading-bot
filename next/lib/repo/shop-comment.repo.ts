import { BaseModel, CrudRepository } from "./crud.repo";

export interface ShopComment extends BaseModel {
  memberId: string;
  customerId: string;
  orderId: string;
  ownerName: string;
  message: string;
  rating: string;
  status: "PENDING" | "PUBLIC" | "HIDDEN";
}
export class ShopCommentRepository extends CrudRepository<ShopComment> {
  apiName: string = "ShopComment";
  displayName: string = "bình luận";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    customerId: ID
    orderId: ID
    ownerName: String
    message: String
    rating: Int
    status: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    customerId: ID
    orderId: ID
    ownerName: String
    message: String
    rating: Int
    status: String
  `);
}

export const ShopCommentService = new ShopCommentRepository();

export const SHOP_COMMENT_STATUS: Option[] = [
  { value: "PENDING", label: "Chờ duyệt", color: "warning" },
  { value: "PUBLIC", label: "Công khai", color: "success" },
  { value: "HIDDEN", label: "Đang ẩn", color: "bluegray" },
];
