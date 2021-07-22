import { createContext, useContext, useEffect, useState } from "react";
import { UserService } from "../../../../lib/repo/user.repo";
import {
  Customer,
  CustomerService,
  CustomeUpdateMeInput,
} from "../../../../lib/repo/customer.repo";
import cloneDeep from "lodash/cloneDeep";
export const CustomerContext = createContext<
  Partial<{
    customer: Customer;
    customerUpdateMe: (data: CustomeUpdateMeInput) => Promise<any>;
    setCustomer: Function;
  }>
>({});

export function CustomerProvider(props) {
  const [customer, setCustomer] = useState<Customer>();
  async function getCustomner() {
    let res = await CustomerService.getCustomer();
    console.log(res);
    setCustomer(cloneDeep(res));
  }
  const customerUpdateMe = async (data: CustomeUpdateMeInput) => {
    return CustomerService.mutate({
      mutation: `
        customerUpdateMe(data: $data) {
          ${CustomerService.fullFragment}
        }
      `,
      variablesParams: `($data: CustomeUpdateMeInput!)`,
      options: {
        variables: {
          data,
        },
      },
    })
      .then((res) => {
        setCustomer(res.data.g0);
        return res.data.g0;
      })
      .catch((err) => {
        throw err;
      });
  };
  useEffect(() => {
    getCustomner();
  }, []);

  return (
    <CustomerContext.Provider value={{ customer, customerUpdateMe, setCustomer }}>
      {props.children}
    </CustomerContext.Provider>
  );
}

export const useCustomerContext = () => useContext(CustomerContext);
export const CustomerConsumer = ({
  children,
}: {
  children: (
    props: Partial<{
      customer: Customer;
      customerUpdateMe: (data: CustomeUpdateMeInput) => Promise<any>;
      setCustomer: Function;
    }>
  ) => any;
}) => {
  return <CustomerContext.Consumer>{children}</CustomerContext.Consumer>;
};
