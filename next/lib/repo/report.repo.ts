import { BaseModel, CrudRepository } from "./crud.repo";
import { Setting } from "./setting.repo";

export class ReportRepository extends CrudRepository<any> {
  apiName: string = "Report";
  displayName: string = "nhóm cấu hình";
  shortFragment: string = this.parseFragment(`
   
  `);
  fullFragment: string = this.parseFragment(`
    
  `);

  async reportShopProduct(fromDate: string, toDate: string) {
    return await this.apollo
      .query({
        query: this
          .gql`query {  reportShopProduct(filter:{fromDate:"${fromDate}", toDate: "${toDate}"})
           { 
             top10{ productId qty productName}
            }}`,
      })
      .then((res) => res.data["reportShopProduct"]);
  }

  async reportShopOrder(fromDate: string, toDate: string, shopBrandId?: string) {
    return await this.apollo
      .query({
        query: this
          .gql`query {  reportShopOrder(filter:{fromDate:"${fromDate}", toDate: "${toDate}"})
           { 
             pending confirmed delivering completed canceled failure total pendingRevenue revenue
            }}`,
      })
      .then((res) => res.data["reportShopOrder"]);
  }

  async reportShopOrderKline(fromDate: string, toDate: string, shopBrandId?: string) {
    return await this.apollo
      .query({
        query: this
          .gql`query {  reportShopOrderKline(filter:{fromDate:"${fromDate}", toDate: "${toDate}"})
           { 
             label datasets{label data}
            }}`,
      })
      .then((res) => res.data["reportShopOrder"]);
  }

  async reportShopCustomer() {
    return await this.apollo
      .query({
        query: this.gql`query {  reportShopCustomer {total}}`,
      })
      .then((res) => res.data["reportShopCustomer"]);
  }
}

export const ReportService = new ReportRepository();
