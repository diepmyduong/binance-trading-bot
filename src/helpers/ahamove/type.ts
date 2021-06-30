export type AhamoveConfig = {
  apiKey?: string;
  devMode?: boolean;
};
export type RegisUserAccountProps = {
  mobile: string;
  name: string;
  address: string;
  lat?: string;
  lng?: string;
  email?: string;
  parent_id?: string;
  country_code?: string;
};

export type AddChildAccountProps = {
  token: string;
  childId: string;
};
export type ActiveChildAccountProps = {
  token: string;
  child_id: string;
  activation_code: string;
};
export type RemoveChildAccountProps = {
  token: string;
  child_id: string;
};
type Category = {
  code: string;
  child_code: string[];
};
export type UpdateProfileProps = {
  token: string;
  name?: string;
  email?: string;
  user_type?: "Individual" | "SMEs" | "Corporation";
  categories?: Category[];
};
export type Path = {
  address: string;
  short_address?: string;
  lat?: number;
  lng?: number;
  name?: string;
  mobile?: string;
  tracking_number?: string;
  remarks?: string;
  cod?: number;
  status?: "COMPLETED" | "FAILED";
  building?: string;
  apt_number?: string;
};
export type Order = {
  id: string;
  status: string;
  service_id: string;
  city_id: string;
  user_id: string;
  user_name: string;
  partner: string;
  supplier_id: string;
  supplier_name: string;
  path: Path[];
  create_time: number;
  order_time: number;
  accept_time: number;
  board_time: number;
  pickup_time: number;
  cancel_time: number;
  complete_time: number;
  currency: string;
  promo_code: string;
  payment_method: "BALANCE" | "CASH";
  stop_fee: number;
  request_fee: number;
  distance_fee: number;
  discount: number;
  total_fee: number;
  user_bonus_account: number;
  user_main_account: number;
  total_pay: number;
  distance_price: number;
  special_request_price: number;
  stoppoint_price: number;
  voucher_discount: number;
  subtotal_price: number;
  total_price: number;
};
export type OrderItem = {
  _id: string;
  num: number;
  name: string;
  price: number;
};
export type CreateOrderProps = {
  token: string;
  order_time: number;
  path: Path[];
  service_id: string;
  requests: any[];
  payment_method: "BALANCE" | "CASH";
  images?: string[];
  promo_code?: string;
  remarks?: any;
  idle_until?: number;
  items?: OrderItem[];
  type?: string;
  need_optimize_route?: boolean;
};
export type FetchOrderProps = {
  token: string;
  status?: string;
  count?: number;
  offset?: number;
  from_time?: number;
  to_time?: number;
  child_ids?: string[];
  fields?: string;
  total?: boolean;
};
export type NotifyOrderProps = {
  token: string;
  order_ids: string;
  supplier_id: number;
  noti_timeout?: number;
  allow_busy?: boolean;
  trip_distance?: number;
  sound?: boolean;
  max_cod?: number;
};
