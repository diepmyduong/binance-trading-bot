import { BaseModel, CrudRepository } from "./crud.repo";
import { Order } from "./order.repo";

export interface Driver extends BaseModel {
  memberId: string;
  name: string;
  phone: string;
  avatar: string;
  licensePlates: string;
  status: string;
  orderIds: string[];
  orders: Order[];
  orderStats: DriverOrderStats;
}
export interface DriverOrderStats {
  shipfee: number;
  total: number;
  completed: number;
  failure: number;
}
export class DriverRepository extends CrudRepository<Driver> {
  apiName: string = "Driver";
  displayName: string = "tài xế";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    name: String
    phone: String
    avatar: String
    licensePlates: String
    status: string
    orderStats {
      shipfee: number
      total: number
      completed: number
      failure: number
    }: DriverOrderStats
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    name: String
    phone: String
    avatar: String
    licensePlates: String
    status: string
    orderStats {
      shipfee: number
      total: number
      completed: number
      failure: number
    }: DriverOrderStats
  `);
}

export const DriverService = new DriverRepository();

export const DRIVER_STATUS: Option[] = [
  { value: "ONLINE", label: "Online", color: "success" },
  { value: "OFFLINE", label: "Offline", color: "bluegray" },
  { value: "ACCEPTED", label: "Nhận hàng", color: "orange" },
  { value: "DELIVERING", label: "Giao hàng", color: "purple" },
];
