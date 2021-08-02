import { BaseModel, CrudRepository } from "./crud.repo";

interface Branch extends BaseModel {
  name: string;
}

interface Position extends BaseModel {
  name: string;
}

interface SubscriberInfo {
  id: string;
  psid: string;
  name: string;
  firstName: string;
  lastName: string;
  gender: string;
  locale: string;
  profilePic: string;
}

export interface Member extends BaseModel {
  code: string;
  username: string;
  uid: string;
  name: string;
  avatar: string;
  phone: string;
  fanpageId: string;
  fanpageName: string;
  fanpageImage: string;
  shopName: string;
  shopLogo: string;
  shopCover: string;
  cumulativePoint: number;
  diligencePoint: number;
  commission: number;
  address: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  province: string;
  district: string;
  ward: string;
  identityCardNumber: string;
  gender: string;
  birthday: string;
  parentIds: string[];
  activedAt: string;
  activated: boolean;
  type: string;
  branchId: string;
  positionId: string;
  psids: string[];
  chatbotStory: {
    pageId: string;
    storyId: string;
    name: string;
    isStarted: boolean;
    isUseRef: boolean;
    ref: string;
    message: string;
    btnTitle: string;
    type: string;
    image: string;
  }[];
  allowSale: boolean;
  branch: Branch;
  position: Position;
  parents: Member[];
  subscribers: SubscriberInfo[];
  chatbotRef: string;
  shopUrl: string;
  ordersCount: number;
  toMemberOrdersCount: number;
  deliveryDistricts: string[];
}
export class MemberRepository extends CrudRepository<Member> {
  apiName: string = "Member";
  displayName: string = "cửa hàng";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    username: String
    uid: String
    name: String
    avatar: String
    phone: String
    fanpageId: String
    fanpageName: String
    fanpageImage: String
    shopName: String
    shopLogo: String
    activated: Boolean
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    username: String
    uid: String
    name: String
    avatar: String
    phone: String
    fanpageId: String
    fanpageName: String
    fanpageImage: String
    shopName: String
    shopLogo: String
    shopCover: String
    cumulativePoint: Float
    diligencePoint: Float
    commission: Float
    address: String
    provinceId: String
    districtId: String
    wardId: String
    province: String
    district: String
    ward: String
    identityCardNumber: String
    gender: String
    birthday: DateTime
    parentIds: [ID]
    activedAt: DateTime
    activated: Boolean
    type: String
    branchId: ID
    positionId: ID
    psids: [String]
    allowSale: Boolean
    shopUrl: String
    ordersCount: Int
    toMemberOrdersCount: Int
    deliveryDistricts: [String]
  `);

  async updateMemberPassword(id: string, password: string) {
    return await this.apollo.mutate({
      mutation: this.gql`
        mutation {
          updateMemberPassword(memberId: "${id}", password: "${password}") {
            id
          }
        }
      `,
    });
  }
}

export const MemberService = new MemberRepository();
