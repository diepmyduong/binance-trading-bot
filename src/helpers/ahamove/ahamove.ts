import axios from "axios";
import {
  ActiveChildAccountProps,
  AddChildAccountProps,
  AhamoveConfig,
  CreateOrderProps,
  RegisUserAccountProps,
  RemoveChildAccountProps,
  UpdateProfileProps,
} from "./type";

const host = "https://api.ahamove.com";
const hostDev = "https://apistg.ahamove.com";
const apiKeyDev = "4cd543d3e4e4fbe97db216828c18644f77558275";

export class Ahamove {
  constructor(public config: AhamoveConfig) {
    this.config = { devMode: true, apiKey: apiKeyDev, ...config };
  }
  get host() {
    return this.config.devMode ? hostDev : host;
  }
  async regisUserAccount(props: RegisUserAccountProps) {
    return await axios
      .get(`${this.host}/v1/partner/register_account`, {
        params: {
          ...props,
          api_key: this.config.apiKey,
        },
      })
      .then((res) => ({
        token: res.data.token,
        refreshToken: res.data.refresh_token,
      }))
      .catch(this.handleException());
  }
  async addChildAccount(props: AddChildAccountProps) {
    return await axios
      .get(`${this.host}/v1/partner/add_child_account`, { params: props })
      .then((res) => res.data)
      .catch(this.handleException());
  }
  async activeChildAccount(props: ActiveChildAccountProps) {
    return await axios
      .get(`${this.host}/v1/partner/activate_child_account`, { params: props })
      .then((res) => res.data)
      .catch(this.handleException());
  }
  async removeChildAccount(props: RemoveChildAccountProps) {
    return await axios
      .get(`${this.host}/v1/partner/remove_child_account`, { params: props })
      .then((res) => res.data)
      .catch(this.handleException());
  }
  async getChildAccountList(token: string) {
    return await axios
      .get(`${this.host}/v1/partner/get_child_list`, { params: { token } })
      .then((res) => res.data)
      .catch(this.handleException());
  }
  async updateProfile(props: UpdateProfileProps) {
    return await axios
      .get(`${this.host}/v1/user/update_profile`, { params: props })
      .then((res) => res.data)
      .catch(this.handleException());
  }
  private handleException(): (reason: any) => PromiseLike<never> {
    return (err) => {
      if (err.response && err.response.data) {
        throw Error(err.response.data.description);
      } else throw err;
    };
  }

  async createOrder(data: CreateOrderProps) {
    return await axios
      .get(`${this.host}/v1/order/create`, { params: data })
      .then((res) => res.data)
      .catch(this.handleException());
  }
  async estimatedFee(data: CreateOrderProps) {
    return await axios
      .get(`${this.host}/v1/order/estimated_fee`, { params: data })
      .then((res) => res.data)
      .catch(this.handleException());
  }
}
