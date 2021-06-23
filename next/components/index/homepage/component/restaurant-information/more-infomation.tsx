import React, { useState } from "react";
import { FaPercent } from "react-icons/fa";
import { HiShoppingCart, HiStar } from "react-icons/hi";
import { Package, SmileIcon, MoneyBag } from "../../../../../public/assets/svg/svg";
import Rating from "../../../../shared/infomation/rating";
import EmotionsEvaluate from "./emotions-evaluate";
import BranchsDialog from "../branch/branchs-dialog";
import PromotionsDialog from "../promotion/promotions-dialog";
import { Button } from "../../../../shared/utilities/form/button";
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
  const [showBranchs, setShowBranchs] = useState(false);
  const [showPromotions, setShowPromotions] = useState(false);
  return (
    <>
      <div className={`px-4 ${props.className || ""}`}>
        <div className="flex justify-between items-center border-b">
          <p>Có 23 chi nhánh</p>
          <Button
            textPrimary
            onClick={() => setShowBranchs(true)}
            text="Xem chi nhánh khác"
            className="pr-0"
          />
        </div>
        <div className="flex items-center justify-between border-b">
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
            className="pr-0"
          />
        </div>
        <div className="flex justify-between items-center ">
          <div className="flex items-center">
            <Rating numRated={344} rating={4.8} />
            <i className="text-lg ml-3">
              <HiShoppingCart />
            </i>
            <p className="text-gray-400"> (688+)</p>
          </div>
          <Button textPrimary text="Xem 365 bình luận" className="pr-0" />
        </div>
      </div>
      <EmotionsEvaluate reactions={reactions} />
      <BranchsDialog isOpen={showBranchs} onClose={() => setShowBranchs(false)} />
      <PromotionsDialog isOpen={showPromotions} onClose={() => setShowPromotions(false)} />
    </>
  );
};

export default MoreInfomation;
