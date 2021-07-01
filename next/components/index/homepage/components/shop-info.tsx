import React, { useEffect, useState } from "react";
import BannerPromtion from "./banner-promtion";
import { EmotionsEvaluate } from "./emotions-evaluate";
import { AiOutlineRight } from "react-icons/ai";
import { HiShoppingCart } from "react-icons/hi";
import { FaPercent } from "react-icons/fa";
import { MoneyBag, Package, SmileIcon } from "../../../../public/assets/svg/svg";
import { Button } from "../../../shared/utilities/form/button";
import { Rating } from "../../../shared/homepage-layout/rating";
import { CommentsDialog } from "./comments-dialog";
import BranchsDialog from "./branchs-dialog";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Img } from "../../../shared/utilities/img";
interface Propstype extends ReactProps {
  shop: any;
}

export function ShopInfo(props: Propstype) {
  return (
    <div className="relative text-sm bg-white">
      <Img
        src="https://file.hstatic.net/200000043306/file/trang-chu-pc-24-09-2020-1-02-4_d9ed746c78e148db9c3c9f42e1ffe9bb.png"
        ratio169
        className="bannerShop"
      />
      <ShopBranch
        className="center-item top-1/4 w-11/12 sm:mt-10"
        info={{ name: props.shop.shopName }}
      />
      <MoreInfomation />
      <BannerPromtion />
    </div>
  );
}
const MoreInfomation = (props) => {
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
  const [showComments, setShowComments] = useState(false);
  return (
    <>
      <div className={`pt-20`}>
        <div className="flex items-center justify-between border-b px-4 ">
          <p className="flex items-center">
            <i className="text-primary p-0.5 border rounded-full text-10 border-primary mr-1">
              {<FaPercent />}
            </i>{" "}
            Giảm 40k cho đơn từ 150k
          </p>
          <Button
            textPrimary
            text=" Xem thêm"
            className="pr-0 text-sm xs:text-base text-ellipsis"
            icon={<AiOutlineRight />}
            iconPosition="end"
            iconClassName="text-gray-400"
            href="/promotion"
          />
        </div>
        <div className="flex justify-between items-center px-4 ">
          <Rating numRated={344} rating={4.8} soldQty={688} />
          <Button
            textPrimary
            text="Xem bình luận"
            className="pr-0 text-sm xs:text-base text-ellipsis"
            icon={<AiOutlineRight />}
            iconPosition="end"
            iconClassName="text-gray-400"
            onClick={() => setShowComments(true)}
          />
        </div>
      </div>
      <EmotionsEvaluate reactions={reactions} />
      <CommentsDialog isOpen={showComments} onClose={() => setShowComments(false)} />
    </>
  );
};

interface ShopInfoProps extends ReactProps {
  info: {
    name: string;
  };
}

const ShopBranch = (props: ShopInfoProps) => {
  const [showBranchs, setShowBranchs] = useState(false);
  const { branchSelecting, setBranchSelecting } = useShopContext();

  return (
    <div className={`bg-white p-3 pb-0 rounded-md shadow-lg text-center  ${props.className || ""}`}>
      <h2 className="text-xl font-semibold pb-2">{props.info.name}</h2>
      <p className="text-sm text-gray-400 pb-2 border-b">Thời gian làm món khoảng 15 phút</p>
      <div className="flex justify-between items-center">
        <p className="whitespace-nowrap">
          {" "}
          {(!branchSelecting && "Có 23 chi nhánh") || branchSelecting}
        </p>
        <Button
          textPrimary
          onClick={() => setShowBranchs(true)}
          text="Xem chi nhánh khác"
          className="pr-0 text-sm xs:text-base text-ellipsis"
          icon={<AiOutlineRight />}
          iconPosition="end"
          iconClassName="text-gray-400"
        />
      </div>
      <BranchsDialog
        isOpen={showBranchs}
        onClose={() => setShowBranchs(false)}
        onSelect={(val) => setBranchSelecting(val)}
      />
    </div>
  );
};
