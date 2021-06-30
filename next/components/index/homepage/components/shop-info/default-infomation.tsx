import React, { useState } from "react";
import { Button } from "../../../../shared/utilities/form/button";
import BranchsDialog from "../branchs-dialog";
import { AiOutlineRight } from "react-icons/ai";
import { useShopContext } from "../../../../../lib/providers/shop-provider";
interface Propstype extends ReactProps {
  info: {
    name: string;
  };
}
const DefaultInfomation = (props: Propstype) => {
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

export default DefaultInfomation;
