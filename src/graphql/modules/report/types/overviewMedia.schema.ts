import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getCollaboratorsMediaReports(q: QueryGetListInput): CollaboratorPageData
    getProductsMediaReports(q: QueryGetListInput): CollaboratorProductPageData
    # Add Query
  }

  type MediaProductsStats {
    "Số lần SP trong đơn chưa đặt"
    unCompletedProductsCount: Int
    "Tổng lượng SP chưa đặt"
    unCompletedProductsQty: Int
    "Số lần SP trong đơn thành công"
    completedProductsCount: Int
    "Tổng lượng SP chưa đặt"
    completedProductsQty: Int
  }

  type MediaProductStats {
    "Số lượng SP chưa đặt"
    unCompletedQty: Int
    "Số lượng SP thành công"
    completedQty: Int
  }

  type MediaCollaboratorStats {
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
`;

export default schema;
