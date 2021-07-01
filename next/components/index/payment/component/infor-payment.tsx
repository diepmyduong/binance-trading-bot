import { useEffect, useState } from "react";
import { Fa500Px, FaAddressCard, FaBlenderPhone, FaUserAlt } from "react-icons/fa";
import { Dialog } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Select } from "../../../shared/utilities/form/select";
import BranchsDialog from "../../homepage/components/branchs-dialog";

export function InforPayment() {
  const initData = {
    name: "Nguyễn Văn A",
    phone: "0869698360",
    address: "749 Nguyễn Văn Linh Quận 7 TPHCM ",
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [times, setTimes] = useState([]);
  const [branch, setBranch] = useState(
    "110 Nguyễn Văn Linh, F. Tân Thuận Tây, Quận 7, Hồ Chí Minh"
  );
  const generateTime = () => {
    var today = new Date();
    var time = today.getHours();
    var min = today.getMinutes();
    var halfHours = ["00", "30"];
    if (min < 30) {
      halfHours = ["30", "00"];
    } else {
      halfHours = ["00", "30"];
      time++;
    }
    var timess = [];
    for (var i = time; i < 24; i++) {
      for (var j = 0; j < 2; j++) {
        timess.push(i + ":" + halfHours[j]);
      }
    }
    setTimes(timess);
  };
  useEffect(() => {
    generateTime();
  }, []);
  return (
    <div className="pt-4 bg-white">
      <div className="">
        <TabCustom
          tab={["Giao hàng", "Lấy tại quán"]}
          onChange={(index) => {
            setSelectedIndex(index);
          }}
        />
        <div className="px-4 pt-6 text-sm">
          <Form initialData={initData}>
            <Field name="name">
              <Input
                placeholder="Nhập tên người nhận"
                prefix={<FaUserAlt />}
                className="rounded-2xl bg-primary-light"
              />
            </Field>
            <Field name="phone">
              <Input
                type="number"
                placeholder="Nhập số điện thoại"
                prefix={<FaBlenderPhone />}
                className="rounded-2xl bg-primary-light"
              />
            </Field>

            {selectedIndex == 0 ? (
              <Field name="address">
                <Input
                  type="text"
                  placeholder="Nhập địa chỉ giao đến"
                  prefix={<FaAddressCard />}
                  className="rounded-2xl bg-primary-light"
                />
              </Field>
            ) : (
              <div className="pb-4">
                <div className="font-bold">Quán chi nhánh 1</div>
                <div className="flex items-start justify-between">
                  <p className="font-medium">{branch}</p>
                  <Button
                    text="Đổi chi nhánh"
                    textPrimary
                    unfocusable
                    className="px-0 py-0 min-w-max text-sm"
                    onClick={() => setOpenDialog(true)}
                  />
                </div>
                <div className="flex items-center justify-between pt-6">
                  <p className="">Chọn thời gian lấy:</p>
                  <Select
                    options={times.map((item) => ({ value: item, label: item }))}
                    className="w-32"
                    searchable={false}
                    native
                  />
                </div>
              </div>
            )}
          </Form>
          <BranchsDialog
            onClose={() => setOpenDialog(false)}
            isOpen={openDialog}
            onSelect={(br) => {
              setBranch(br);
            }}
          />
        </div>
      </div>
    </div>
  );
}
interface PropType extends ReactProps {
  onChange: (number) => void;
  tab: string[];
}
const TabCustom = ({ onChange, tab }: PropType) => {
  const [selected, setSelected] = useState(0);
  const handleClick = (index) => {
    setSelected(index);
    onChange(index);
  };
  return (
    <div className="relative flex items-center justify-center">
      {tab.map((item, index) => {
        const selectedIndex = index == selected;
        const last = index == tab.length - 1;
        const first = index == 0;
        return (
          <div
            className={`w-32 text-sm cursor-pointer flex justify-center items-center py-1 px-1 rounded border border-gray-400 
            ${last && "rounded-l-none border-l-0 "}
            ${first && "rounded-r-none border-r-0 "}  
            ${selectedIndex ? " text-white bg-primary " : "text-gray-500"}
            `}
            key={index}
            onClick={() => handleClick(index)}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

const selectBranch = () => {
  return <div className=""></div>;
};

const dataListBranch = [
  {
    district: "Quận 1",
    branch: [
      {
        address: "172 Hai Bà Trưng, phường Đa Kao, Quận 1, thành phố Hồ Chí Minh",
        open: 9,
        close: 21,
      },
    ],
  },
  {
    district: "Quận 2",
    branch: [
      {
        address: "65 đường Xuân Thủy, phường Thảo Điền, quận 2, Thành phố Hồ Chí Minh.",
        open: 9,
        close: 21,
      },
    ],
  },
  {
    district: "Quận 3",
    branch: [
      {
        address: "414C – 414D Nguyễn Thị Minh Khai, Phường 5, Quận 3, Thành phố Hồ Chí Minh ",
        open: 9,
        close: 21,
      },
      {
        address: "Tầng trệt tòa nhà Số 538 đường CMT8, phường 11, quận 3, thành phố Hồ Chí Minh ",
        open: 9,
        close: 21,
      },
    ],
  },
  {
    district: "Quận 4",
    branch: [
      {
        address: "192, 194 đường Khánh Hội, phường 6, quận 4, thành phố Hồ Chí Minh",
        open: 9,
        close: 21,
      },
    ],
  },
  {
    district: "Quận 6",
    branch: [
      {
        address: "10 – 12 đường Hậu Giang, Phường 2, Quận 6, Thành phố Hồ Chí Minh",
        open: 9,
        close: 21,
      },
    ],
  },
];
