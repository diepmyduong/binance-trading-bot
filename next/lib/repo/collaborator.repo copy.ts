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
  commissionStats: CollaboratorCommissionStats;
  orderStats: CollaboratorOrderStats;
}
interface CollaboratorCommissionStats {
  commission: number;
}
interface CollaboratorOrderStats {
  completeOrder: number;
  uncompleteOrder: number;
  completeProductQty: number;
  uncompleteProductQty: number;
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
  displayName: string = "cộng tác viên";
  shortFragment: string = this.parseFragment(`
    id: string
    createdAt: string
    updatedAt: string
    code: string
    name: string
    phone: string
    customerId: string
    shortCode: string
    shortUrl: string
    clickCount: number
    likeCount: number
    shareCount: number
    commentCount: number
    engagementCount: number
    status: string
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
  `);

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

export const COLLABORATOR_STATUS: Option[] = [
  { value: "PENDING", label: "Chờ duyệt", color: "warning" },
  { value: "ACTIVE", label: "Hoạt động", color: "success" },
  { value: "BLOCKED", label: "Bị khoá", color: "danger" },
];
