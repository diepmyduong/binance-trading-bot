import DataLoader from "dataloader";
import { get } from "lodash";
import { keyBy } from "lodash";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import { CollaboratorModel } from "../../collaborator/collaborator.model";
import { MemberModel } from "../../member/member.model";
import { CustomerModel } from "../customer.model";

export class CustomerIsCollaborator {
  static loader = new DataLoader<string, boolean>(
    async (phones: string[]) => {
      const data = await CollaboratorModel.find({
          phone: { $in: phones }
      }).then(res => keyBy(res, 'phone'));
      return phones.map((p) => !!data[p]);
    },
    { cache: false } // Bỏ cache
  );
}
