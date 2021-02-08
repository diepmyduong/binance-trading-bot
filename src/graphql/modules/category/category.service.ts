import { CrudService } from "../../../base/crudService";
import { CategoryModel } from "./category.model";
class CategoryService extends CrudService<typeof CategoryModel> {
  constructor() {
    super(CategoryModel);
  }
}

const categoryService = new CategoryService();

export { categoryService };
