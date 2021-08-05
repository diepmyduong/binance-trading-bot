import { createContext, useContext, useEffect, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import router, { useRouter } from "next/router";
import { OrderInput, Order, OrderItemInput } from "../../../../lib/repo/order.repo";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { useCartContext } from "../../../../lib/providers/cart-provider";
import { OrderService } from "../../../../lib/repo/order.repo";
import { ShopVoucher, ShopVoucherService } from "../../../../lib/repo/shop-voucher.repo";
import { UserService } from "../../../../lib/repo/user.repo";
import { CustomerService } from "../../../../lib/repo/customer.repo";
import useDebounce from "../../../../lib/hooks/useDebounce";

export const PaymentContext = createContext<
  Partial<{
    draftOrder?: { invalid: boolean; invalidReason: string; order: Order };
    orderInput?: OrderInput;
    setOrderInput?: (val: OrderInput) => any;
    inforBuyers: any;
    setInforBuyers: any;
    resetOrderInput: Function;
    generateOrder: () => any;
    generateDraftOrder: Function;
    vouchers: ShopVoucher[];
    orderCode: string;
    loadPrivate: (code: string) => any;
    voucherSelected: ShopVoucher;
    setVoucherSelected: (e: ShopVoucher) => any;
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
  const { branchSelecting, customer, locationCustomer, shopCode, setCustomer } = useShopContext();
  const { cartProducts, reOrderInput, clearCartProduct } = useCartContext();
  const [voucherSelected, setVoucherSelected] = useState<ShopVoucher>(null);

  let [orderInput, setOrderInput] = useState<OrderInput>({
    buyerName: "",
    buyerPhone: "",
    pickupMethod: "DELIVERY",
    shopBranchId: "",
    pickupTime: null,
    buyerFullAddress: "",
    buyerAddressNote: "",
    latitude: 0,
    longitude: 0,
    paymentMethod: "COD",
    note: "",
    promotionCode: "",
  });
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
  const generateDraftOrder = () => {
    let items = getItemsOrderInput();
    OrderService.generateDraftOrder({ ...orderInput, items: items })
      .then((res: any) => {
        setDraftOrder(cloneDeep(res));
        console.log(res);
        if (res.invalid && items.length > 0) {
          toast.dark(res.invalidReason, { position: "top-center" });
        }
      })
      .catch((err) => {});
  };

  const generateOrder = () => {
    if (!draftOrder.invalid) {
      let items = getItemsOrderInput();
      return OrderService.generateOrder({ ...orderInput, items: items })
        .then((res) => {
          localStorage.removeItem(shopCode + "cartProducts");
          // router.push(`${shopCode}/order/${res.code}/success`);
          setOrderCode(res.code);
        })
        .catch((err) => toast.error("Đặt hàng thất bại"));
    }
  };
  useEffect(() => {
    if (orderCode) {
      CustomerService.getCustomer().then((res) => setCustomer(cloneDeep(res)));
    }
  }, [orderCode]);
  useEffect(() => {
    if (reOrderInput) {
      console.log(reOrderInput);
      setOrderInput(cloneDeep(reOrderInput));
    }
  }, [reOrderInput]);
  let debounceInput = useDebounce(orderInput, 600);
  useEffect(() => {
    if (debounceInput && debounceInput.shopBranchId) {
      console.log("generate draft order");
      generateDraftOrder();
    }
  }, [debounceInput]);
  useEffect(() => {
    if (branchSelecting) {
      orderInput = { ...orderInput, shopBranchId: branchSelecting.id };
      setOrderInput(orderInput);
    }
  }, [branchSelecting]);
  useEffect(() => {
    if (!customer) return;
    orderInput = {
      ...orderInput,
      buyerName: customer.name || "",
      buyerPhone: customer.phone,
      buyerFullAddress: locationCustomer.fullAddress || customer.fullAddress || "",
      buyerAddressNote: customer.addressNote || "",
      latitude: locationCustomer.lat || customer.latitude,
      longitude: locationCustomer.lg || customer.longitude,
    };
    setOrderInput(orderInput);
  }, [customer]);
  function loadVoucher() {
    ShopVoucherService.getAll({
      query: { order: { createdAt: -1 }, filter: { isPrivate: false, isActive: true } },
      fragment: ShopVoucherService.fullFragment,
    })
      .then((res) => setVouchers(cloneDeep(res.data)))
      .catch((err) => setVouchers(null));
  }
  function loadPrivate(code) {
    ShopVoucherService.getShopVoucherByCode(code)
      .then((res) => setVoucherSelected(res))
      .catch((err) => toast.dark("Đã xảy ra lỗi"));
  }
  useEffect(() => {
    loadVoucher();
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
        loadPrivate,
        voucherSelected,
        setVoucherSelected,
      }}
    >
      {props.children}
    </PaymentContext.Provider>
  );
}

export const usePaymentContext = () => useContext(PaymentContext);
