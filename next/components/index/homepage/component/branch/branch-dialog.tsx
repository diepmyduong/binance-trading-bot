import React from "react";
import { Dialog, DialogPropsType } from "../../../../shared/utilities/dialog/dialog";
import Branchs from "./branchs";
interface Propstype extends DialogPropsType {}
const BranchDialog = (props: Propstype) => {
  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose} width="180px" title="Chọn chi nhánh">
      <Branchs />
    </Dialog>
  );
};

export default BranchDialog;
