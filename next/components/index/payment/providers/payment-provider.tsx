import { createContext, useContext, useEffect, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { useRouter } from "next/router";
import {
  OrderInput,
  OrderItemToppingInput,
  Order,
  OrderItemInput,
} from "../../../../lib/repo/order.repo";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { useCartContext } from "../../../../lib/providers/cart-provider";
import { OrderService } from "../../../../lib/repo/order.repo";
import { ShopVoucher, ShopVoucherService } from "../../../../lib/repo/shop-voucher.repo";

export const PaymentContext = createContext<
  Partial<{
    draftOrder?: any;
    orderInput?: OrderInput;
    setOrderInput?: (val: OrderInput) => any;
    inforBuyers: any;
    setInforBuyers: any;
    resetOrderInput: Function;
    generateOrder: () => any;
    generateDraftOrder: Function;
    vouchers: ShopVoucher[];
    orderCode: string;
  }>
>({});
export function PaymentProvider(props) {
  const [draftOrder, setDraftOrder] = useState<{
    invalid: boolean;
    invalidReason: string;
    order: Order;
  }>({
    invalid: true,
    invalidReason: "",
    order: null,
  });

  const [vouchers, setVouchers] = useState<ShopVoucher[]>();
  const { branchSelecting, customer, locationCustomer, shopCode } = useShopContext();
  const { cartProducts } = useCartContext();
  const [orderInput, setOrderInput] = useState<OrderInput>();
  const [orderCode, setOrderCode] = useState("");
  const resetOrderInput = () => {
    setOrderInput({
      ...orderInput,
      pickupMethod: "DELIVERY",
      pickupTime: null,
      buyerAddress: "",
      buyerProvinceId: "70",
      buyerDistrictId: "",
      buyerWardId: "",
      note: "",
      paymentMethod: "COD",
    });
  };
  const router = useRouter();
  const toast = useToast();
  const getItemsOrderInput = () => {
    let itemProduct: OrderItemInput[] = [];
    cartProducts.forEach((cartProduct) => {
      let OrderItem: OrderItemInput = {
        productId: cartProduct.productId,
        quantity: cartProduct.qty,
        note: cartProduct.note,
        toppings: cartProduct.product.selectedToppings,
      };
      itemProduct.push(OrderItem);
    });
    return itemProduct;
  };
  // useEffect(() => {
  //   if (branchSelecting) setOrderInput({ ...orderInput, shopBranchId: branchSelecting.id });
  // }, [branchSelecting]);
  // useEffect(() => {
  //   if (locationCustomer)
  //     setOrderInput({
  //       ...orderInput,
  //       longitude: locationCustomer.longitude,
  //       latitude: locationCustomer.latitude,
  //     });
  // }, [locationCustomer]);
  // useEffect(() => {
  //   if (customer) {
  //     setOrderInput({ ...orderInput, buyerPhone: customer });
  //   }
  // }, [customer]);

  ///Checkout
  const generateDraftOrder = () => {
    let items = getItemsOrderInput();
    OrderService.generateDraftOrder({ ...orderInput, items: items })
      .then((res: any) => {
        setDraftOrder(cloneDeep(res));
        console.log(res);
        if (res.invalid && items.length > 0) {
          toast.error(res.invalidReason);
        }
      })
      .catch((err) => {});
  };

  const generateOrder = () => {
    if (!draftOrder.invalid) {
      let items = getItemsOrderInput();
      return OrderService.generateOrder({ ...orderInput, items: items })
        .then((res) => {
          toast.success("Đặt hàng thành công");
          localStorage.removeItem("cartProducts");
          resetOrderInput();
          setOrderInput(null);
          setOrderCode(res.code);
        })
        .catch((err) => toast.error("Đặt hàng thất bại"));
    }
  };
  useEffect(() => {
    generateDraftOrder();
  }, [orderInput]);

  useEffect(() => {
    if (cartProducts && cartProducts.length == 0) {
      router.replace(`/${shopCode}`);
    }
    let branid = "";
    if (branchSelecting) {
      branid = branchSelecting.id;
    }
    let lg = 0;
    let lt = 0;
    if (locationCustomer) {
      lg = locationCustomer.longitude;
      lt = locationCustomer.latitude;
    }
    setOrderInput({
      buyerName: "",
      buyerPhone: customer,
      pickupMethod: "DELIVERY",
      shopBranchId: branid,
      pickupTime: null,
      buyerAddress: "",
      buyerProvinceId: "70",
      buyerDistrictId: "",
      buyerWardId: "",
      buyerFullAddress: "",
      buyerAddressNote: "",
      latitude: lg,
      longitude: lt,
      paymentMethod: "COD",
      note: "",
      promotionCode: "",
    });
    ShopVoucherService.getAll({
      query: { order: { createdAt: -1 }, filter: { isPrivate: false, isActive: true } },
      fragment: ShopVoucherService.fullFragment,
    })
      .then((res) => setVouchers(cloneDeep(res.data)))
      .catch((err) => setVouchers(null));
  }, []);
  return (
    <PaymentContext.Provider
      value={{
        draftOrder: draftOrder,
        orderInput,
        resetOrderInput,
        setOrderInput,
        generateOrder,
        generateDraftOrder,
        vouchers,
        orderCode,
      }}
    >
      {props.children}
    </PaymentContext.Provider>
  );
}

export const usePaymentContext = () => useContext(PaymentContext);
