import { useEffect, useState } from "react";
import { Fa500Px, FaAddressCard, FaBlenderPhone, FaUserAlt } from "react-icons/fa";
import { Dialog } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { Field } from "../../../shared/utilities/form/field";
import { Form, FormConsumer } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Select } from "../../../shared/utilities/form/select";
import BranchsDialog from "../../homepage/components/branchs-dialog";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { SaveButtonGroup } from "../../../shared/utilities/save-button-group";
import { AddressGroup } from "../../../shared/utilities/form/address-group";
import { useCartContext } from "../../../../lib/providers/cart-provider";

export function InforPayment({ onChange, onChangeFullAddress }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [times, setTimes] = useState([]);
  const [fullAddress, setFullAddress] = useState({});
  const [address, setAddress] = useState({});
  const getPhone = () => {
    if (typeof window === "undefined") return;
    return localStorage.getItem("phoneUser");
  };
  const [inforBuyer, setInforBuyer] = useState({
    name: "",
    phone: "",
  });
  useEffect(() => {
    onChange({ name: inforBuyer.name, phone: inforBuyer.phone, address: address });
  }, [address, inforBuyer]);
  const [openInputAddress, setOpenInputAddress] = useState(false);
  const { shopBranchs, setBranchSelecting, branchSelecting } = useShopContext();
  const { order } = useCartContext();
  const [addressTemp, setAddressTemp] = useState("");
  useEffect(() => {
    if (
      order.order?.buyerAddress &&
      order.order?.buyerWard &&
      order.order?.buyerDistrict &&
      order.order?.buyerProvince
    ) {
      setAddressTemp(
        order.order.buyerAddress +
          ", " +
          order.order.buyerWard +
          ", " +
          order.order.buyerDistrict +
          ", " +
          order.order.buyerProvince
      );
    }
  }, [order]);
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
          <Form
            onChange={(data) => {
              setInforBuyer({ ...data });
            }}
          >
            <Field name="name" noError className="pb-2" required>
              <Input
                placeholder="Nhập tên người nhận"
                prefix={<FaUserAlt />}
                className="rounded-2xl bg-primary-light"
              />
            </Field>
            <Field name="phone" noError className="pb-2" required>
              <Input
                type="text"
                value={getPhone()}
                placeholder="Nhập số điện thoại"
                prefix={<FaBlenderPhone />}
                className="rounded-2xl bg-primary-light"
              />
            </Field>

            {selectedIndex == 0 ? (
              <div
                className=""
                onClick={() => {
                  setOpenInputAddress(true);
                }}
              >
                <Field noError className="pb-2">
                  <Input
                    readonly
                    value={addressTemp}
                    type="text"
                    placeholder="Nhập địa chỉ giao đến"
                    prefix={<FaAddressCard />}
                    className="rounded-2xl bg-primary-light"
                  />
                </Field>
              </div>
            ) : (
              <div className="py-2">
                <div className="font-bold">Chi nhánh</div>
                <div className="flex items-start justify-between pt-2">
                  <div className="flex flex-col">
                    {branchSelecting ? (
                      <>
                        <p className="font-medium">{branchSelecting.name}</p>
                        <p className="font-medium">{branchSelecting.address}</p>
                      </>
                    ) : (
                      <p className="font-medium">Chưa chọn chi nhánh</p>
                    )}
                  </div>
                  <Button
                    text="Đổi chi nhánh"
                    textPrimary
                    unfocusable
                    className="px-0 py-0 ml-4 min-w-max text-sm"
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
          {shopBranchs && (
            <BranchsDialog
              shopBranchs={shopBranchs}
              onClose={() => setOpenDialog(false)}
              isOpen={openDialog}
              onSelect={(branch) => {
                setBranchSelecting(branch);
              }}
            />
          )}
          <Form
            dialog
            mobileSizeMode
            initialData={address}
            isOpen={openInputAddress}
            onClose={() => setOpenInputAddress(false)}
            onSubmit={(data, fullData) => {
              console.log(fullData);
              setAddress({ ...data });
              onChangeFullAddress(fullAddress);
              setOpenInputAddress(false);
            }}
            onChange={(data, fullData) => {
              // console.log(fullData);
              // if (fullData?.provinceId)
              //   setFullAddress({ ...fullAddress, provinceId: fullData.provinceId });
              // if (fullData?.districtId)
              //   setFullAddress({ ...fullAddress, districtId: fullData.districtId });
              // if (fullData?.wardId) setFullAddress({ ...fullAddress, wardId: fullData.wardId });
              // if (fullData?.address != null)
              //   setFullAddress({ ...fullAddress, address: fullData.address });
            }}
          >
            <AddressGroup {...address} required />
            <SaveButtonGroup onCancel={() => setOpenInputAddress(false)} />
          </Form>
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
