import { Button } from "../../../shared/utilities/form/button";
import { ShopVoucher } from "../../../../lib/repo/shop-voucher.repo";
interface Propstype extends ReactProps {
  voucher: ShopVoucher;
  onClick: (e: ShopVoucher) => void;
  showDetail: (e: ShopVoucher) => void;
}
export function TicketVoucher({ voucher, onClick, showDetail, ...props }: Propstype) {
  return (
    <div className="flex items-center h-18 border-primary border-l-8 rounded-l-lg w-full">
      <div className="flex flex-col justify-between h-full bg-white py-2 px-2 rounded-r-xl flex-1 w-3/4">
        <div className="text-sm font-bold text-ellipsis-2">{voucher.description}</div>
        <Button
          text="Xem chi tiết"
          textPrimary
          onClick={() => showDetail(voucher)}
          className="justify-start p-0 text-xs h-3"
        />
        {/* <Link href="">
          <a href="" className="text-xs font-semibold text-primary pt-1">
            Xem chi tiết
          </a>
        </Link> */}
      </div>
      <Button
        text="Chọn"
        className="rounded-r-2xl rounded-l-xl flex items-center justify-center bg-white px-2 border-l-2 border-dashed h-18 "
        textPrimary
        onClick={() => onClick(voucher)}
      />
    </div>
  );
}
