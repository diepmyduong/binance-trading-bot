import React, { useState } from "react";
import { Promotion } from "../promotion";
import { Button } from "../../../../shared/utilities/form/button";

export function PromotionDetail() {
  const des = [
    {
      label: "Ưu đãi",
      content:
        "Lượt sử dụng có hạn. Nhanh tay kẻo lỡ bạn nhé! Mã Miễn phí vận chuyển | Đơn hàng từ 150K",
    },
    {
      label: "Có hiệu lực",
      content: "11.06.2021 00:00 - 11.06.2021 23:59",
    },
    {
      label: "Thiết bị",
      content: "Android, iOS",
    },
    {
      label: "Thanh Toán",
      content: "Tất cả các hình thức thanh toán",
    },
    {
      label: "Ưu đãi",
      content:
        "Lượt sử dụng có hạn. Nhanh tay kẻo lỡ bạn nhé! Mã Miễn phí vận chuyển | Đơn hàng từ 150K",
    },
    {
      label: "Ưu đãi",
      content:
        "Lượt sử dụng có hạn. Nhanh tay kẻo lỡ bạn nhé! Mã Miễn phí vận chuyển | Đơn hàng từ 150K",
    },
    {
      label: "Ưu đãi",
      content:
        "Lượt sử dụng có hạn. Nhanh tay kẻo lỡ bạn nhé! Mã Miễn phí vận chuyển | Đơn hàng từ 150K",
    },
    {
      label: "Ưu đãi",
      content:
        "Lượt sử dụng có hạn. Nhanh tay kẻo lỡ bạn nhé! Mã Miễn phí vận chuyển | Đơn hàng từ 150K",
    },
    {
      label: "Ưu đãi",
      content:
        "Lượt sử dụng có hạn. Nhanh tay kẻo lỡ bạn nhé! Mã Miễn phí vận chuyển | Đơn hàng từ 150K",
    },
  ];
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="text-sm bg-primary-light">
      <Promotion
        promotion={{
          name: "Giảm 40k cho đơn từ 150k",
          img:
            "https://file.hstatic.net/200000043306/file/banner_web_mobile_83c075fe49b44d8a8267ccd829a8748d.png",
          dated: "6/8/2021",
        }}
        onClick={() => {}}
      />
      <h3 className="text-2xl">Giảm 40k cho đơn từ 150k</h3>
      {des.map(
        (item, index) =>
          (showMore && (
            <div key={index}>
              <p className="pt-6">{item.label}</p>
              <p>{item.content}</p>
            </div>
          )) ||
          (index < 4 && (
            <div key={index}>
              <p className="pt-6">{item.label}</p>
              <p>{item.content}</p>
            </div>
          ))
      )}
      <Button
        text={`${showMore ? "Ẩn bớt" : "...xem chi tiết"}`}
        onClick={() => setShowMore(!showMore)}
      />
      <p>
        Sử dụng mã miễn phí vận chuyển (tối đa 15K) cho đơn hàng bất kỳ từ 150K thỏa điều kiện ưu
        đãi tại quán. Đơn vị vận chuyển khả dụng: tất cả Hình thức thanh toán: tất cả Mã chỉ được
        hoàn theo quy định của quán. Áp dụng khi mua các sản phẩm có sườn. Hạn sử dụng 23:59 -
        11/06/2021 Số lượt sử dụng có hạn, chương trình và mã có thể kết thúc khi hết lượt ưu đãi
        hoặc khi hết hạn ưu đãi, tùy điều kiện nào đến trước.
      </p>
    </div>
  );
}
