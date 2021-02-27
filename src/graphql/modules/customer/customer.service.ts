import { CrudService } from "../../../base/crudService";
import { CustomerModel } from "./customer.model";
class CustomerService extends CrudService<typeof CustomerModel> {
  constructor() {
    super(CustomerModel);
  }

  increasePoint({ customerId, currentCumulativePoint, cumulativePoint }: any) {

    // tự cộng dồn hoa hồng
    let updateField: any = {
      $set: {
        cumulativePoint
      }
    };

    // nếu hoa hồng trong member null => set vào
    if (currentCumulativePoint) {
      updateField = {
        $inc: { cumulativePoint }
      };
    }

    // cập nhật số dư hoa hồng trong member
    return CustomerModel.findOneAndUpdate(
      { _id: customerId },
      updateField,
      {
        new: true
      }
    );
  }
  increaseCommissions({ customerId, currentCommission, commission }: any) {
    // tự cộng dồn hoa hồng
    let updateField: any = {
      $set: {
        commission,
      },
    };

    // nếu hoa hồng trong member null => set vào
    if (currentCommission) {
      updateField = {
        $inc: { commission },
      };
    }

    // cập nhật số dư hoa hồng trong member
    return CustomerModel.findOneAndUpdate({ _id: customerId }, updateField, {
      new: true,
    });
  }
}

const customerService = new CustomerService();

export { customerService };
