import React, { useState } from "react";
import Rating from "../../../../shared/infomation/rating";
import { NumberPipe } from "../../../../../lib/pipes/number";
import { Img } from "../../../../shared/utilities/img";
import Price from "../../../../shared/infomation/price";
import { useCartContext } from "../../../../../lib/providers/cart-provider";
import { Form } from "../../../../shared/utilities/form/form";
import { RestaurantDetail } from "../restaurant-detail/detail";
interface PropsType extends ReactProps {
  list: {
    name: string;
    sold: number | string;
    des: string;
    price: number;
    img: string;
    rating?: number | string;
  }[];
  title: string;
}
const Menu = (props: PropsType) => {
  const { handleChange } = useCartContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [detailItem, setDetailItem] = useState<any>(null);
  return (
    <div id={props.title} className="relative menu main-container ">
      <div className=" absolute -top-28 menu-container"></div>
      <p className="font-semibold text-primary">{props.title}</p>
      {props.list.map((item, index) => (
        <div
          key={index}
          className="flex py-2 items-center"
          onClick={() => {
            setOpenDialog(true);
            setDetailItem(item);
          }}
        >
          <div className="flex-1">
            <p>{item.name}</p>
            <Rating rating={item.rating || 4.8} numRated={item.rating || 688} textSm />
            <p className="text-gray-400 text-sm">{item.des}</p>
            <Price price={item.price} textDanger />
          </div>
          <Img src={item.img} className="w-24 h-24 rounded-sm" />
        </div>
      ))}
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

export default Menu;
