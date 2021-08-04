import React, { useEffect, useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { HiShoppingCart, HiArrowRight } from "react-icons/hi";
import { FaPercent } from "react-icons/fa";

import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Rating } from "../../../shared/homepage-layout/rating";
import { Button } from "../../../shared/utilities/form/button";
import { Img } from "../../../shared/utilities/img";
import { Spinner } from "../../../shared/utilities/spinner";
import { BannerPromtion } from "./banner-promtion";
import { BranchsDialog } from "./branchs-dialog";
import { CommentsDialog } from "./comments-dialog";
import { EmotionsEvaluate } from "./emotions-evaluate";
import { useHomeContext } from "../providers/homepage-provider";

interface Propstype extends ReactProps {}

export function ShopInfo(props: Propstype) {
  const { branchSelecting, shop } = useShopContext();
  return (
    <div className=" text-sm bg-white">
      <Img
        src={branchSelecting ? branchSelecting.coverImage : shop.shopCover}
        ratio169
        className="bannerShop relative"
      />
      <ShopBranch className="w-11/12 mx-auto relative -mt-6 mb-2" />
      <MoreInfomation />
      <BannerPromtion banner={shop.config.banners} />
    </div>
  );
}
const MoreInfomation = (props) => {
  const [showComments, setShowComments] = useState(false);
  const { shop, shopCode } = useShopContext();
  const { voucherShow } = useHomeContext();
  return (
    <>
      <div>
        <div className="flex items-center justify-between border-b px-4 ">
          <p className="flex items-center flex-1 text-ellipsis font-semibold text-primary">
            <i className="text-primary p-0.5 border rounded-full text-10 border-primary mr-1">
              {<FaPercent />}
            </i>
            {voucherShow ? voucherShow.description : "Chưa có khuyến mãi"}
          </p>
          <Button
            textPrimary
            text=" Xem thêm"
            className="pr-0 text-sm xs:text-base text-ellipsis w-28"
            icon={<AiOutlineRight />}
            iconPosition="end"
            iconClassName="text-gray-400"
            href={`/${shopCode}/promotion`}
          />
        </div>
        <div className="flex justify-between items-center px-4 ">
          {shop.config.rating > 0 ? (
            <Rating
              numRated={shop.config.ratingQty}
              rating={shop.config.rating}
              soldQty={shop.config.soldQty}
            />
          ) : (
            <div></div>
          )}
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
  if (!shopBranchs) return <Spinner />;
  return (
    <div className={`bg-white p-3 pb-0 rounded-md shadow-lg text-center  ${props.className || ""}`}>
      <h2 className="text-xl font-semibold pb-2 text-ellipsis-2">{shop.shopName}</h2>
      <p className="text-sm text-gray-400 pb-2 border-b">
        Thời gian làm món khoảng{" "}
        {branchSelecting?.shipPreparationTime || shop.config.shipPreparationTime}
      </p>
      <div className="flex justify-between items-center">
        <p className="whitespace-nowrap">
          {(!branchSelecting && "Chọn chi nhánh") || branchSelecting.name}
          {branchSelecting?.distance && (
            <span className="font-semibold"> - {branchSelecting?.distance}km</span>
          )}
        </p>
        <Button
          textPrimary
          onClick={() => setShowBranchs(true)}
          text={`(${shopBranchs.length})`}
          className="pl-6 pr-0 text-sm xs:text-base text-ellipsis"
          icon={<HiArrowRight />}
          iconPosition="end"
          iconClassName="text-gray-400 text-lg"
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
