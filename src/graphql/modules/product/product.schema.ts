import { gql } from "apollo-server-express";
import { ProductType } from "./product.model";

const schema = gql`
  extend type Query {
    getAllProduct(q: QueryGetListInput): ProductPageData
    getMobifoneProducts(q: QueryGetListInput): ProductPageData
    getAllCrossSaleProducts(sellerId:ID): [Product]
    getOneProduct(id: ID!): Product
  }

  extend type Mutation {
    createProduct(data: CreateProductInput!): Product
    updateProduct(id: ID!, data: UpdateProductInput!): Product
    cloneToCrosssale(id: ID!, data: CloneProductinput!): Product
    deleteOneProduct(id: ID!): Product
    deleteManyProduct(ids: [ID]): Int
  }

  input CloneProductinput {
    crossSaleInventory: Int!
    commission0:Float,
    commission1:Float,
    commission2:Float,
    enabledMemberBonus: Boolean
    enabledCustomerBonus: Boolean
    memberBonusFactor:Int,
    customerBonusFactor:Int

    width: Int
    length: Int
    height: Int
    weight: Int
  }

  input CreateProductInput {
    code: String
    name: String!
    basePrice: Float!
    subtitle: String
    intro: String
    image: String!
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
    baseCommission: Float
    enabledMemberBonus: Boolean
    enabledCustomerBonus: Boolean
    memberBonusFactor: Int
    customerBonusFactor: Int
    #delivery
    width: Int
    length: Int
    height: Int
    weight: Int
  }

  input UpdateProductInput {
    code: String
    name: String
    basePrice: Float
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
    baseCommission: Float
    enabledMemberBonus: Boolean
    enabledCustomerBonus: Boolean
    memberBonusFactor: Int
    customerBonusFactor: Int
    #delivery
    width: Int
    length: Int
    height: Int
    weight: Int
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
    "Loại sản phẩm ${Object.values(ProductType)}"
    type: String
    "Gía bán"
    basePrice: Float
    "Mô tả ngắn"
    subtitle: String
    "Giới thiệu sản phẩm"
    intro: String
    "Hình ảnh đại diện"
    image: String
    "Hoa hồng Mobifone"
    commission0: Float
    "Hoa hồng điểm bán"
    commission1: Float
    "Hoa hồng giới thiệu"
    commission2: Float
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

    category: Category
    member: Member
  }

  type ProductPageData {
    data: [Product]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
