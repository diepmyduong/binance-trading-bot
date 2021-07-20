import axios from "axios";
import { configs } from "../../configs";
import {
  ActiveChildAccountProps,
  AddChildAccountProps,
  AhamoveConfig,
  CreateOrderProps,
  FetchOrderProps,
  NotifyOrderProps,
  Order,
  RegisUserAccountProps,
  RemoveChildAccountProps,
  UpdateProfileProps,
} from "./type";

const host = "https://api.ahamove.com";
const hostDev = "https://apistg.ahamove.com";

const statusText = {
  IDLE: "Đã tạo đơn",
  ASSIGNING: "Đang tìm tài xế",
  ACCEPTED: "Tài xế đang lấy món",
  "IN PROCESS": "Món đang được giao",
  COMPLETED: "Món đã được giao",
  CANCELLED: "Đơn hàng đã huỷ",
  RETURNED: "",
};

export class Ahamove {
  public static StatusText = statusText;
  constructor(public config: AhamoveConfig) {}
  get host() {
    return configs.debug ? hostDev : host;
  }
  get apiKey() {
    return configs.ahamove.apiKey;
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
      // console.log("error", err);
      if (err.response && err.response.data) {
        throw Error(err.response.data.description || err.response.data.title);
      } else throw err;
    };
  }

  async createOrder(data: CreateOrderProps) {
    return await axios
      .get(`${this.host}/v1/order/create`, {
        params: { ...data, path: JSON.stringify(data.path), items: JSON.stringify(data.items) },
      })
      .then(
        (res) =>
          res.data as {
            order_id: string;
            status: string;
            shared_link: string;
            order: Order;
          }
      )
      .catch(this.handleException());
  }
  async estimatedFee(data: CreateOrderProps) {
    return await axios
      .get(`${this.host}/v1/order/estimated_fee`, {
        params: { ...data, path: JSON.stringify(data.path), items: JSON.stringify(data.items) },
      })
      .then((res) => res.data)
      .catch(this.handleException());
  }
  async fetchAllServices(lat: string, lng: string, city_id?: string) {
    return await axios
      .get(`${this.host}/v1/order/service_types`, {
        params: { lat, lng, city_id },
      })
      .then((res) => res.data)
      .catch(this.handleException());
  }
  async estimatedFeeMutilService(data: CreateOrderProps, services: any[]) {
    return await axios
      .post(`${this.host}/v2/order/estimated_fee`, { ...data, services })
      .then((res) => res.data)
      .catch(this.handleException());
  }
  async cancelOrder(token: string, order_id: string, comment: string) {
    return await axios
      .get(`${this.host}/v1/order/cancel`, {
        params: { token, order_id, comment },
      })
      .then((res) => res.data)
      .catch(this.handleException());
  }
  async fetchAllOrder(props: FetchOrderProps) {
    return await axios
      .get(`${this.host}/v1/order/list`, {
        params: props,
      })
      .then((res) => res.data as Order[])
      .catch(this.handleException());
  }
  async fetchOrder(token: string, order_id: string) {
    return await axios
      .get(`${this.host}/v1/order/detail`, {
        params: { token, order_id },
      })
      .then((res) => res.data as Order)
      .catch(this.handleException());
  }
  async fetchCity(city_id: string, lat?: number, lng?: number) {
    return await axios
      .get(`${this.host}/v1/order/city_detail`, {
        params: { city_id, lat, lng },
      })
      .then(
        (res) =>
          res.data as {
            _id: string;
            name: string;
            name_vi_vn: string;
            country_id: string;
            location: {
              type: string;
              coordinates: number[];
            };
          }
      )
      .catch(this.handleException());
  }
  async getTrackingLink(token: string, order_id: string) {
    return await axios
      .get(`${this.host}/v1/order/shared_link`, {
        params: { token, order_id },
      })
      .then((res) => res.data as { shared_link: string })
      .catch(this.handleException());
  }
  async rateSupplier(token: string, order_id: string, rating: number, comment?: string) {
    return await axios
      .get(`${this.host}/v1/order/rate_supplier`, {
        params: { token, order_id, rating, comment },
      })
      .then((res) => res.data as { shared_link: string })
      .catch(this.handleException());
  }
  async notifyOrder(props: NotifyOrderProps) {
    return await axios
      .get(`${this.host}/v1/order/notify_order`, {
        params: props,
      })
      .then((res) => res.data as { shared_link: string })
      .catch(this.handleException());
  }
}
