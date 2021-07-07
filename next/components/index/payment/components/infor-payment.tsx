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
import { Spinner } from "../../../shared/utilities/spinner";
import { getAddressText } from "../../../../lib/helpers/get-address-text";
import { HereMapService } from "../../../../lib/repo/map.repo";
import { Console } from "console";

export function InforPayment({ onChange }) {
  const [openDialog, setOpenDialog] = useState(false);
  const { orderInput, setOrderInput } = useCartContext();
  const [times, setTimes] = useState([]);
  const [openInputAddress, setOpenInputAddress] = useState(false);
  const { shopBranchs, setBranchSelecting, branchSelecting } = useShopContext();
  const [addressTemp, setAddressTemp] = useState("");
  useEffect(() => {}, [addressTemp]);

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
  //TODO: viết tách ra input time thành 1 component mới
  useEffect(() => {
    generateTime();
  }, []);
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
            initialData={{
              wardId: orderInput.buyerWardId,
              districtId: orderInput.buyerDistrictId,
              provinceId: orderInput.buyerProvinceId,
              address: orderInput.buyerAddress,
            }}
            isOpen={openInputAddress}
            onClose={() => setOpenInputAddress(false)}
            onSubmit={async (data, fullData) => {
              console.log("fullData", fullData);
              setOrderInput({
                ...orderInput,
                buyerAddress: data.address,
                buyerWardId: data.wardId,
                buyerDistrictId: data.districtId,
                buyerProvinceId: data.provinceId,
              });
              let fullAddress = {
                ward: fullData.wardId?.label || "",
                province: fullData.provinceId?.label || "",
                district: fullData.districtId?.label || "",
                address: data.address || "",
              };
              setAddressTemp(getAddressText(fullAddress));
              let location = {
                type: "Point",
                coordinates: [106.6968302, 10.7797855],
              };
              let res = await HereMapService.getCoordinatesFromAddress(getAddressText(fullAddress));
              if (res) {
                location.coordinates = [res.position.lng, res.position.lat];
              }
              console.log("location.coordinates", location.coordinates);
              setOrderInput({
                ...orderInput,
                longitude: location.coordinates[0],
                latitude: location.coordinates[1],
              });
              setOpenInputAddress(false);
            }}
          >
            <AddressGroup required />
            <SaveButtonGroup onCancel={() => setOpenInputAddress(false)} />
          </Form>
        </div>
      </div>
    </div>
  );
}

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
