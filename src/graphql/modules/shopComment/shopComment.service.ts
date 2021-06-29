import { CrudService } from "../../../base/crudService";
import { ShopCommentModel } from "./shopComment.model";
class ShopCommentService extends CrudService<typeof ShopCommentModel> {
  constructor() {
    super(ShopCommentModel);
  }
}

const shopCommentService = new ShopCommentService();

export { shopCommentService };
