import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query{
    getCollaboratorsMediaReports(q: QueryGetListInput): MediaCollaboratorPageData
    getProductsMediaReports(q: QueryGetListInput): MediaProductPageData
    # Add Query
  }

  type MediaProductStats{
    unCompletedCount: Int
    completedCount: Int
  }

  type ProductMediaStats{
    likeCount: Int
    shareCount: Int
    commentCount: Int
    productCount: Int
  }

  type MediaCollaborator {
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    
    code: String
    name: String
    phone: String
    customerId: ID
    memberId: ID

    customer: Customer
    member: Member
    total:Float
    allProductMediaStats: ProductMediaStats
  }

  type MediaCollaboratorPageData {
    data: [MediaCollaborator]
    total: Int
    pagination: Pagination
  }

  type MediaProduct {
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    
    "Mã cộng tác viên"
    collaboratorId: ID
    "Mã sản phẩm"
    productId: ID
    "Mã giới thiệu"
    shortCode: String
    "Link giới thiệu"
    shortUrl: String
    "Số lượng click"
    clickCount: Int
    "Số lượng like"
    likeCount: Int
    "Số lượng share"
    shareCount: Int
    "Số lượng comment"
    commentCount: Int

    collaborator: Collaborator
    product: Product
    mediaProductStats: MediaProductStats
  }

  type MediaProductPageData {
    data: [MediaProduct]
    total: Int
    pagination: Pagination
  }

`;

export default schema;
