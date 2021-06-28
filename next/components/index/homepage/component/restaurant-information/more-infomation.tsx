import React, { useState } from "react";
import { FaPercent } from "react-icons/fa";
import { HiShoppingCart, HiStar } from "react-icons/hi";
import { Package, SmileIcon, MoneyBag } from "../../../../../public/assets/svg/svg";
import Rating from "../../../../shared/infomation/rating";
import EmotionsEvaluate from "./emotions-evaluate";
import BranchsDialog from "../branch/branchs-dialog";
import PromotionsDialog from "../promotion/promotions-dialog";
import { Button } from "../../../../shared/utilities/form/button";
import { AiOutlineRight } from "react-icons/ai";
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
  const [showPromotions, setShowPromotions] = useState(false);
  return (
    <>
      <div className={`${props.className || ""}`}>
        <div className="flex items-center justify-between border-b px-4 ">
          <p className="flex items-center">
            <i className="text-primary p-0.5 border rounded-full text-10 border-primary mr-1">
              {<FaPercent />}
            </i>{" "}
            Giảm 40k cho đơn từ 150k
          </p>
          <Button
            textPrimary
            onClick={() => setShowPromotions(true)}
            text=" Xem thêm"
            className="pr-0 text-sm xs:text-base text-ellipsis"
            icon={<AiOutlineRight />}
            iconPosition="end"
            iconClassName="text-gray-400"
          />
        </div>
        <div className="flex justify-between items-center px-4 ">
          <div className="flex items-center">
            <Rating numRated={344} rating={4.8} />
            <i className="text-lg ml-3">
              <HiShoppingCart />
            </i>
            <p className="text-gray-400"> (688+)</p>
          </div>
          <Button
            textPrimary
            text="Xem bình luận"
            className="pr-0 text-sm xs:text-base text-ellipsis"
            icon={<AiOutlineRight />}
            iconPosition="end"
            iconClassName="text-gray-400"
          />
        </div>
      </div>
      <EmotionsEvaluate reactions={reactions} />
      <PromotionsDialog isOpen={showPromotions} onClose={() => setShowPromotions(false)} />
    </>
  );
};

export default MoreInfomation;
