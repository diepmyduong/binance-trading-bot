import { BaseModel, CrudRepository } from "./crud.repo";
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
}
export const CollaboratorService = new CollaboratorRepository();
