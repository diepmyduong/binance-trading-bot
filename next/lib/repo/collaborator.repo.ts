import { BaseModel, CrudRepository, QueryInput } from "./crud.repo";
import { Member } from "./member.repo";
import { Customer } from "./customer.repo";

export interface Collaborator extends BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  name: string;
  phone: string;
  memberId: string;
  customerId: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  engagementCount: number;
  status: string;
  member: Member;
  customer: Customer;
}
export interface InvitedCustomer extends BaseModel {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  ordered: boolean;
  commission: number;
}
export class CollaboratorRepository extends CrudRepository<Collaborator> {
  apiName: string = "Collaborator";
  displayName: string = "Collaborator";
  shortFragment: string = this.parseFragment(`
  code: string
  name: string
  phone: string
  customerId: string
  shortCode: string
  shortUrl: string
  `);
  fullFragment: string = this.parseFragment(`
  id: string
  createdAt: string
  updatedAt: string
  code: string
  name: string
  phone: string
  memberId: string
  customerId: string
  shortCode: string
  shortUrl: string
  clickCount: number
  likeCount: number
  shareCount: number
  commentCount: number
  engagementCount: number
  status: string
  }`);
  async regisCollaborator(): Promise<{}> {
    return await this.apollo
      .mutate({
        mutation: this.gql`mutation{
          regisCollaborator{
           code
          }
        }`,
      })
      .then((res) => res);
  }
  async getAllInvitedCustomers(
    customerId: string,
    query?: QueryInput
  ): Promise<{ data: InvitedCustomer[] }> {
    return await this.apollo
      .query({
        query: this.gql`query{
          getAllInvitedCustomers(customerId:"${customerId}" ${query ? `q:"${query}"` : ""}){
            data{
              id
              name
              avatar
              phone
              ordered
              commission
            }
          }
        }`,
      })
      .then((res) => res.data["getAllInvitedCustomers"]);
  }
}
export const CollaboratorService = new CollaboratorRepository();
