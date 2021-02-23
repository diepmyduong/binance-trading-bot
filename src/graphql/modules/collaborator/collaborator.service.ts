import { CrudService } from "../../../base/crudService";
import { CollaboratorModel } from "./collaborator.model";
class CollaboratorService extends CrudService<typeof CollaboratorModel> {
  constructor() {
    super(CollaboratorModel);
  }
}

const collaboratorService = new CollaboratorService();

export { collaboratorService };
