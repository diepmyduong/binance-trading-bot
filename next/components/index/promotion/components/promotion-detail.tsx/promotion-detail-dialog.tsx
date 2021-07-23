import React, { useState } from "react";
import { Dialog, DialogPropsType } from "../../../../shared/utilities/dialog/dialog";
import { PromotionDetail } from "./promotion-detail";
import { ShopVoucher } from "../../../../../lib/repo/shop-voucher.repo";
import { Spinner } from "../../../../shared/utilities/spinner";
interface Propstype extends DialogPropsType {
  promotion: ShopVoucher;
}

export function PromotionDetailDialog(props: Propstype) {
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={"Mã khuyến mãi"}
      mobileSizeMode
      slideFromBottom="all"
    >
      <Dialog.Body>
        <div style={{ maxHeight: `calc(100vh - 150px)`, minHeight: `calc(100vh - 350px)` }}>
          {props.promotion ? <PromotionDetail promotion={props.promotion} /> : <Spinner />}
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
