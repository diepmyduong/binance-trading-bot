import Link from "next/link";
import { Button } from "../../../shared/utilities/form/button";
import { ShopVoucher } from "../../../../lib/repo/shop-voucher.repo";
import formatDate from "date-fns/format";
import { PromotionDetailDialog } from "../../promotion/components/promotion-detail.tsx/promotion-detail-dialog";
import { useState } from "react";
interface Propstype extends ReactProps {
  voucher: ShopVoucher;
  onClick: (e: ShopVoucher) => void;
  showDetail: (e: ShopVoucher) => void;
}
export function TicketVoucher({ voucher, onClick, showDetail, ...props }: Propstype) {
  return (
    <div className="w-full flex items-center h-full">
      <div className="h-full w-2 bg-primary rounded-l-2xl"></div>
      <div className="w-full flex flex-col justify-center bg-white py-2 px-2 rounded-r-xl h-full">
        <div className="h-full w-full">
          <div className="text-sm font-bold">{voucher.description}</div>
          {voucher.endDate && (
            <p>HSD: {formatDate(new Date(voucher.endDate), "dd-MM-yyyy HH:mm")}</p>
          )}
        </div>
        <Button text="Xem chi tiết" textPrimary onClick={() => showDetail(voucher)} />
        {/* <Link href="">
          <a href="" className="text-xs font-semibold text-primary pt-1">
            Xem chi tiết
          </a>
        </Link> */}
      </div>
      <div className="rounded-r-2xl rounded-l-xl  flex items-center justify-center bg-white h-full px-2 border-l-2 border-dashed">
        <Button text="Chọn" className="px-0" textPrimary onClick={() => onClick(voucher)} />
      </div>
    </div>
  );
}
