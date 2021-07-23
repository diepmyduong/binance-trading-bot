import { createContext, useContext, useEffect, useState } from "react";
import { UserService } from "../../../../lib/repo/user.repo";
import {
  Customer,
  CustomerService,
  CustomeUpdateMeInput,
} from "../../../../lib/repo/customer.repo";
import cloneDeep from "lodash/cloneDeep";
import { useToast } from "../../../../lib/providers/toast-provider";
import { useShopContext } from "../../../../lib/providers/shop-provider";
export const CustomerContext = createContext<
  Partial<{
    customer: Customer;
    customerUpdateMe: (data: CustomeUpdateMeInput) => Promise<any>;
    setCustomer: Function;
    addressData: {
      fullAddress: string;
      lat: number;
      lg: number;
    };
    setAddressData: Function;
  }>
>({});

export function CustomerProvider(props) {
  const [customer, setCustomer] = useState<Customer>();
  const { setCustomer: setShopCustomer } = useShopContext();
  const [addressData, setAddressData] = useState<{
    fullAddress: string;
    lat: number;
    lg: number;
  }>();
  async function getCustomner() {
    let res = await CustomerService.getCustomer();
    setCustomer(res);
  }
  const toast = useToast();
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
        toast.success("Thay đổi thông tin thành công");
        return res.data.g0;
      })
      .catch((err) => {
        toast.error("Đã xảy ra lỗi");
        throw err;
      });
  };
  useEffect(() => {
    getCustomner();
  }, []);
  useEffect(() => {
    if (customer) {
      setShopCustomer(customer);
    }
  }, [customer]);
  return (
    <CustomerContext.Provider value={{ customer, customerUpdateMe, setCustomer }}>
      {props.children}
    </CustomerContext.Provider>
  );
}

export const useCustomerContext = () => useContext(CustomerContext);
