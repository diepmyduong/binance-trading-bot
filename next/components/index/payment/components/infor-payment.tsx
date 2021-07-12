import { useEffect, useState } from "react";
import { Fa500Px, FaAddressCard, FaBlenderPhone, FaUserAlt } from "react-icons/fa";
import { Field } from "../../../shared/utilities/form/field";
import { Form, FormConsumer } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Select } from "../../../shared/utilities/form/select";
import BranchsDialog from "../../homepage/components/branchs-dialog";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { SaveButtonGroup } from "../../../shared/utilities/save-button-group";
import { AddressGroup } from "../../../shared/utilities/form/address-group";
import { useCartContext } from "../../../../lib/providers/cart-provider";
import { Spinner } from "../../../shared/utilities/spinner";
import { getAddressText } from "../../../../lib/helpers/get-address-text";
import { AddressService } from "../../../../lib/repo/address.repo";
import { compact } from "lodash";

export function InforPayment() {
  const [openDialog, setOpenDialog] = useState(false);
  const { orderInput, setOrderInput, draftOrder } = useCartContext();
  const [openInputAddress, setOpenInputAddress] = useState(false);
  const { shopBranchs, setBranchSelecting, branchSelecting } = useShopContext();
  const [addressTemp, setAddressTemp] = useState("");
  console.log("branchSelecting", branchSelecting);
  const getAddress = async (data, fullData) => {
    let fullAddress = {
      address: data.address || draftOrder?.order?.buyerAddress,
      ward: fullData.wardId?.label || draftOrder?.order?.buyerWard,
      district: fullData.districtId?.label || draftOrder?.order?.buyerDistrict,
      province: fullData.provinceId?.label || draftOrder?.order?.buyerProvince,
    };
    setAddressTemp(getAddressText(fullAddress));
  };

  return (
    <div className="pt-4 bg-white">
      <div className="">
        <TabCustom />
        <div className="px-4 pt-6 text-sm">
          <Form initialData={{ name: orderInput.buyerName, phone: orderInput.buyerPhone }}>
            <Field name="name" noError className="pb-2" required>
              <Input
                placeholder="Nhập tên người nhận"
                prefix={<FaUserAlt />}
                className="rounded-2xl bg-primary-light"
                onChange={(data) => setOrderInput({ ...orderInput, buyerName: data })}
              />
            </Field>
            <Field name="phone" noError className="pb-2" required>
              <Input
                type="text"
                placeholder="Nhập số điện thoại"
                prefix={<FaBlenderPhone />}
                className="rounded-2xl bg-primary-light"
                onChange={(data) => setOrderInput({ ...orderInput, buyerPhone: data })}
              />
            </Field>

            {orderInput.pickupMethod == "DELIVERY" ? (
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
                <div className="flex items-start pt-2 w-full">
                  <div className="flex flex-col">
                    {branchSelecting ? (
                      <>
                        <p className="font-semibold ">{branchSelecting.name}</p>
                        <p className="font-medium">
                          {getAddressText({
                            address: branchSelecting.address,
                            ward: branchSelecting.ward,
                            district: branchSelecting.district,
                            province: branchSelecting.province,
                          })}
                        </p>
                      </>
                    ) : (
                      <p className="font-medium">Chưa chọn chi nhánh</p>
                    )}
                  </div>
                  {/* <Button
                    text="Đổi chi nhánh"
                    textPrimary
                    unfocusable
                    className="px-0 py-0 ml-4 min-w-max text-sm"
                    onClick={() => setOpenDialog(true)}
                  /> */}
                </div>
                <div className="flex items-center justify-between pt-6">
                  <p className="">Chọn thời gian lấy:</p>
                  <SelectTime />
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
            initialData={{
              wardId: orderInput.buyerWardId,
              districtId: orderInput.buyerDistrictId,
              provinceId: orderInput.buyerProvinceId,
              address: orderInput.buyerAddress,
            }}
            isOpen={openInputAddress}
            onClose={() => setOpenInputAddress(false)}
            onSubmit={(data, fullData) => {
              console.log("fullData", fullData);
              setOrderInput({
                ...orderInput,
                buyerAddress: data.address,
                buyerWardId: data.wardId,
                buyerDistrictId: data.districtId,
                buyerProvinceId: data.provinceId,
              });
              getAddress(data, fullData);
              setOpenInputAddress(false);
            }}
          >
            <AddressGroup
              {...{
                wardId: orderInput.buyerWardId,
                districtId: orderInput.buyerDistrictId,
                provinceId: orderInput.buyerProvinceId,
                address: orderInput.buyerAddress,
              }}
              required
            />
            <SaveButtonGroup onCancel={() => setOpenInputAddress(false)} />
          </Form>
        </div>
      </div>
    </div>
  );
}

const SelectTime = () => {
  const { branchSelecting } = useShopContext();
  const { orderInput, setOrderInput } = useCartContext();
  const [times, setTimes] = useState<{ label: string; value: string }[]>([]);
  const getDate = (time) => {
    var today = new Date();
    return new Date(
      `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()} ${time}`
    ).toISOString();
  };
  const onChangeTime = (time) => {
    // let temp = getDate(time);
    setOrderInput({ ...orderInput, pickupTime: time });
  };
  const generateTime = () => {
    var today = new Date();
    var current_day = today.getDay();
    let openTimes = branchSelecting.operatingTimes;
    let closeTime, openTime;
    if (openTimes[0].day == 0) {
      openTime = openTimes[current_day].timeFrames[0][0];
      closeTime = openTimes[current_day].timeFrames[0][1];
    } else if (openTimes[0].day == 1) {
      openTime = openTimes[(current_day + 1) % 7].timeFrames[0][0];
      closeTime = openTimes[(current_day + 1) % 7].timeFrames[0][1];
    }
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
    let openT = new Date(getDate(openTime));
    let closeT = new Date(getDate(closeTime));
    for (var i = time; i < 24; i++) {
      for (var j = 0; j < 2; j++) {
        let temp = i + ":" + halfHours[j];
        let tempT = new Date(getDate(temp));
        if (openT <= tempT && closeT >= tempT)
          timess.push({ value: getDate(temp), label: i + ":" + halfHours[j] });
      }
    }
    timess.sort((a, b) => {
      return new Date(a.value) < new Date(b.value) ? -1 : 1;
    });
    console.log(timess);
    setTimes(timess);
  };
  useEffect(() => {
    console.log("times", times);
    if (times.length > 0) onChangeTime(times[0].value);
  }, [times]);
  useEffect(() => {
    generateTime();
  }, []);
  return (
    <Select
      onChange={(data) => onChangeTime(data)}
      options={times}
      className="w-32"
      searchable={false}
      native
    />
  );
};

const TabCustom = () => {
  const { orderInput, setOrderInput } = useCartContext();
  const options: { label: string; value: string }[] = [
    { label: "Giao hàng", value: "DELIVERY" },
    { label: "Lấy tại quán", value: "STORE" },
  ];
  //TODO: viết selected vào trong cart provider

  const handleClick = (index) => {
    setOrderInput({ ...orderInput, pickupMethod: options[index].value });
  };
  if (!orderInput) return <Spinner></Spinner>;
  return (
    <div className="relative flex items-center justify-center">
      {options.map((item, index) => {
        const selectedIndex = options[index].value == orderInput.pickupMethod;
        const last = index == options.length - 1;
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
            {item.label}
          </div>
        );
      })}
    </div>
  );
};
