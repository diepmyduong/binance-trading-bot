import { createContext, useContext, useEffect, useState } from "react";
import { UserService } from "../../../../lib/repo/user.repo";
import cloneDeep from "lodash/cloneDeep";
import { useToast } from "../../../../lib/providers/toast-provider";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import {
  Collaborator,
  CollaboratorService,
  InvitedCustomer,
} from "../../../../lib/repo/collaborator.repo";
import { CommissionLog, CommissionLogService } from "../../../../lib/repo/commission.repo";
import { Customer, CustomerService } from "../../../../lib/repo/customer.repo";
export const CollaboratorContext = createContext<
  Partial<{
    colabrator: Customer;
    commissions: CommissionLog[];
    customersInvited: InvitedCustomer[];
  }>
>({});

export function CollaboratorProvider(props) {
  const { customer, setCustomer } = useShopContext();
  const [colabrator, setColabrator] = useState<Customer>(null);
  let [commissions, setCommissions] = useState<CommissionLog[]>();
  let [customersInvited, setCustomersInvited] = useState<InvitedCustomer[]>();
  async function getCommissions() {
    CommissionLogService.getAll({ query: { order: { createdAt: -1 } }, cache: false })
      .then((res) => setCommissions(res.data))
      .catch((err) => console.log(err));
  }
  async function getAllCustomerInvited() {
    if (customer && customer.id) {
      CollaboratorService.getAllInvitedCustomers(customer.id)
        .then((res) => setCustomersInvited(res.data))
        .catch((err) => console.log(err));
    }
  }
  useEffect(() => {
    CustomerService.getCustomer()
      .then((res) => {
        console.log(res);
        setColabrator(res);
      })
      .catch((err) => console.log(err));
    getCommissions();
    getAllCustomerInvited();
  }, []);
  return (
    <CollaboratorContext.Provider value={{ commissions, customersInvited, colabrator }}>
      {props.children}
    </CollaboratorContext.Provider>
  );
}

export const useCollaboratorContext = () => useContext(CollaboratorContext);
