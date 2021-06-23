import React, { useState } from "react";
import { NumberPipe } from "../../../../../lib/pipes/number";
import { Img } from "../../../../shared/utilities/img";
import Price from "../../../../shared/infomation/price";
import { useCartContext } from "../../../../../lib/providers/cart-provider";
import { Form } from "../../../../shared/utilities/form/form";
import { RestaurantDetail } from "../restaurant-detail/detail";
import { useRouter } from "next/router";
interface Propstype extends ReactProps {}
const MustTryMenu = (props: Propstype) => {
  const tryFood = [
    {
      img:
        "https://product.hstatic.net/200000043306/product/combo-tho_75f95928d32648438ac8927bdbdcb06e_grande.png",
      name: "Combo Phúc",
      code: "BNJ432",
      price: 119000,
    },
    {
      img:
        "https://product.hstatic.net/200000043306/product/combo-tho_75f95928d32648438ac8927bdbdcb06e_grande.png",
      name: "Combo Lộc",
      code: "BNJ432",
      price: 119000,
    },
    {
      img:
        "https://product.hstatic.net/200000043306/product/combo-tho_75f95928d32648438ac8927bdbdcb06e_grande.png",
      name: "Combo Thọ",
      code: "BNJ432",
      price: 119000,
    },
    {
      img:
        "https://product.hstatic.net/200000043306/product/combo-tho_75f95928d32648438ac8927bdbdcb06e_grande.png",
      name: "Combo Phúc Lộc Thọ",
      code: "BNJ432",
      price: 119000,
    },
  ];
  const router = useRouter();
  const query = router.query;
  const { handleChange } = useCartContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [detailItem, setDetailItem] = useState<any>(null);
  return (
    <div className="main-container">
      <h3 className="font-semibold pb-2">Nhất định phải thử</h3>
      <div className="grid grid-cols-2">
        {tryFood.map((item, index) => (
          <div
            className="col-span-1"
            key={index}
            onClick={() => {
              setDetailItem(item);
              setOpenDialog(true);
              router.replace({ query: { ...query, productId: item.code }, path: "/" });
            }}
          >
            <Img src={item.img} ratio169 className="min-w-4xs rounded-sm" />
            <p>{item.name}</p>
            <Price price={item.price} textDanger />
          </div>
        ))}
      </div>
      <Form
        dialog
        isOpen={openDialog}
        mobileMode
        onClose={() => setOpenDialog(false)}
        className="z-400 rounded w-full"
      >
        <RestaurantDetail item={detailItem} onClose={() => setOpenDialog(false)}></RestaurantDetail>
      </Form>
    </div>
  );
};

export default MustTryMenu;
