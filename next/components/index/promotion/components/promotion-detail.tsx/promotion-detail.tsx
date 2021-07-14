import React, { useState } from "react";
import { Promotion } from "../promotion";
import { Button } from "../../../../shared/utilities/form/button";
import useDevice from "../../../../../lib/hooks/useDevice";
import { ShopVoucher } from "../../../../../lib/repo/shop-voucher.repo";
import formatDate from "date-fns/format";
interface Propstype extends ReactProps {
  promotion: ShopVoucher;
}

export function PromotionDetail({ promotion, ...props }: Propstype) {
  const des = [
    {
      label: "Ưu đãi",
      content: promotion.description,
    },
    {
      label: "Có hiệu lực",
      content: promotion.startDate
        ? `${formatDate(new Date(promotion.startDate), "dd-MM-yyyy HH:mm")} - ${formatDate(
            new Date(promotion.endDate),
            "dd-MM-yyyy HH:mm"
          )} `
        : "",
    },
    {
      label: "Phương thức thanh toán",
      content: promotion.applyPaymentMethods.map((item) => item).join(", "),
    },
    {
      label: "Giảm tối đa",
      content: promotion.maxDiscount,
    },
    {
      label: "Đơn hàng tối thiểu",
      content: promotion.minSubtotal,
    },
    {
      label: "Sảm phẩm tối thiểu",
      content: promotion.minItemQty,
    },
  ];
  const [showMore, setShowMore] = useState(false);
  const { isMobile } = useDevice();
  return (
    <div className={`text-sm bg-primary-light ${isMobile ? "pb-12" : ""}`}>
      {promotion && <Promotion promotion={promotion} />}
      <h3 className="text-2xl">{promotion.code}</h3>
      {des.map((item, index) => (
        <div key={index} className={`${item.content ? "" : "hidden"}`}>
          <p className="pt-4">{item.label}</p>
          <p>{item.content}</p>
        </div>
      ))}
      {/* )) ||
          (index < 4 && (
            <div key={index} className={`${item.content ? "" : "hidden"}`}>
              <p className="pt-6">{item.label}</p>
              <p>{item.content}</p>
            </div>
          ))
      <Button
        small
        text={`${showMore ? "Ẩn bớt" : "...xem chi tiết"}`}
        onClick={() => setShowMore(!showMore)}
      /> */}
      <p className="pt-4">{promotion.description}</p>
    </div>
  );
}
