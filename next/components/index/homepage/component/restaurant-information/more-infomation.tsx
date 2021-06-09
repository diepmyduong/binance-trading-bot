import React from "react";
import { FaPercent } from "react-icons/fa";
import { HiShoppingCart, HiStar } from "react-icons/hi";
import { Package, SmileIcon, MoneyBag } from "../../../../../public/assets/svg/svg";
interface Propstype extends ReactProps {}
const MoreInfomation = (props: Propstype) => {
  const reactions = [
    {
      name: "Món ngon",
      value: 10,
      icon: SmileIcon,
    },
    {
      name: "Đóng gói đep",
      value: 10,
      icon: Package,
    },
    {
      name: "Đáng đồng tiền",
      value: 10,
      icon: MoneyBag,
    },
  ];
  return (
    <div className={` main-container   ${props.className}`}>
      <div className="flex justify-between items-center py-2 border-b">
        <p>Có 23 chi nhánh</p>
        <p className="text-primary cursor-pointer font-semibold">Xem chi nhánh khác</p>
      </div>
      <div className="flex items-center justify-between  py-2  border-b">
        <p className="flex items-center">
          <i className="text-primary p-0.5 border rounded-full text-10 border-primary mr-1">
            {<FaPercent />}
          </i>{" "}
          Giảm 40k cho đơn từ 150k
        </p>
        <p className="text-primary cursor-pointer font-semibold">Xem thêm</p>
      </div>
      <div className="flex justify-between items-center  py-2">
        <div className="flex items-center">
          <i className="text-warning text-lg">
            <HiStar />
          </i>
          <span className="font-bold mx-1">4.8</span>
          <p className="text-gray-400"> (688+)</p>
        </div>
        <div className="flex items-center">
          <i className="text-lg">
            <HiShoppingCart />
          </i>
          <p className="text-gray-400"> (688+)</p>
        </div>
        <p className="text-primary cursor-pointer font-semibold">Xem 365 bình luận</p>
      </div>
      <div className="flex justify-between items-center overflow-x-auto whitespace-nowrap">
        {reactions.map((item, key) => (
          <div key={key} className="flex bg-primary-light rounded-full mr-3 items-center p-1.5">
            <i className="mr-1.5">{item.icon}</i>
            <p>
              {item.name} ({item.value})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoreInfomation;
