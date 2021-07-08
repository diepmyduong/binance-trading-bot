import { BaseModel, CrudRepository } from "./crud.repo";

export interface Driver extends BaseModel {
  memberId: string;
  name: string;
  phone: string;
  avatar: string;
  licensePlates: string;
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
  `);
}

export const DriverService = new DriverRepository();
