import React, { useEffect, useState } from "react";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { StatusTime } from "../../../shared/homepage-layout/status-time";
import useDevice from "../../../../lib/hooks/useDevice";
import { ShopBranch } from "../../../../lib/repo/shop-branch.repo";
interface Propstype extends DialogPropsType {
  onSelect?: (string) => void;
  shopBranchs: ShopBranch[];
  selected: ShopBranch;
}
const BranchsDialog = (props: Propstype) => {
  const { isMobile } = useDevice();
  const [dayCur, setDayCur] = useState(0);
  useEffect(() => {
    let d = new Date();
    let n = d.getDay();
    setDayCur(n);
  }, []);
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={`Chọn chi nhánh (${props.shopBranchs.length})`}
      mobileSizeMode
      slideFromBottom="all"
      bodyClass="relative bg-white rounded"
    >
      <Dialog.Body>
        <div className={`flex flex-col text-sm sm:text-base ${isMobile ? "pb-12" : ""}`}>
          {props.shopBranchs.map((item: ShopBranch, index) => (
            <div className="flex px-4 mt-2 border-b pb-2" key={index}>
              <div className="flex-1 leading-7">
                <h3 className="text-primary text-base sm:text-lg">{item.name}</h3>
                <p className="text-ellipsis-2">{item.address}</p>
                <StatusTime isActive={item.isOpen} distance={item.distance} />
              </div>
              {item.isOpen && (
                <Button
                  outline
                  primary
                  text="Chọn"
                  className="rounded-full"
                  onClick={() => {
                    props.onSelect({ ...item });
                    props.onClose();
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </Dialog.Body>
    </Dialog>
  );
};

export default BranchsDialog;
