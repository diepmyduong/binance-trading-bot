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
interface Propstype extends ReactProps {}

export function ShopInfo(props: Propstype) {
  const { branchSelecting, shop } = useShopContext();
  return (
    <div className="relative text-sm bg-white">
      <Img
        src={branchSelecting ? branchSelecting.coverImage : shop.shopCover}
        ratio169
        className="bannerShop"
      />
      <ShopBranch className="center-item top-1/4 w-11/12 sm:mt-10" />
      <MoreInfomation />
      <BannerPromtion banner={shop.config.banners} />
    </div>
  );
}
const MoreInfomation = (props) => {
  const [showComments, setShowComments] = useState(false);
  const { shop } = useShopContext();
  return (
    <>
      <div className={`pt-20`}>
        <div className="flex items-center justify-between border-b px-4 ">
          <p className="flex items-center flex-1 text-ellipsis">
            <i className="text-primary p-0.5 border rounded-full text-10 border-primary mr-1">
              {<FaPercent />}
            </i>{" "}
            Giảm 40k cho đơn từ 150k
          </p>
          <Button
            textPrimary
            text=" Xem thêm"
            className="pr-0 text-sm xs:text-base text-ellipsis w-28"
            icon={<AiOutlineRight />}
            iconPosition="end"
            iconClassName="text-gray-400"
            href="/promotion"
          />
        </div>
        <div className="flex justify-between items-center px-4 ">
          <Rating
            numRated={shop.config.ratingQty}
            rating={shop.config.rating}
            soldQty={shop.config.soldQty}
          />
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
      <EmotionsEvaluate reactions={shop.config.tags} shopName={shop.shopName} />
      <CommentsDialog isOpen={showComments} onClose={() => setShowComments(false)} />
    </>
  );
};

interface ShopInfoProps extends ReactProps {}

const ShopBranch = (props: ShopInfoProps) => {
  const [showBranchs, setShowBranchs] = useState(false);
  const { branchSelecting, setBranchSelecting, shopBranchs, shop } = useShopContext();

  return (
    <div className={`bg-white p-3 pb-0 rounded-md shadow-lg text-center  ${props.className || ""}`}>
      <h2 className="text-xl font-semibold pb-2">{shop.shopName}</h2>
      <p className="text-sm text-gray-400 pb-2 border-b">
        Thời gian làm món khoảng{" "}
        {branchSelecting?.shipPreparationTime || shop.config.shipPreparationTime}
      </p>
      <div className="flex justify-between items-center">
        <p className="whitespace-nowrap">
          {(!branchSelecting && shopBranchs.length + " chi nhánh") || branchSelecting.name}
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
      {shopBranchs && (
        <BranchsDialog
          isOpen={showBranchs}
          onClose={() => setShowBranchs(false)}
          onSelect={(val) => setBranchSelecting(val)}
          shopBranchs={shopBranchs}
        />
      )}
    </div>
  );
};
