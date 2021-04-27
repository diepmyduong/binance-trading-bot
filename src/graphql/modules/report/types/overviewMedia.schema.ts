import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query{
    getCollaboratorsMediaReports(q: QueryGetListInput): MediaCollaboratorPageData
    getProductsMediaReports(q: QueryGetListInput): MediaProductPageData

    getOverviewAllCollaboratorProducts(fromDate: String, toDate: String): OverviewMediaProductStats
    getOverviewAllCollaborators(fromDate: String, toDate: String): OverviewMediaCollaboratorStats
    getTopMediaCollaborators(fromDate: String, toDate: String, sellerIds: [ID], branchId: ID, collaboratorId: ID): MediaCollaborators
    getTopMediaCollaboratorProducts(fromDate: String, toDate: String,sellerIds: [ID], branchId: ID, collaboratorId: ID): MediaCollaboratorProducts
    # Add Query
  }

  type MediaCollaborators{
    mostLikeCollaborators: [MediaStats]
    mostShareCollaborators: [MediaStats]
    mostCommentCollaborators: [MediaStats]
    mostViewCollaborators: [MediaStats]
  }

  type MediaCollaboratorProducts{
    mostLikeProducts: [MediaStats]
    mostShareProducts: [MediaStats]
    mostCommentProducts: [MediaStats]
    mostViewProducts: [MediaStats]
  }

  type MediaStats{
    shortUrl: String
    count: String
  }

  type OverviewMediaProductStats{
    shareCount: Int
    likeCount: Int
    commentCount: Int
    completedQty: Int
  }

  type OverviewMediaCollaboratorStats{
    shareCount: Int
    likeCount: Int
    commentCount: Int
    collaboratorCount: Int
  }

  type MediaProductsStats{
    "Số lần SP trong đơn chưa đặt"
    unCompletedProductsCount: Int
    "Tổng lượng SP chưa đặt"
    unCompletedProductsQty: Int
    "Số lần SP trong đơn thành công"
    completedProductsCount: Int
    "Tổng lượng SP chưa đặt"
    completedProductsQty: Int
  }

  type MediaProductStats{
    "Số lượng SP chưa đặt"
    unCompletedQty: Int
    "Số lượng SP thành công"
    completedQty: Int
  }

  type MediaCollaboratorStats{
    "Tổng lượt xem SP"
    productsViewCount: Int
    "Tổng lượt like SP"
    productsLikeCount: Int
    "Tổng lượt share SP"
    productsShareCount: Int
    "Tổng lượt comment SP"
    productsCommentCount: Int
    "Tổng link SP"
    productLinksCount: Int
  }

  type MediaCollaborator {
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    
    code: String
    name: String
    phone: String

    "Link giới thiệu"
    shortUrl: String
    clickCount: Int
    likeCount: Int
    shareCount: Int
    commentCount: Int

    customerId: ID
    memberId: ID

    customer: Customer
    member: Member
    total:Float
    mediaCollaboratorStats: MediaCollaboratorStats

    allMediaProductsStats(fromDate: String, toDate: String): MediaProductsStats
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
    mediaProductStats(fromDate: String, toDate: String): MediaProductStats
  }

  type MediaProductPageData {
    data: [MediaProduct]
    total: Int
    pagination: Pagination
  }

`;

export default schema;
