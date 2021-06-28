import { gql } from "apollo-server-express";
import { ProductType } from "./product.model";

const schema = gql`
  extend type Query {
    getAllProduct(q: QueryGetListInput): ProductPageData
    getAllPostProducts(q: QueryGetListInput): ProductPageData
    getMobifoneProducts(q: QueryGetListInput): ProductPageData
    getAllCrossSaleProducts(sellerId:ID): [Product]
    getOneProduct(id: ID!): Product
  }

  extend type Mutation {
    createProduct(data: CreateProductInput!): Product
    updateProduct(id: ID!, data: UpdateProductInput!): Product
    deleteOneProduct(id: ID!): Product
    importProducts(file: Upload!): String
    increaseViewCount(productId: ID!): Product
  }

  

  input CreateProductInput {
    "Mã sản phẩm"
    code: String
    "Tên sản phẩm"
    name: String!
    "Giá sản phẩm"
    basePrice: Float!
    "Mã danh mục"
    categoryId: ID!
  }

  input UpdateProductInput {
    code: String
    name: String
    basePrice: Float
    downPrice: Float
    "Tỷ lệ giảm giá"
    saleRate: Int
    subtitle: String
    intro: String
    image: String
    categoryId: ID
    allowSale: Boolean
    isCrossSale: Boolean
    crossSaleInventory: Int
    type: String
    smsSyntax: String
    smsPhone: String
    priority:Int
    commission0: Float
    commission1: Float
    commission2: Float
    commission3: Float
    baseCommission: Float
    enabledMemberBonus: Boolean
    enabledCustomerBonus: Boolean
    memberBonusFactor: Int
    customerBonusFactor: Int
    #delivery
    weight: Int
    width: Int
    length: Int
    height: Int

    "Các topping cho sản phẩm"
    toppings: [UpdateProductToppingInput]
  }

  type Product {
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    "Mã sản phẩm"
    code: String
    "Tên sản phẩm"
    name: String
    "Sản phẩm chính"
    isPrimary: Boolean
    "Sản phẩm bán chéo"
    isCrossSale: Boolean
    "Tồn kho bán chéo"
    crossSaleInventory: Int
    "Số lượng đã đặt"
    crossSaleOrdered: Int
    "Loại sản phẩm ${Object.values(ProductType)}"
    type: String
    "Gía bán"
    basePrice: Float
    "Giá giảm"
    downPrice: Float
    "Tỷ lệ giảm giá"
    saleRate: Int
    "Mô tả ngắn"
    subtitle: String
    "Giới thiệu sản phẩm"
    intro: String
    "Hình ảnh đại diện"
    image: String
    "Hoa hồng VNPOST"
    commission0: Float
    "Hoa hồng điểm bán"
    commission1: Float
    "Hoa hồng cộng tác viên"
    commission2: Float
    "Hoa hồng kho"
    commission3: Float
    "Hoa hồng CHO ĐIỂM BÁN"
    baseCommission: Float
    "Thưởng cho điểm bán"
    enabledMemberBonus: Boolean
    "Thưởng cho khách hàng"
    enabledCustomerBonus: Boolean
    "Hệ số thưởng điểm bán"
    memberBonusFactor: Int
    "Hệ số thưởng khách hàng"
    customerBonusFactor: Int
    "Danh mục sản phẩm"
    categoryId: ID
    "Cú pháp SMS"
    smsSyntax: String
    "SMS tới số điện thoại"
    smsPhone: String
    "Độ ưu tiên"
    priority:Int
    "Mở bán"
    allowSale: Boolean
    "Mã thành viên quản lý sản phẩm"
    memberId: ID
    "Hết hàng"
    outOfStock: Boolean
    #delivery
    "Chiều rộng"
    width: Int
    "Chiều dài"
    length: Int
    "Chiều cao"
    height: Int
    "Cân nặng"
    weight: Int
    "Các topping cho sản phẩm"
    toppings: [ProductTopping]

    category: Category
    member: Member
    collaboratorProduct: CollaboratorProduct
  }

  type ProductPageData {
    data: [Product]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
