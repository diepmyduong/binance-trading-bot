import React, { useState } from "react";
import { Dialog, DialogPropsType } from "../../../../shared/utilities/dialog/dialog";
import PromotionDetail from "./promotion-detail";
interface Propstype extends DialogPropsType {}

const PromotionDetailDialog = (props: Propstype) => {
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={"Mã khuyến mãi"}
      mobileSizeMode
      slideFromBottom="all"
    >
      <Dialog.Body>
        <PromotionDetail />
      </Dialog.Body>
    </Dialog>
  );
};

export default PromotionDetailDialog;
