import React from "react";
import { Dialog, DialogPropsType } from "../../../../shared/utilities/dialog/dialog";
import Branch from "./branch";
interface Propstype extends DialogPropsType {
  onSelect?: (string) => void;
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
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={`Chọn chi nhánh (${branchs.length})`}
      mobileSizeMode
      slideFromBottom="all"
    >
      <Dialog.Body>
        <div
          className="flex flex-col text-sm sm:text-base overscroll-y-auto"
          style={{ maxHeight: `calc(100vh - 250px)`, minHeight: `calc(100vh - 100px)` }}
        >
          {branchs.map((item, index) => (
            <Branch
              branch={item}
              key={index}
              onClick={() => {
                props.onSelect(item.address);
                props.onClose();
              }}
            />
          ))}
        </div>
      </Dialog.Body>
    </Dialog>
  );
};

export default BranchsDialog;
