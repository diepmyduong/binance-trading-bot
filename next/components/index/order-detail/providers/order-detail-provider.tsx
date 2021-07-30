import { createContext, useContext, useEffect, useState } from "react";
import { Order, OrderService, ORDER_STATUS } from "../../../../lib/repo/order.repo";
import cloneDeep from "lodash/cloneDeep";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { useRouter } from "next/router";
import { ShopTag } from "../../../../lib/repo/shop-config.repo";
import { ShopCommentService } from "../../../../lib/repo/shop-comment.repo";
import { useCartContext, CartProduct } from "../../../../lib/providers/cart-provider";
import { useShopContext } from "../../../../lib/providers/shop-provider";

export const OrderDetailContext = createContext<
  Partial<{
    order: Order;
    status: Option;
    loading: boolean;
    setLoading: Function;
    isInterval: boolean;
    tags: ShopTag[];
    // cancelOrder: (id: string, note: string) => any;
    addTags: (tag: ShopTag) => any;
    commentOrder: (inputData: { message: string; rating: number }) => any;
    reOrderClick: () => any;
  }>
>({});
interface PropsType extends ReactProps {
  id: string;
}
export function OrderDetailProvider({ id, ...props }: PropsType) {
  const { shopCode, customer } = useShopContext();
  const { reOrder } = useCartContext();
  const [order, setOrder] = useState<Order>(null);
  const alert = useAlert();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Option>(null);
  const [isInterval, setIsInterval] = useState(false);
  const [tags, setTags] = useState<ShopTag[]>([]);
  const toast = useToast();
  const router = useRouter();
  function addTags(tag: ShopTag) {
    let newTags = tags;
    let tI = newTags.findIndex((t) => t.name === tag.name);
    if (tI !== -1) {
      newTags.splice(tI, 1);
    } else {
      newTags.push({ name: tag.name, icon: tag.icon, qty: tag.qty });
    }
    setTags(cloneDeep(newTags));
  }
  function commentOrder(inputData: { message: string; rating: number }) {
    const { message, rating } = inputData;
    ShopCommentService.mutate({
      mutation: `
      commentOrder( orderId:$orderId
        message:$message
        rating:$rating
        tags:$tags
      )`,
      variablesParams: `( $orderId:ID!
        $message:String!
        $rating:Int!
        $tags:[ShopTagInput]!)`,
      options: {
        variables: {
          orderId: order.id,
          message,
          rating,
          tags,
        },
      },
    }).then((res) => {
      toast.success(res.data.g0);
      loadOrder(id);
    });
    // mutation: `
    //     memberUpdateMe(data: $data) {
    //       ${MemberService.fullFragment}
    //     }
    //   `,
    //   variablesParams: `($data: UpdateMemberInput!)`,
    //   options: {
    //     variables: {
    //       data,
    //     },
    //   },
    // ShopCommentService.createOrUpdate({
    //   data: { ownerName: order.buyerName, message, rating, tags },
    // }).then((res) => {
    //   console.log(res);
    //   setLoading(false);
    //   toast.success("Bình luận thành công");
    // });
  }
  useEffect(() => {
    loadOrder(id);
    let interval = setInterval(() => {
      OrderService.getOne({ id, cache: false })
        .then((res) => {
          setOrder(cloneDeep(res));
          if (
            res.status !== "PENDING" &&
            res.status !== "CONFIRMED" &&
            res.status !== "DELIVERING"
          ) {
            setIsInterval(false);
            clearInterval(interval);
          } else {
            if (status && res.status !== status.value) {
              toast.info(res.statusText);
            }
          }
        })
        .catch(async (err) => {
          console.error(err);
          let res = await alert.error("Xem chi tiết đơn hàng thất bại", err.message);
          if (res) {
            setIsInterval(false);
            clearInterval(interval);
            if (customer) {
              router.replace("/order");
            } else {
              router.replace(`/${shopCode}`);
            }
          }
        });
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (order) {
      let sta = ORDER_STATUS.find((x) => x.value === order.status);
      console.log(sta);
      if (sta) setStatus(cloneDeep(sta));
    }
  }, [order]);
  // function cancelOrder(id: string, note: string) {
  //   OrderService.cancelOrder(id, note)
  //     .then((res) => {
  //       setOrder(cloneDeep(res));
  //       console.log(res);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       alert.error("Hủy đơn hàng thất bại", err.message);
  //       loadOrder(id);
  //       setLoading(false);
  //     });
  // }
  const loadOrder = (id: string) => {
    OrderService.getOne({ id, cache: false })
      .then((res) => {
        if (
          res.pickupMethod === "DELIVERY" &&
          (res.status === "PENDING" || res.status === "CONFIRMED" || res.status === "DELIVERING")
        ) {
          setIsInterval(true);
        }
        setOrder(cloneDeep(res));
      })
      .catch((err) => {
        console.error(err);
        alert.error("Xem chi tiết đơn hàng thất bại", err.message);
      });
  };
  function reOrderClick() {
    const {
      promotionCode,
      buyerName,
      buyerPhone,
      pickupMethod,
      shopBranchId,
      pickupTime,
      buyerAddress,
      buyerProvinceId,
      buyerDistrictId,
      buyerWardId,
      buyerFullAddress,
      buyerAddressNote,
      latitude,
      longitude,
      paymentMethod,
      note,
    } = order;

    // toppingId: string;
    // toppingName: string;
    // optionName: string;
    // price: number;
    reOrder(order.items, {
      promotionCode,
      buyerName,
      buyerPhone,
      pickupMethod,
      shopBranchId,
      pickupTime,
      buyerAddress,
      buyerProvinceId,
      buyerDistrictId,
      buyerWardId,
      buyerFullAddress,
      buyerAddressNote,
      latitude,
      longitude,
      paymentMethod,
      note,
    });
  }
  return (
    <OrderDetailContext.Provider
      value={{
        order,
        status,
        loading,
        setLoading,
        // cancelOrder,
        isInterval,
        tags,
        addTags,
        commentOrder,
        reOrderClick,
      }}
    >
      {props.children}
    </OrderDetailContext.Provider>
  );
}

export const useOrderDetailContext = () => useContext(OrderDetailContext);
export const OrderConsumer = ({
  children,
}: {
  children: (props: Partial<{ order: Order }>) => any;
}) => {
  return <OrderDetailContext.Consumer>{children}</OrderDetailContext.Consumer>;
};
