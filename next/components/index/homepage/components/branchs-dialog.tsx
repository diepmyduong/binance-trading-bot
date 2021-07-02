import React, { useEffect, useState } from "react";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { StatusTime } from "../../../shared/homepage-layout/status-time";
import useDevice from "../../../../lib/hooks/useDevice";
import { ShopBranch } from "../../../../lib/repo/shop-branch.repo";
interface Propstype extends DialogPropsType {
  onSelect?: (string) => void;
  shopBranchs: ShopBranch[];
}
const BranchsDialog = (props: Propstype) => {
  const branchs = [
    {
      place: "Quận 1",
      address: "172 Hai Bà Trưng, phường Đa Kao, Quận 1, thành phố Hồ Chí Minh",
      isActive: true,
      range: 1.2,
    },
    {
      place: "Quận 2",
      address: "65 đường Xuân Thủy, phường Thảo Điền, quận 2, Thành phố Hồ Chí Minh.",
      range: 1.2,
      isActive: true,
    },
    {
      place: "Quận 3",
      address: "414C – 414D Nguyễn Thị Minh Khai, Phường 5, Quận 3, Thành phố Hồ Chí Minh.",
      isActive: true,
      range: 1.2,
    },
    {
      place: "Quận 3",
      address: "Tầng trệt tòa nhà Số 538 đường CMT8, phường 11, quận 3, thành phố Hồ Chí Minh.",
      range: 1.2,
      isActive: true,
    },
    {
      place: "Quận 4",
      address: "192, 194 đường Khánh Hội, phường 6, quận 4, thành phố Hồ Chí Minh.",
      range: 1.2,
      isActive: true,
    },
    {
      place: "Quận 6",
      address: "10 – 12 đường Hậu Giang, Phường 2, Quận 6, Thành phố Hồ Chí Minh.",
      range: 1.2,
      isActive: true,
    },
  ];
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
      title={`Chọn chi nhánh (${branchs.length})`}
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
                <StatusTime isActive={item.isOpen} />
              </div>
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
            </div>
          ))}
        </div>
      </Dialog.Body>
    </Dialog>
  );
};

export default BranchsDialog;
