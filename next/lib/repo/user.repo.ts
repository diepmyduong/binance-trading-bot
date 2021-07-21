import { BaseModel, CrudRepository } from "./crud.repo";
import { Customer, CustomerService } from "./customer.repo";

export interface User extends BaseModel {
  uid: string;
  code: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  birthday: string;
  gender: string;
  role: string;
  scopes: string[];
  address: string;
  province: string;
  district: string;
  ward: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  profilePicture: string;
  loginedAt: string;
}
export class UserRepository extends CrudRepository<User> {
  apiName: string = "User";
  displayName: string = "tài khoản";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    username: String
    name: String
    email: String
    phone: String
    position: String
    gender: String
    scopes: [String]
    profilePicture: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    uid: String
    code: String
    username: String
    name: String
    email: String
    phone: String
    position: String
    birthday: DateTime
    gender: String
    scopes: [String]
    address: String
    provinceId: String
    districtId: String
    wardId: String
    profilePicture: String
  `);

  // for firebase
  async loginUserByToken(token): Promise<{ user: User; token: string }> {
    return await this.apollo
      .mutate({
        mutation: this
          .gql`mutation {  loginUserByToken(idToken: "${token}") { user { ${this.fullFragment} } token }}`,
      })
      .then((res) => res.data["loginUserByToken"]);
  }

  // fore server username
  async userGetMe() {
    return await this.apollo
      .query({
        query: this.gql`query {  userGetMe { ${this.fullFragment} }}`,
      })
      .then((res) => res.data["userGetMe"] as User);
  }

  // for firebase
  async loginCustomerByPhone(phone): Promise<{ customer: Customer; token: string }> {
    return await this.apollo
      .mutate({
        mutation: this.gql`mutation {  loginCustomerByPhone(phone: "${phone}") {
          token
          customer{
            ${CustomerService.fullFragment}
          }
        }}`,
      })
      .then((res) => ({
        customer: res.data["loginCustomerByPhone"]["customer"] as Customer,
        token: res.data["loginCustomerByPhone"]["token"] as string,
      }));
  }

  async updateUserPassword(id: string, password: string) {
    return await this.apollo.mutate({
      mutation: this.gql`
        mutation {
          updateUserPassword(id: "${id}", password: "${password}") {
            id
          }
        }
      `,
    });
  }

  async loginWithUsernamePassword(username: string, password: string) {
    return await this.apollo
      .mutate({
        mutation: this.gql`
        mutation {
            loginWithUsernamePassowrd(
                username: "${username}",
                password: "${password}"
            ) {
                user { ${this.fullFragment} }
                token
            }
        }
      `,
      })
      .then((res) => ({
        user: res.data["loginWithUsernamePassowrd"]["user"] as User,
        token: res.data["loginWithUsernamePassowrd"]["token"] as string,
      }));
  }

  async activeUser(userId: string) {
    return await this.apollo
      .mutate({
        mutation: this.gql`mutation { activeUser(userId: "${userId}") { ${this.fullFragment}}}`,
      })
      .then((res) => res.data["activeUser"] as User);
  }

  async blockUser(userId: string) {
    return await this.apollo
      .mutate({
        mutation: this.gql`mutation { blockUser(userId: "${userId}") { ${this.fullFragment}}}`,
      })
      .then((res) => res.data["blockUser"] as User);
  }
}

export const UserService = new UserRepository();

export const USER_ROLES: Option[] = [
  { value: "ADMIN", label: "Quản trị", color: "primary" },
  { value: "USER", label: "Người dùng", color: "accent" },
];
export const USER_STATUS: Option[] = [
  { value: "ACTIVE", label: "Đã kích hoạt", color: "success" },
  { value: "INACTIVE", label: "Chưa kích hoạt", color: "bluegray" },
  { value: "BLOCKED", label: "Đã bị khóa", color: "warning" },
];
