import { CrudService } from "../../../base/crudService";
import { CollaboratorProductModel } from "./collaboratorProduct.model";
class CollaboratorProductService extends CrudService<typeof CollaboratorProductModel> {
  constructor() {
    super(CollaboratorProductModel);
  }
}

const collaboratorProductService = new CollaboratorProductService();

export { collaboratorProductService };
